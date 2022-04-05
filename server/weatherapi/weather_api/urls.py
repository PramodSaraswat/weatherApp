from django.urls import path
from weather_api.views import Locations, SingleLocation

urlpatterns = [
    path('locations', Locations.as_view()),
    path('locations/<int:id>', SingleLocation.as_view()),
]
