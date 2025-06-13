from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import TripRequest, TripLog, RouteStop
from .serializers import TripRequestSerializer, TripRequestCreateSerializer
from .services import plan_trip_route, hos_generate_logs, TripPlanningError, GeocodingError, RouteCalculationError, DistanceLimitExceededError
from django.utils import timezone
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

class TripRequestCreateAPIView(APIView):
    def post(self, request):
        serializer = TripRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        trip = None
        try:
            with transaction.atomic():
                trip = serializer.save()

                try:
                    # Get stops, distance, and route geometry (decoded)
                    stops, distance, geometry = plan_trip_route(
                        trip.current_location,
                        trip.pickup_location,
                        trip.dropoff_location,
                    )
                    logs = hos_generate_logs(
                        distance=distance,
                        start_datetime=timezone.now(),
                        cycle_hours_used=trip.current_cycle_hours,
                    )
                    trip.distance_miles = distance
                    trip.estimated_days = len(logs)
                    trip.status = "completed"
                    trip.save()
                    
                    # Save stops
                    for stop in stops:
                        RouteStop.objects.create(
                            trip=trip,
                            stop_type=stop['stop_type'],
                            order=stop['order'],
                            lat=stop['lat'],
                            lng=stop['lng'],
                            description=stop.get('description', '')
                        )
                    # Save logs
                    for log in logs:
                        TripLog.objects.create(
                            trip=trip,
                            date=log['date'],
                            log_data=log['segments']
                        )

                except TripPlanningError as e:
                    trip.status = "failed"
                    trip.error_message = str(e)
                    trip.save()
                    logger.warning(f"Trip planning failed for trip {trip.id}: {str(e)}")
                    if isinstance(e, DistanceLimitExceededError):
                        error_status = status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                    elif isinstance(e, GeocodingError):
                        error_status = status.HTTP_400_BAD_REQUEST
                    elif isinstance(e, RouteCalculationError):
                        error_status = status.HTTP_422_UNPROCESSABLE_ENTITY
                    else:
                        error_status = status.HTTP_500_INTERNAL_SERVER_ERROR
                    output = TripRequestSerializer(trip)
                    return Response(
                        {
                            **output.data,
                            "error": {
                                "type": e.__class__.__name__,
                                "message": str(e),
                                "user_friendly": True
                            },
                            "geometry": [],  # Return empty geometry on error
                        }, 
                        status=error_status
                    )

        except Exception as e:
            if trip:
                trip.status = "failed"
                trip.error_message = f"Unexpected error: {str(e)}"
                trip.save()
            logger.error(f"Unexpected error in trip creation: {str(e)}", exc_info=True)
            return Response(
                {
                    "error": {
                        "type": "UnexpectedError",
                        "message": "An unexpected error occurred while planning your trip. Please try again.",
                        "user_friendly": True
                    },
                    "geometry": [],
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Success: return geometry as well as trip data
        output = TripRequestSerializer(trip)
        return Response({**output.data, "geometry": geometry}, status=status.HTTP_201_CREATED)


class TripRequestRetrieveAPIView(RetrieveAPIView):
    queryset = TripRequest.objects.all()
    serializer_class = TripRequestSerializer
    lookup_field = 'id'

class TripRequestListAPIView(ListAPIView):
    queryset = TripRequest.objects.order_by('-created_at')
    serializer_class = TripRequestSerializer
