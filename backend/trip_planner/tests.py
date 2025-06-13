from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import TripRequest

class TripPlanningTests(APITestCase):
    def test_create_trip_and_generate_logs(self):
        url = reverse('trip-create')
        data = {
            'current_location': 'Dallas, TX',
            'pickup_location': 'Houston, TX',
            'dropoff_location': 'Chicago, IL',
            'current_cycle_hours': 0
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        trip = TripRequest.objects.get(id=response.data['id'])
        self.assertEqual(trip.logs.count(), trip.estimated_days)
        self.assertGreater(trip.distance_miles, 0)
        self.assertIn('logs', response.data)
        self.assertIn('stops', response.data)
        self.assertEqual(response.data['status'], 'completed')
