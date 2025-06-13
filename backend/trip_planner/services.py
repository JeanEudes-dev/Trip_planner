import os
import datetime
import polyline
import requests

# Get your ORS API key from env (set in your .env file or EC2 config)
ORS_API_KEY = "5b3ce3597851110001cf62488be9b19052634ae7865a819c284df12f"

# Custom exceptions for better error handling
class TripPlanningError(Exception):
    """Base exception for trip planning errors"""
    pass

class GeocodingError(TripPlanningError):
    """Exception raised when geocoding fails"""
    pass

class RouteCalculationError(TripPlanningError):
    """Exception raised when route calculation fails"""
    pass

class DistanceLimitExceededError(RouteCalculationError):
    """Exception raised when route distance exceeds API limits"""
    pass

# --- 1. Geocoding ---
def geocode(address):
    """
    Geocode an address using OpenRouteService API.
    
    Args:
        address (str): Address to geocode
        
    Returns:
        list: [lat, lng] coordinates
        
    Raises:
        GeocodingError: If geocoding fails
    """
    try:
        url = "https://api.openrouteservice.org/geocode/search"
        resp = requests.get(url, params={
            "api_key": ORS_API_KEY,
            "text": address,
            "size": 1
        }, timeout=10)
        
        if resp.status_code != 200:
            raise GeocodingError(f"Geocoding service returned status {resp.status_code} for address: {address}")
        
        data = resp.json()
        features = data.get("features")
        if not features:
            raise GeocodingError(f"Could not find location for address: {address}. Please check the address and try again.")
        
        coords = features[0]["geometry"]["coordinates"]  # [lng, lat]
        return coords[::-1]  # [lat, lng]
    
    except requests.exceptions.Timeout:
        raise GeocodingError(f"Geocoding request timed out for address: {address}. Please try again.")
    except requests.exceptions.RequestException as e:
        raise GeocodingError(f"Network error while geocoding address '{address}': {str(e)}")
    except (KeyError, IndexError) as e:
        raise GeocodingError(f"Invalid response format from geocoding service for address: {address}")
    except Exception as e:
        if isinstance(e, GeocodingError):
            raise
        raise GeocodingError(f"Unexpected error while geocoding address '{address}': {str(e)}")

# --- 2. Directions ---
def get_route_coords(points):
    """
    Get route coordinates and distance from OpenRouteService.
    
    Args:
        points (list): List of [lat, lng] coordinate pairs
        
    Returns:
        tuple: (geometry, distance_miles)
        
    Raises:
        RouteCalculationError: If route calculation fails
        DistanceLimitExceededError: If route distance exceeds API limits
    """
    try:
        url = "https://api.openrouteservice.org/v2/directions/driving-car"
        body = {
            "coordinates": [[pt[1], pt[0]] for pt in points],  # [[lng,lat], ...]
            "instructions": False
        }
        headers = {"Authorization": ORS_API_KEY}
        
        resp = requests.post(url, json=body, headers=headers, timeout=30)
        
        if resp.status_code != 200:
            try:
                error_data = resp.json()
                error_code = error_data.get('code')
                error_message = error_data.get('message', 'Unknown error')
                
                if error_code == 2004:
                    # Distance limit exceeded error
                    raise DistanceLimitExceededError(
                        "The route distance exceeds the maximum limit of approximately 3,728 miles (6,000 km). "
                        "Please plan shorter routes or consider breaking your trip into multiple segments."
                    )
                elif error_code == 2003:
                    raise RouteCalculationError(
                        "One or more locations are too far from any road network. "
                        "Please check your addresses and try again."
                    )
                elif error_code == 2000:
                    raise RouteCalculationError(
                        "Invalid coordinates provided. Please check your addresses and try again."
                    )
                else:
                    raise RouteCalculationError(f"Route calculation failed: {error_message}")
                    
            except ValueError:
                # Response is not JSON
                raise RouteCalculationError(f"Route service returned error {resp.status_code}. Please try again.")
        
        try:
            data = resp.json()
        except ValueError:
            raise RouteCalculationError("Invalid response from route service. Please try again.")


        if "routes" not in data or not data["routes"]:
            error_info = data.get('error', data)
            raise RouteCalculationError(f"No route found between the specified locations: {error_info}")

        route = data["routes"][0]
        geometry_poly = route["geometry"]  # Encoded polyline string
        geometry = polyline.decode(geometry_poly)      # List of (lat, lon)
        distance_m = route["summary"]["distance"]
        distance_miles = distance_m / 1609.34
        
        return geometry, distance_miles
        
    except requests.exceptions.Timeout:
        raise RouteCalculationError("Route calculation request timed out. Please try again.")
    except requests.exceptions.RequestException as e:
        raise RouteCalculationError(f"Network error while calculating route: {str(e)}")
    except (KeyError, IndexError) as e:
        raise RouteCalculationError("Invalid response format from route service.")
    except Exception as e:
        if isinstance(e, (RouteCalculationError, DistanceLimitExceededError)):
            raise
        raise RouteCalculationError(f"Unexpected error while calculating route: {str(e)}")

