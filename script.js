
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
        "location":location
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

 function convertToGeohash(response, searchInfo) {

    const lat = response.results[0].geometry.location.lat;
    const lng = response.results[0].geometry.location.lng;
    if(!searchInfo["distance"]){
        searchInfo["distance"]="10";
    }

    const url = "/getEventList?latitude="+lat+"&longitude="+lng+"&keyword="+searchInfo["keyword"]+"&location="+searchInfo["location"]+"&distance="+searchInfo["distance"]+"&category="+searchInfo["category"];
    fetch(url)
      .then(
        response => response.json() // .json(), .blob(), etc.
      ).then(
        json => { extractEventsInfo(json);} // Handle here
      );


}


function extractEventsInfo(eventInfo){
    if(eventInfo.page.totalElements > 0){
        console.log(eventInfo._embedded.events.length);
        console.log(eventInfo);
        displayEventsTable(eventInfo);

    }

    else{
        console.log("No Results")
        if (document.contains(document.getElementById("events"))) {
            document.getElementById("events").remove();
        }

        var body = document.getElementsByTagName("body")[0];
        var div = document.getElementById("events-table");

        div.style.display = "block";
        var childDiv = document.createElement("div");
        childDiv.setAttribute('id','no-results');
        childDiv.style.alignText = 'center';
        childDiv.style.display= 'inline-block';
        childDiv.style.margin= '0 auto';
        childDiv.style.padding= '10px';
        childDiv.style.backgroundColor = 'white';
        childDiv.style.color = 'red';
        
        let text = document.createTextNode('No Records found');
        childDiv.appendChild(text);
        div.appendChild(childDiv);


    }
}

function displayEventsTable(eventInfo){

    if (document.contains(document.getElementById("no-results"))) {
            document.getElementById("no-results").remove();
        }

    var headers = ['Date', 'Icon', 'Event', 'Genre', 'Venue'];
    var body = document.getElementsByTagName("body")[0];
    var div = document.getElementById("events-table");

    div.style.display = "block";

      // create elements <table> and a <tbody>
    var tbl = document.createElement("table");
    tbl.setAttribute('id','events');
    var thead = document.createElement('thead');
    tbl.appendChild(thead);


    for(let i = 0; i < 5; i++){
        var th = document.createElement("th");
        th.appendChild(document.createTextNode(headers[i]));
        th.style.border = '1px solid black';
        th.style.backgroundColor='grey';
        thead.appendChild(th);
    }
 
    var tblBody = document.createElement("tbody");
    tbl.appendChild(tblBody);

    tbl.style.width = '100%';
    tbl.style.border = '1px solid black';
    tbl.style.backgroundColor = 'white';
    tbl.style.borderSpacing= 0;
    tbl.style.borderCollapse= 'collapse';

    let totalEvents = Math.min(20, eventInfo._embedded.events.length);

    let events = eventInfo._embedded.events;

    for (let i = 0; i < totalEvents; i++) {

            let eventName = events[i]["name"];
            let eventIcon = "";
            let eventDate = events[i].dates.start.localDate;
            let eventVenue = "";
            let eventGenre = "";
            if("images" in events[i] && events[i].images.length > 0){
                eventIcon = events[i].images[0].url;
            }
            if("venues" in events[i]._embedded){
                eventVenue = events[i]._embedded.venues[0].name;
            }

            if("attractions" in events[i]._embedded && "classifications" in events[i]._embedded.attractions[0]){
                eventGenre=events[i]._embedded.attractions[0].classifications[0].segment.name
            }

            var tr = document.createElement('tr');
            tblBody.appendChild(tr);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.appendChild(document.createTextNode(eventDate));
            tr.appendChild(td);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.width = "150px";
            td.style.height = "70px";
            var img = document.createElement("img");
            img.src = eventIcon;
            img.style.width = "100px";
            img.style.height = "50px";
            // img.aspectRatio= 'auto';
            img.alt = eventIcon;
            td.appendChild(img);
            tr.appendChild(td);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            var link = document.createElement("a");
            // link.appendChild(document.createTextNode(eventName));
            link.innerHTML = eventName;
            link.setAttribute('id', events[i].id);
            link.style.textDecoration = "none";

            link.addEventListener("mouseover", function(e) {
                    console.log('hover');
                    e.target.style.color = "purple";
                  });

            link.addEventListener("mouseleave", function(e) {
                    e.target.style.color = "black";
                  });

            link.addEventListener('click', function(e) {
                    getEventDetails(e.target.id);
                });
            link.onClick = 'test()';
            td.appendChild(link);
            tr.appendChild(td);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.appendChild(document.createTextNode(eventGenre));
            tr.appendChild(td);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.appendChild(document.createTextNode(eventVenue));
            tr.appendChild(td);

  }

  div.appendChild(tbl);
}

function getEventDetails(eventId){

    const url = "/getEventDetails?eventid="+eventId;
    fetch(url)
      .then(
        response => response.json() // .json(), .blob(), etc.
      ).then(
        json => { console.log(json); displayEventInfo(json)} // Handle here
      );
}

function displayEventInfo(eventDetails){

    var div = document.createElement("div");
    div.setAttribute('class', 'form-container');

    document.getElementsByTagName("body")[0].appendChild(div);
    div.scrollIntoView();


}