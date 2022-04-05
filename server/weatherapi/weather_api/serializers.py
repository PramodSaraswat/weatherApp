from rest_framework import serializers
from weather_api.models import Location

class LocationSerializer(serializers.ModelSerializer):
	class Meta:
		fields = "__all__"
		model = Location