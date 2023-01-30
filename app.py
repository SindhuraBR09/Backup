from flask import Flask, url_for, request
from geolib import geohash

app = Flask(__name__,static_url_path='/static')

@app.route('/')
def index():
	return app.send_static_file('events.html')

@app.route('/getGeohash/', methods=['GET'])
def getGeohash():
	lat = request.args.get('latitude')
	lng = request.args.get('longitude')
	hashed = geohash.encode(str(lat), str(lng), 7)
	return hashed;

if __name__ == "__main__":
	app.run(debug=True)