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
        "film": "KZFzniwnSyZfZ7v7nn",
        "miscellaneous": "KZFzniwnSyZfZ7v7n1"

    }
	keywordEncoded= urllib.parse.quote(keyword)
	query = {}
	if category == 'default':
		query['apikey'] = "4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u"
		query['keyword']= keywordEncoded
		query['distance'] = distance
		query['unit'] = 'miles'
		query['geoPoint']=hashed

	else:
		query['apikey'] = "4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u"
		query['keyword']= keywordEncoded
		query['distance'] = distance
		query['unit'] = 'miles'
		query['geoPoint']=hashed
		query['segmentId'] = category_map[category]


	response = requests.get('https://app.ticketmaster.com/discovery/v2/events.json', params=query)
	return response.json()



@app.route('/getEventDetails/', methods=['GET'])
def getEventDetails():
	eventId = request.args.get('eventid')

	query = {
			'apikey':"4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u"
			}
	url='https://app.ticketmaster.com/discovery/v2/events/'+ str(eventId)
	response = requests.get(url, params=query)
	return response.json()

@app.route('/getVenueDetails/', methods=['GET'])
def getVenueDetails():
	venueName = request.args.get('venueName')
	# venueNameEncoded= urllib.parse.quote(venueName)

	query = {
			'apikey':"4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u",
			'keyword':venueName
			}
	url='https://app.ticketmaster.com/discovery/v2/venues/'
	response = requests.get(url, params=query)
	return response.json()


if __name__ == "__main__":
	app.run(debug=True, host="0.0.0.0", port=8080)