from rest_framework import serializers
from .models import TripRequest, TripLog, RouteStop

class RouteStopSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteStop
        fields = [
            'id', 'stop_type', 'order', 'lat', 'lng', 'description'
        ]

class TripLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripLog
        fields = ['id', 'date', 'log_data']

class TripRequestSerializer(serializers.ModelSerializer):
    logs = TripLogSerializer(many=True, read_only=True)
    stops = RouteStopSerializer(many=True, read_only=True)

    class Meta:
        model = TripRequest
        fields = [
            'id', 'created_at', 'updated_at', 'current_location',
            'pickup_location', 'dropoff_location', 'current_cycle_hours',
            'distance_miles', 'estimated_days', 'status', 'error_message',
            'logs', 'stops'
        ]

class TripRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripRequest
        fields = [
            'current_location', 'pickup_location', 'dropoff_location', 'current_cycle_hours'
        ]

    def validate_current_cycle_hours(self, value):
        if value < 0 or value > 70:
            raise serializers.ValidationError('Current cycle hours must be between 0 and 70.')
        return value
