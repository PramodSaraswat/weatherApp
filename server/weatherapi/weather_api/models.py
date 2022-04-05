from django.db import models

# Create your models here.

class Location(models.Model):
	name = models.CharField(max_length=200)
	user_id = models.CharField(max_length=200) 