from django.contrib import admin
from django.urls import path, include
from trip_planner.urls import urlpatterns as trip_api
from trip_planner.swagger import swagger_urlpatterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include((trip_api, "trip_planner"))),
] + swagger_urlpatterns