const express = require('express');
const axios = require('axios');
var router = express();
const port = process.env.PORT || 5000; 

router.listen(port, () => console.log(`Server started on port ${port}`));

router.get('/search', (req, res) => {
    console.log('request received');
    console.log(req.query)
    var geohash = require('ngeohash');
    var geoHashLoc =  geohash.encode(req.query.lat, req.query.lng);
    var category_map = {
        "music":"KZFzniwnSyZfZ7v7nJ",
        "sports": "KZFzniwnSyZfZ7v7nE",
        "art": "KZFzniwnSyZfZ7v7na",
        "film": "KZFzniwnSyZfZ7v7nn",
        "miscellaneous": "KZFzniwnSyZfZ7v7n1"
    }
    var params = {}
    params['apikey'] = "4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u"
    params['keyword'] = req.query.key    
    params['radius'] = req.query.dist
    params['unit'] = 'miles'
    params['geoPoint']= geoHashLoc
    if(req.query.genre != 'default'){
        params['segmentId'] = category_map[req.query.genre]
    }

    axios.get('https://app.ticketmaster.com/discovery/v2/events.json',{params})
            .then(response => res.json(response.data))
            .catch(error => console.log(error));
    
});

router.get('/getSuggestions', (req,res)=> {

    const params = {
        apikey : '4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u',
        keyword: req.query.keyword        
    }
    const suggestionURL = 'https://app.ticketmaster.com/discovery/v2/suggest'
    axios.get(suggestionURL, {params})
        .then(response =>  res.json(response.data))
        .catch(error => console.log(error));

})

router.get('/getEventDetails', (req,res)=> {
    const eventName = req.query.keyword;
    const params = {
        apikey : '4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u',
    }
    console.log('Event name '+eventName)
    const eventDetailsURL = `https://app.ticketmaster.com/discovery/v2/events/${encodeURIComponent(eventName)}`
    axios.get(eventDetailsURL, {params})
        .then(response =>  res.json(response.data))
        .catch(error => console.log(error));
})

module.exports = router;

