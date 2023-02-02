
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
        console.log(eventInfo);
        displayEventsTable(eventInfo);

    }
    else{
        console.log("No Results")
        displayNoResult();
    }
}

function displayEventsTable(eventInfo){

    cleanUp()

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

function displayNoResult() {
    cleanUp();
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

    if (document.contains(document.getElementById("event-details"))) {
        document.getElementById("event-details").remove();
    }

    var eventTeams = []
    var eventVenue = ""
    var eventGenre = []
    var priceRanges = [] //TODO
    var eventDate = []
    eventDate.push(eventDetails.dates.start.localDate);
    eventDate.push(eventDetails.dates.start.localTime);

    var ticketStatus = eventDetails.dates.status.code;
    var buyTicket = eventDetails.url;
    var seatMap = "";
    var eventName = eventDetails.name;

    if('_embedded' in eventDetails &&  "attractions" in eventDetails._embedded && eventDetails._embedded.attractions.length > 0){
        for(let i=0; i < eventDetails._embedded.attractions.length;i++){
            eventTeams.push(eventDetails._embedded.attractions[i].name)
        }
    }

    if('_embedded' in eventDetails && 'venues' in eventDetails._embedded && eventDetails._embedded.venues.length >0){
        eventVenue = eventDetails._embedded.venues[0].name;
    }
    
    if('classifications' in eventDetails){
        for(let i=0; i < eventDetails.classifications.length; i++){
            eventGenre.push(eventDetails.classifications[i].genre.name)
            eventGenre.push(eventDetails.classifications[i].segment.name)
            eventGenre.push(eventDetails.classifications[i].subGenre.name)
        }
    }

    if('type' in eventDetails){
        eventGenre.push(eventDetails.type);
    }

    if('subType' in eventDetails){
        eventGenre.push(eventDetails.subType)
    }

    if('seatmap' in eventDetails && 'staticUrl' in eventDetails.seatmap){
        seatMap = eventDetails.seatmap.staticUrl;
    }

    var div = document.createElement("div");
    div.setAttribute('class', 'event-details-container');
    div.setAttribute('id', 'event-details');

    var nameTag = document.createElement("p");
    nameTag.setAttribute('id', 'event_name');
    nameTag.appendChild(document.createTextNode(eventName));
    div.appendChild(nameTag);

    var leftdiv = document.createElement("div");
    leftdiv.setAttribute('class', 'leftcolumn');
    

    var rightDiv = document.createElement("div");
    rightDiv.setAttribute('class', 'rightcolumn');
    

    ////////// Adding content /////////////////////

    var dateTag = document.createElement("p")
    dateTag.setAttribute('class', 'eventDetailTags')
    dateTag.appendChild(document.createTextNode("Date"));
    leftdiv.appendChild(dateTag)

    var dateValue = document.createElement("p");
    dateValue.setAttribute('class','eventDetailValues');
    dateValue.appendChild(document.createTextNode(eventDate.join(' ')));
    leftdiv.appendChild(dateValue);

    var artistTag = document.createElement("p")
    artistTag.setAttribute('class', 'eventDetailTags')
    artistTag.appendChild(document.createTextNode("Artist/Team"));
    leftdiv.appendChild(artistTag)

    var artistValue = document.createElement("p");
    artistValue.setAttribute('class','eventDetailValues');
    artistValue.appendChild(document.createTextNode(eventTeams.join(' | ')));
    leftdiv.appendChild(artistValue);

    var venueTag = document.createElement("p")
    venueTag.setAttribute('class', 'eventDetailTags')
    venueTag.appendChild(document.createTextNode("Venue"));
    leftdiv.appendChild(venueTag)

    var venueValue = document.createElement("p");
    venueValue.setAttribute('class','eventDetailValues');
    venueValue.appendChild(document.createTextNode(eventVenue));
    leftdiv.appendChild(venueValue);

    var genreTag = document.createElement("p")
    genreTag.setAttribute('class', 'eventDetailTags')
    genreTag.appendChild(document.createTextNode("Genres"));
    leftdiv.appendChild(genreTag)

    var genreValue = document.createElement("p");
    genreValue.setAttribute('class','eventDetailValues');
    genreValue.appendChild(document.createTextNode(eventGenre.join(' | ')));
    leftdiv.appendChild(genreValue);

    if (priceRanges.length > 0){

        var priceTag = document.createElement("p")
        priceTag.setAttribute('class', 'eventDetailTags')
        priceTag.appendChild(document.createTextNode("Price Ranges"));
        leftdiv.appendChild(priceTag)

        var priceValue = document.createElement("p");
        priceValue.setAttribute('class','eventDetailValues');
        priceValue.appendChild(document.createTextNode(priceRanges.join('-')));
        leftdiv.appendChild(priceValue);

    }


    var ticketStatusTag = document.createElement("p")
    ticketStatusTag.setAttribute('class', 'eventDetailTags')
    ticketStatusTag.appendChild(document.createTextNode("Ticket Status"));
    leftdiv.appendChild(ticketStatusTag)

    var ticketStatusValue = document.createElement("p");
    ticketStatusValue.setAttribute('class','eventDetailValues');
    ticketStatusValue.appendChild(document.createTextNode(ticketStatus));
    leftdiv.appendChild(ticketStatusValue);

    var buyAtTag = document.createElement("p")
    buyAtTag.setAttribute('class', 'eventDetailTags')
    buyAtTag.appendChild(document.createTextNode("Buy Ticket At"));
    leftdiv.appendChild(buyAtTag)

    var buyAtValue = document.createElement("p");
    buyAtValue.setAttribute('class','eventDetailValues');
    buyAtValue.appendChild(document.createTextNode(buyTicket));
    leftdiv.appendChild(buyAtValue);

    var img = document.createElement("img");
    img.src = seatMap;
    img.style.width = "500px";
    img.style.height = "400px";
    // img.alt = seatMap;
    // img.style.margin = 'auto'
    // img.style.top = "50%";
    // img.style.position = "absolute";
    rightDiv.appendChild(img);


    div.appendChild(leftdiv);
    div.appendChild(rightDiv);
    document.getElementsByTagName("body")[0].appendChild(div);
    div.scrollIntoView();


}

function cleanUp() {
    if (document.contains(document.getElementById("no-results"))) {
            document.getElementById("no-results").remove();
        }

    if (document.contains(document.getElementById("events"))) {
            document.getElementById("events").remove();
        }

    if (document.contains(document.getElementById("event-details"))) {
            document.getElementById("event-details").remove();
        }


}