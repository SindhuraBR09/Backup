from flask import Flask, url_for, request
from geolib import geohash
import requests
import urllib

app = Flask(__name__,static_url_path='/static')

@app.route('/')
def index():
	return app.send_static_file('events.html')

@app.route('/getEventList/', methods=['GET'])
def getGeohash():
	lat = request.args.get('latitude')
	lng = request.args.get('longitude')
	hashed = geohash.encode(str(lat), str(lng), 7)
	print(hashed)
	
	keyword = request.args.get('keyword')
	distance = request.args.get('distance')
	category = request.args.get('category')
	location = request.args.get('location')
	category_map = {
        "music":"KZFzniwnSyZfZ7v7nJ",
        "sports": "KZFzniwnSyZfZ7v7nE",
        "art": "KZFzniwnSyZfZ7v7na",
        "theater": "KZFzniwnSyZfZ7v7na",
        "film": "KZFzniwnSyZfZ7v7nn",
        "miscellaneous": "KZFzniwnSyZfZ7v7n1"

    }

	locationEncoded= urllib.parse.quote(location)
	query = {'apikey':"4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u", 
			'keyword':locationEncoded, 
			'distance':distance, 
			'segmentId':category_map[category], 
			'unit':'miles', 
			'geoPoint':hashed}

	# print(query)
	response = requests.get('https://app.ticketmaster.com/discovery/v2/events.json', params=query)
	return response.json()



@app.route('/getEventDetails/', methods=['GET'])
def getEventDetails():
	eventId = request.args.get('eventid')

	query = {'apikey':"4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u"		}
	url='https://app.ticketmaster.com/discovery/v2/events/'+ str(eventId)
	response = requests.get(url, params=query)
	return response.json()


if __name__ == "__main__":
	app.run(debug=True)