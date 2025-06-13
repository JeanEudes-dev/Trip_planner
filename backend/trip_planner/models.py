from django.db import models

class TripRequest(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    current_cycle_hours = models.FloatField(default=0)

    distance_miles = models.FloatField(null=True, blank=True)
    estimated_days = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(
        max_length=50,
        default="pending",
        choices=[
            ("pending", "Pending"),
            ("completed", "Completed"),
            ("failed", "Failed"),
        ],
    )
    error_message = models.TextField(blank=True, default="")

    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location} at {self.created_at.strftime('%Y-%m-%d %H:%M')}"

class TripLog(models.Model):
    trip = models.ForeignKey(TripRequest, related_name="logs", on_delete=models.CASCADE)
    date = models.DateField()
    log_data = models.JSONField()  # Array of segments for log sheet

    def __str__(self):
        return f"Log for trip {self.trip.id} on {self.date}"

class RouteStop(models.Model):
    trip = models.ForeignKey(TripRequest, related_name="stops", on_delete=models.CASCADE)
    stop_type = models.CharField(max_length=50, choices=[
        ("pickup", "Pickup"),
        ("dropoff", "Dropoff"),
        ("rest_break", "Rest Break"),
        ("fuel_stop", "Fuel Stop"),
        ("start", "Start"),
        ("end", "End"),
        ("other", "Other")
    ])
    order = models.PositiveIntegerField()
    lat = models.FloatField()
    lng = models.FloatField()
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.stop_type} at {self.lat},{self.lng} (trip {self.trip.id})"
