
function locationDetect(autodetect){
    if(autodetect.checked){  
        document.getElementById("auto-loc-enabled").style.display='inline';
        document.getElementById("auto-loc-disabled").style.display='none';
    }
    else{
        document.getElementById("auto-loc-enabled").style.display='none'; 
        document.getElementById("auto-loc-disabled").style.display='inline';   
    }

}

function search(){
    // event.preventDefault();
    var keyword = document.getElementById("keyword").value;
    var distance = document.getElementById("distance").value;
    var category = document.getElementById("category").value;
    var location = document.getElementById("location").value;

    console.log(keyword);
    console.log(distance);
    console.log(category);
    console.log(location);

    const searchInfo = {
        "keyword": keyword,
        "distance":distance,
        "category":category,
        "locatio":location
    };

    // TODO : handle empty fields

    // Convert location to coordinates
    geocodeAddress(searchInfo)    

    // call api


}


async function geocodeAddress(searchInfo) {
          const address = document.getElementById("location").value;
          myAPIKey = 'AIzaSyBpZvMEg8E7OCm6Umc8FX80tXwiCFNCJ2k';

          const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${myAPIKey}`;
          console.log(geocodingUrl)
          
         let response = await fetch(geocodingUrl)
                              .then((response) => response.json())
                              .then((data) => {
                                return data;

                              })
                              .catch((error) => {
                                console.error('Error:', error);
                                return error;
                              });
        
        console.log(response);

        if (response.status == 'ZERO_RESULTS'){
            console.log('Invalid location');
            return;
        }

        convertToGeohash(response, searchInfo);
}

async function convertToGeohash(response, searchInfo) {

    const lat = response.results[0].geometry.location.lat;
    const lng = response.results[0].geometry.location.lng;

    console.log(lat);
    // const request = new XMLHttpRequest();
    // request.open('GET',  `/getGeohash?latitude=`+lat+ `&longitude=`+lng, true);
    // // request.setRequestHeader('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
    // request.send();

    const url = "/getGeohash?latitude="+lat+ "&longitude="+lng;
    let geohashcode = await fetch(url)
      .then(
        response => response.text() // .json(), .blob(), etc.
      ).then(
        text => {return text;} // Handle here
      );

      console.log(geohashcode);
      searchInfo["geohash"] = geohashcode
      getEventDetails(searchInfo)

}

async function getEventDetails(searchInfo){

    let keyword = searchInfo["keyword"];
    let distance = searchInfo["distance"];
    let category = searchInfo["category"];
    let geohash = searchInfo["geohash"];
    let location = searchInfo["location"];
    let apiKey = "4NgXj6Gc7DhC0BAoWYJlXmqZPGCr1V4u";

    const category_map = {
        "Music":"KZFzniwnSyZfZ7v7nJ",
        "Sports": "KZFzniwnSyZfZ7v7nE",
        "Arts": "KZFzniwnSyZfZ7v7na",
        "Theatre": "KZFzniwnSyZfZ7v7na",
        "Film": "KZFzniwnSyZfZ7v7nn",
        "Miscellaneous": "KZFzniwnSyZfZ7v7n1"

    }

    let segment = category_map[category]
    const ticketMasterURL = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&keyword=${encodeURIComponent(location)}&segmentId=${segment}&radius=${distance}&unit=miles&geoPoint=${geohash}`;

    let data = await fetch(ticketMasterURL)
                              .then((response) => response.json())
                              .then((data) => {
                                return data;

                              })
                              .catch((error) => {
                                console.error('Error:', error);
                                return error;
                              });
        
    console.log(data);

    


}