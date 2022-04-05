Create a virtual environment to install dependencies in and activate it:

`python -m venv ./venv`
`.\venv\scripts\activate`
`cd weatherapi`

Then install the dependencies:

`pip install -r requirements.txt`


Once pip has finished downloading the dependencies:

`python manage.py runserver`
And navigate to http://127.0.0.1:8000/locations.

other endpoints for get update delete location is  http://127.0.0.1:8000/locations/:id: