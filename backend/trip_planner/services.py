import datetime
from typing import List, Dict

# Demo placeholders - replace these with real API calls for prod
# from geopy.geocoders import Nominatim
# import requests

# Constants for HOS
MAX_DRIVING_HOURS_PER_DAY = 11
MAX_ON_DUTY_HOURS_PER_DAY = 14
REQUIRED_OFF_DUTY_HOURS = 10
CYCLE_LIMIT_HOURS = 70
REST_BREAK_AFTER_HOURS = 8
FUEL_EVERY_MILES = 1000
PICKUP_DROP_DURATION_HOURS = 1
REST_BREAK_DURATION_HOURS = 0.5

# Sample: status = driving, on_duty, off_duty, sleeper_berth

def plan_trip_route(current, pickup, dropoff) -> List[Dict]:
    # Placeholder: geocode, calculate route, and make stop list
    # In prod: call OSRM or OpenRouteService API for real routing
    # For now, return fake coordinates
    return [
        {"lat": 32.7767, "lng": -96.7970, "type": "start", "description": current},
        {"lat": 29.7604, "lng": -95.3698, "type": "pickup", "description": pickup},
        {"lat": 41.8781, "lng": -87.6298, "type": "dropoff", "description": dropoff},
    ]

def estimate_trip_distance(route_stops: List[Dict]) -> float:
    # Placeholder: calculate based on coordinates
    # In prod: use haversine or API response
    return 1100  # For testing, 1100 miles triggers 1 fuel stop

def generate_stops(route_stops: List[Dict], distance: float) -> List[Dict]:
    stops = []
    order = 0
    # Start
    stops.append({**route_stops[0], 'order': order, 'stop_type': 'start'})
    order += 1
    # Pickup
    stops.append({**route_stops[1], 'order': order, 'stop_type': 'pickup'})
    order += 1
    # Fueling every 1000 miles
    miles = 0
    while miles + FUEL_EVERY_MILES < distance:
        miles += FUEL_EVERY_MILES
        # Dummy point - mid-route
        stops.append({
            'lat': 35.0, 'lng': -90.0, 'order': order, 'stop_type': 'fuel_stop', 'description': f'Fuel at mile {miles}'
        })
        order += 1
    # Dropoff
    stops.append({**route_stops[2], 'order': order, 'stop_type': 'dropoff'})
    order += 1
    return stops

def hos_generate_logs(
    distance: float,
    start_datetime: datetime.datetime,
    cycle_hours_used: float = 0.0
) -> List[Dict]:
    # For this demo: assume avg 60mph
    miles_remaining = distance
    logs = []
    day = 0
    cycle_hours = cycle_hours_used
    while miles_remaining > 0 and cycle_hours < CYCLE_LIMIT_HOURS:
        day += 1
        log_segments = []
        day_date = start_datetime + datetime.timedelta(days=day-1)
        # 10 hours off-duty start of day
        log_segments.append({
            'status': 'off_duty', 'start': '00:00', 'end': '10:00', 'note': 'overnight off-duty'
        })
        duty_start = 10.0  # hour of the day
        driving_today = 0
        onduty_today = 0
        time = duty_start
        # Pickup (1hr on duty)
        log_segments.append({
            'status': 'on_duty', 'start': '10:00', 'end': '11:00', 'note': 'pickup or start checks'})
        onduty_today += 1
        time += 1
        # Driving up to 8h then break
        drive1 = min(REST_BREAK_AFTER_HOURS, MAX_DRIVING_HOURS_PER_DAY, miles_remaining/60)
        drive1_end = time + drive1
        log_segments.append({
            'status': 'driving', 'start': f'{int(time):02}:00', 'end': f'{int(drive1_end):02}:00', 'note': 'drive'})
        driving_today += drive1
        onduty_today += drive1
        time = drive1_end
        # 30-min rest break if we drive more
        if drive1 == REST_BREAK_AFTER_HOURS and driving_today < MAX_DRIVING_HOURS_PER_DAY:
            rest_end = time + REST_BREAK_DURATION_HOURS
            log_segments.append({
                'status': 'on_duty', 'start': f'{int(time):02}:00', 'end': f'{int(rest_end):02}:00', 'note': 'rest break'})
            onduty_today += REST_BREAK_DURATION_HOURS
            time = rest_end
        # Finish remaining driving for the day
        drive2 = min(MAX_DRIVING_HOURS_PER_DAY - driving_today, miles_remaining/60)
        if drive2 > 0:
            drive2_end = time + drive2
            log_segments.append({
                'status': 'driving', 'start': f'{int(time):02}:00', 'end': f'{int(drive2_end):02}:00', 'note': 'drive'})
            driving_today += drive2
            onduty_today += drive2
            time = drive2_end
        # Dropoff or more on-duty at end
        if miles_remaining - driving_today*60 <= 0:
            # 1hr dropoff
            drop_start = time
            drop_end = drop_start + PICKUP_DROP_DURATION_HOURS
            log_segments.append({
                'status': 'on_duty', 'start': f'{int(drop_start):02}:00', 'end': f'{int(drop_end):02}:00', 'note': 'dropoff'})
            onduty_today += PICKUP_DROP_DURATION_HOURS
            time = drop_end
        # Rest of the 14h window on-duty not driving, if any
        if onduty_today < MAX_ON_DUTY_HOURS_PER_DAY:
            on_end = duty_start + MAX_ON_DUTY_HOURS_PER_DAY
            if time < on_end:
                log_segments.append({
                    'status': 'on_duty', 'start': f'{int(time):02}:00', 'end': f'{int(on_end):02}:00', 'note': 'paperwork/inspection'})
        # Rest of the day off-duty
        off_start = duty_start + MAX_ON_DUTY_HOURS_PER_DAY
        if off_start < 24:
            log_segments.append({
                'status': 'off_duty', 'start': f'{int(off_start):02}:00', 'end': '24:00', 'note': 'overnight'})
        logs.append({'date': day_date.strftime('%Y-%m-%d'), 'segments': log_segments})
        miles_driven = min(driving_today*60, miles_remaining)
        miles_remaining -= miles_driven
        cycle_hours += onduty_today
    return logs
