from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from weather_api.models import Location
from weather_api.serializers import LocationSerializer
import uuid


class Locations(APIView):
	dropdown_data = ["Delhi", "Mumbai", "Bengaluru", "Jaipur", "Kolkata", "Hyderabad", "Ahmedabad", "Chennai", "Peris", "London", "Pune", "Bhopal", "Beijing", "Chandigarh", "Patna", "Agra"]
	def get(self, request):
		if('userId' not in request.headers or request.headers.get('userId') == 'null'):
			user_id = uuid.uuid4()
		else:
			user_id = request.headers.get('userId')
		locations = Location.objects.filter(user_id=user_id)
		serialized_data = LocationSerializer(locations, many=True)
		return Response({"success":True, "locations": serialized_data.data, "user_id": user_id, "dropdown_data": self.dropdown_data })

	def post(self, request):
		serialized_data = LocationSerializer(data=request.data)
		if serialized_data.is_valid():
			serialized_data.save()
			return Response({"success":True, "location":serialized_data.data})
		return Response({"success":False, "errors":serialized_data.errors}, status=status.HTTP_400_BAD_REQUEST)


class SingleLocation(APIView):

	def get_location_by_id(self,id):
		try:
			return Location.objects.get(id=id)
		except:
			return ''


	def get(self, request, id):
		location = self.get_location_by_id(id)
		if(location == ''):
			return Response({"success": False, "msg": "This location does not exist"}, status=status.HTTP_404_NOT_FOUND)
		serialized_data = LocationSerializer(location)
		return Response({"success":True, "location":serialized_data.data})

	def post(self, request, id):
		location = self.get_location_by_id(id)
		if(location == ''):
			return Response({"success": False, "msg": "This location does not exist"}, status=status.HTTP_404_NOT_FOUND)
		serialized_data = LocationSerializer(location, data=request.data)
		if serialized_data.is_valid():
			serialized_data.save()
			return Response({"success":True, "location":serialized_data.data})
		return Response({"success":False, "errors":serialized_data.errors})

	def delete(self, request, id):
		location = self.get_location_by_id(id)
		if(location == ''):
			return Response({"success": False, "msg": "This location does not exist"}, status=status.HTTP_404_NOT_FOUND)
		location.delete()
		return Response({"success": True, "msg": 'deleted'})



# http://api.weatherapi.com/v1/forecast.json?q=patna&days=4&key=1d59c638a35d4ac1a34152707220404