# --- 3. Generate Stops ---
def generate_stops(geometry, trip_points, distance):
    stops = []
    order = 0
    # Start (current location)
    stops.append({
        "lat": trip_points[0][0],
        "lng": trip_points[0][1],
        "stop_type": "start",
        "order": order,
        "description": "Current Location"
    })
    order += 1
    # Pickup
    stops.append({
        "lat": trip_points[1][0],
        "lng": trip_points[1][1],
        "stop_type": "pickup",
        "order": order,
        "description": "Pickup Location"
    })
    order += 1

    # Fuel stop every 1000 miles
    fuel_every_m = 1609340
    n_fuels = int(distance * 1609.34 // fuel_every_m)
    geometry_len = len(geometry)
    for i in range(1, n_fuels + 1):
        pos = int(i * fuel_every_m / (distance * 1609.34) * geometry_len)
        if pos < geometry_len:
            lat, lng = geometry[pos][0], geometry[pos][1]  # (lat, lon)
            stops.append({
                "lat": lat,
                "lng": lng,
                "stop_type": "fuel_stop",
                "order": order,
                "description": f"Fuel Stop {i}"
            })
            order += 1

    # Dropoff
    stops.append({
        "lat": trip_points[2][0],
        "lng": trip_points[2][1],
        "stop_type": "dropoff",
        "order": order,
        "description": "Dropoff Location"
    })

    stops.sort(key=lambda x: x['order'])
    return stops

# --- 4. Generate Accurate HOS/ELD Logs ---
def to_hhmm(hour_float):
    """Convert float hour (e.g. 13.5) to '13:30' string."""
    h = int(hour_float)
    m = int(round((hour_float - h) * 60))
    return f"{h:02d}:{m:02d}"

def hos_generate_logs(distance, start_datetime, cycle_hours_used=0.0):
    MAX_DRIVING_HOURS_PER_DAY = 11
    MAX_ON_DUTY_HOURS_PER_DAY = 14
    REQUIRED_OFF_DUTY_HOURS = 10
    CYCLE_LIMIT_HOURS = 70
    REST_BREAK_AFTER_HOURS = 8
    REST_BREAK_DURATION_HOURS = 0.5
    PICKUP_DROP_DURATION_HOURS = 1
    AVERAGE_SPEED_MPH = 60

    miles_remaining = distance
    logs = []
    day = 0
    cycle_hours = cycle_hours_used
    start_of_day = 0.0

    while miles_remaining > 0 and cycle_hours < CYCLE_LIMIT_HOURS:
        day += 1
        segments = []
        day_date = start_datetime + datetime.timedelta(days=day-1)
        curr = 0.0  # current hour in day

        # 1. Off-duty overnight
        segments.append({
            "status": "off_duty",
            "start": to_hhmm(curr),
            "end": to_hhmm(curr + REQUIRED_OFF_DUTY_HOURS),
            "note": "overnight off-duty"
        })
        curr += REQUIRED_OFF_DUTY_HOURS

        # 2. Pickup/Pre-trip check (on-duty)
        segments.append({
            "status": "on_duty",
            "start": to_hhmm(curr),
            "end": to_hhmm(curr + PICKUP_DROP_DURATION_HOURS),
            "note": "pickup/start checks"
        })
        curr += PICKUP_DROP_DURATION_HOURS

        drive_today = 0.0
        duty_today = PICKUP_DROP_DURATION_HOURS
        has_had_break = False
        segment_end = None

        while drive_today < MAX_DRIVING_HOURS_PER_DAY and duty_today < MAX_ON_DUTY_HOURS_PER_DAY and miles_remaining > 0:
            # Can we take a first driving block up to 8 hours, but not exceeding drive/duty/day/miles left?
            drive_block = min(
                REST_BREAK_AFTER_HOURS if not has_had_break else MAX_DRIVING_HOURS_PER_DAY - drive_today,
                MAX_DRIVING_HOURS_PER_DAY - drive_today,
                MAX_ON_DUTY_HOURS_PER_DAY - duty_today,
                miles_remaining / AVERAGE_SPEED_MPH
            )
            if drive_block <= 0:
                break

            segment_start = curr
            segment_end = curr + drive_block
            segments.append({
                "status": "driving",
                "start": to_hhmm(segment_start),
                "end": to_hhmm(segment_end),
                "note": "driving"
            })
            drive_today += drive_block
            duty_today += drive_block
            miles_driven = drive_block * AVERAGE_SPEED_MPH
            miles_remaining -= miles_driven
            curr = segment_end

            # If we've driven 8h and not had a break yet, must take 30min break
            if not has_had_break and drive_today >= REST_BREAK_AFTER_HOURS and drive_today < MAX_DRIVING_HOURS_PER_DAY and miles_remaining > 0:
                break_start = curr
                break_end = curr + REST_BREAK_DURATION_HOURS
                segments.append({
                    "status": "on_duty",
                    "start": to_hhmm(break_start),
                    "end": to_hhmm(break_end),
                    "note": "rest break"
                })
                duty_today += REST_BREAK_DURATION_HOURS
                curr = break_end
                has_had_break = True

        # Dropoff (if done)
        if miles_remaining <= 0:
            drop_start = curr
            drop_end = curr + PICKUP_DROP_DURATION_HOURS
            segments.append({
                "status": "on_duty",
                "start": to_hhmm(drop_start),
                "end": to_hhmm(drop_end),
                "note": "dropoff"
            })
            duty_today += PICKUP_DROP_DURATION_HOURS
            curr = drop_end

        # Fill to 14h on-duty if any time left, then off-duty until 24:00
        if duty_today < MAX_ON_DUTY_HOURS_PER_DAY:
            on_start = curr
            on_end = min(on_start + (MAX_ON_DUTY_HOURS_PER_DAY - duty_today), 24.0)
            if on_start < on_end:
                segments.append({
                    "status": "on_duty",
                    "start": to_hhmm(on_start),
                    "end": to_hhmm(on_end),
                    "note": "paperwork/inspection"
                })
                curr = on_end

        # Off-duty rest of the day, if any
        if curr < 24.0:
            segments.append({
                "status": "off_duty",
                "start": to_hhmm(curr),
                "end": "24:00",
                "note": "overnight"
            })

        # Always no overlap: every next segment starts where the previous ends
        logs.append({"date": day_date.strftime('%Y-%m-%d'), "segments": segments})
        cycle_hours += duty_today

    return logs


# --- 5. Main Trip Planner Function ---
def plan_trip_route(current_address, pickup_address, dropoff_address):
    current_coords = geocode(current_address)
    pickup_coords = geocode(pickup_address)
    dropoff_coords = geocode(dropoff_address)

    route_points = [current_coords, pickup_coords, dropoff_coords]
    geometry, distance_miles = get_route_coords(route_points)
    stops = generate_stops(geometry, route_points, distance_miles)

    return stops, distance_miles, geometry  
