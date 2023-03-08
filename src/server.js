const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
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

router.get('/getArtistAlbums', async (req,res)=> {
    var artistName = req.query.name;
    console.log('Getting artist details')
    const spotifyApi = new SpotifyWebApi({
        clientId: 'b965510d20cd4de6a922eb6c9017ce96',
        clientSecret: '9cb852b6436d4361916ea6639572c725',
      });

    try {
        const { body } = await spotifyApi.clientCredentialsGrant();
        const accessToken = body.access_token;
    
        spotifyApi.setAccessToken(accessToken);
    
        const { body: searchResults } = await spotifyApi.searchArtists(artistName);
    
        const artist = searchResults.artists.items.find(
          (artist) => artist.name.toLowerCase() === artistName.toLowerCase()
        );
    
        if (!artist) {
          res.status(404).send('Artist not found');
          return;
        }
        const { body: albums } = await spotifyApi.getArtistAlbums(artist.id, {limit:3});
    
        res.send(albums);
      } 
      catch (error) {
        console.log(error);
        res.status(500).send('Error retrieving artist albums');
      }


    // const spotifyApi = new SpotifyWebApi({
    //     clientId: 'b965510d20cd4de6a922eb6c9017ce96',
    //     clientSecret: '9cb852b6436d4361916ea6639572c725',
    //   });

    // spotifyApi.clientCredentialsGrant()
    //   .then((data) => {
    //     spotifyApi.setAccessToken(data.body.access_token);
    //     return spotifyApi.searchArtists(artistName, {limit:1});
    //   })
    //   .then((data) => {
        
    //     res.send(data.body.artists.items);
            
    //     }
        
    //   })
    //   .catch((error) => {
    //     console.log('Error:', error);
    //   });

})

module.exports = router;

