from django.contrib import admin
from .models import TripRequest, TripLog, RouteStop

@admin.register(TripRequest)
class TripRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'pickup_location', 'dropoff_location', 'created_at', 'distance_miles', 'estimated_days', 'status')
    search_fields = ('pickup_location', 'dropoff_location', 'status')
    list_filter = ('status',)
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TripLog)
class TripLogAdmin(admin.ModelAdmin):
    list_display = ('trip', 'date')
    search_fields = ('trip__pickup_location', 'trip__dropoff_location')
    readonly_fields = ('log_data',)

@admin.register(RouteStop)
class RouteStopAdmin(admin.ModelAdmin):
    list_display = ('trip', 'stop_type', 'order', 'lat', 'lng', 'description')
    search_fields = ('stop_type', 'description')
