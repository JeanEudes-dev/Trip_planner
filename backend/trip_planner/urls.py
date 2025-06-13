from django.urls import path
from .views import TripRequestCreateAPIView, TripRequestRetrieveAPIView, TripRequestListAPIView

urlpatterns = [
    path('trips/', TripRequestListAPIView.as_view(), name='trip-list'),
    path('trips/create/', TripRequestCreateAPIView.as_view(), name='trip-create'),
    path('trips/<int:id>/', TripRequestRetrieveAPIView.as_view(), name='trip-detail'),
]
