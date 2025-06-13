from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import RetrieveAPIView, ListAPIView
from .models import TripRequest, TripLog, RouteStop
from .serializers import TripRequestSerializer, TripRequestCreateSerializer
from .services import plan_trip_route, estimate_trip_distance, generate_stops, hos_generate_logs
from django.utils import timezone
from django.db import transaction

class TripRequestCreateAPIView(APIView):
    def post(self, request):
        serializer = TripRequestCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        with transaction.atomic():
            # Save TripRequest
            trip = serializer.save()

            # PLAN ROUTE & LOGIC
            route_stops = plan_trip_route(
                trip.current_location,
                trip.pickup_location,
                trip.dropoff_location,
            )
            distance = estimate_trip_distance(route_stops)
            stops = generate_stops(route_stops, distance)
            logs = hos_generate_logs(
                distance=distance,
                start_datetime=timezone.now(),
                cycle_hours_used=trip.current_cycle_hours,
            )
            # Update trip with meta info
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
        output = TripRequestSerializer(trip)
        return Response(output.data, status=status.HTTP_201_CREATED)

class TripRequestRetrieveAPIView(RetrieveAPIView):
    queryset = TripRequest.objects.all()
    serializer_class = TripRequestSerializer
    lookup_field = 'id'

class TripRequestListAPIView(ListAPIView):
    queryset = TripRequest.objects.order_by('-created_at')
    serializer_class = TripRequestSerializer
