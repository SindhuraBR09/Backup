
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

    const url = "/getEventList?latitude="+lat+"&longitude="+lng+"&keyword="+encodeURIComponent(searchInfo["keyword"])+"&location="+encodeURIComponent(searchInfo["location"])+"&distance="+searchInfo["distance"]+"&category="+searchInfo["category"];
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
            // link.onClick = 'test()';
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

    if (document.contains(document.getElementById("outerVenueDiv"))) {
        document.getElementById("outerVenueDiv").remove();
    }

    if (document.contains(document.getElementById("arrow_container"))) {
        document.getElementById("arrow_container").remove();
    }

    if (document.contains(document.getElementById("showVenueTag"))) {
        document.getElementById("showVenueTag").remove();
    }

    var eventTeams = []
    var eventTeamsUrl = []
    var eventVenue = ""
    var eventGenre = []
    var priceRanges = [] //TODO
    var eventDate = []
    var currencyType = ''
    eventDate.push(eventDetails.dates.start.localDate);
    eventDate.push(eventDetails.dates.start.localTime);

    var ticketStatus = eventDetails.dates.status.code;
    var buyTicket = eventDetails.url;
    var seatMap = "";
    var eventName = eventDetails.name;

    if('_embedded' in eventDetails &&  "attractions" in eventDetails._embedded && eventDetails._embedded.attractions.length > 0){
        for(let i=0; i < eventDetails._embedded.attractions.length;i++){
            eventTeams.push(eventDetails._embedded.attractions[i].name)
            if('url'in eventDetails._embedded.attractions[i]){
                eventTeamsUrl.push(eventDetails._embedded.attractions[i].url)
            }
            else{
                eventTeamsUrl.push('');
            }
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

    if('priceRanges' in eventDetails){
        priceRanges.push(eventDetails.priceRanges[0].min)
        priceRanges.push(eventDetails.priceRanges[0].max)
        currencyType = eventDetails.priceRanges[0].currency
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
    
    console.log(eventTeams)
    console.log(eventTeamsUrl)
    for(let i =0; i< eventTeams.length; i++){

        if(eventTeamsUrl[i]){
            var l = document.createElement("a");
            l.style.textDecoration = 'none';
            l.href = eventTeamsUrl[i];
            l.style.color = "#66C2F6";
            l.target = '_blank';
            l.appendChild(document.createTextNode(eventTeams[i]));
            if(i != 0){
                artistValue.appendChild(document.createTextNode(" | "))
            }
            artistValue.appendChild(l);
        }

        else{
            if (i != 0){
                artistValue.appendChild(document.createTextNode(" | "))            
            }
            artistValue.appendChild(document.createTextNode(eventTeams[i]))
        }        

    }
    
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
        priceValue.appendChild(document.createTextNode(priceRanges.join('-')+ " "+currencyType));
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
    var buyLink = document.createElement("a");
    buyLink.style.textDecoration = 'none';
    buyLink.href = buyTicket;
    buyLink.target = '_blank';
    buyLink.style.color = "#66C2F6";
    buyLink.appendChild(document.createTextNode("Ticketmaster"));
    buyAtValue.appendChild(buyLink);
    leftdiv.appendChild(buyAtValue);

    if(seatMap){
        var img = document.createElement("img");
        img.src = seatMap;
        img.style.width = "80%";
        img.style.height = "400px";
        rightDiv.appendChild(img);

    }
    


    div.appendChild(leftdiv);
    div.appendChild(rightDiv);
    document.getElementsByTagName("body")[0].appendChild(div);

    /// create Show Venue Button 
    var showVenueTag = document.createElement("p")
    showVenueTag.setAttribute('id', 'showVenueTag')
    showVenueTag.appendChild(document.createTextNode("Show Venue Details"))
    document.getElementsByTagName("body")[0].appendChild(showVenueTag);

    var arrowContainer = document.createElement("div")
    arrowContainer.setAttribute('id', 'arrow_container')
    
    var arrow = document.createElement("div")
    arrow.setAttribute('class', 'arrow')
    arrow.setAttribute('id', eventVenue);
    
    arrow.addEventListener('click', function(e) {
            getVenueDetails(e.target.id);
        });

    arrowContainer.appendChild(arrow)
    document.getElementsByTagName("body")[0].appendChild(arrowContainer);


    div.scrollIntoView();


}

function getVenueDetails(venueName){
    console.log(venueName);
    const url = "/getVenueDetails?venueName="+encodeURIComponent(venueName);
    fetch(url)
      .then(
        response => response.json() // .json(), .blob(), etc.
      ).then(
        json => { console.log(json); displayVenueInfo(json)} // Handle here
      );
}

function displayVenueInfo(venueDetails){
    if (document.contains(document.getElementById("arrow_container"))) {
        document.getElementById("arrow_container").remove();
    }

    if (document.contains(document.getElementById("showVenueTag"))) {
        document.getElementById("showVenueTag").remove();
    }

    var venueName = ""
    var address = "N/A"
    var city = "N/A"
    var state="N/A"
    var zipCode = "N/A"
    var upcomingEventsUrl = "";

    if('_embedded' in venueDetails && 'venues' in venueDetails._embedded && venueDetails._embedded.venues.length > 0){

        var v =  venueDetails._embedded.venues[0]

        if ('name' in v){
            venueName = v.name
        }

        if('address' in v && 'line1' in v.address){
            address = v.address.line1
        }

        if ('city' in v){
            city = v.city.name
        }

        if('state' in v && 'stateCode' in v.state){
            state=  v.state.stateCode
        }
        

        if('postalCode' in v){
            zipCode = v.postalCode
        }

        if('url' in v){
            upcomingEventsUrl = v.url
        }


    }


    var outerVenueDiv = document.createElement("div")
    outerVenueDiv.setAttribute('id', 'outerVenueDiv')

    var innerVenueDiv = document.createElement("div")
    innerVenueDiv.setAttribute('id', 'innerVenueDiv')

    var venueNameTag = document.createElement("p")
    venueNameTag.setAttribute('id', 'venueNameTag')
    venueNameTag.appendChild(document.createTextNode(venueName))
    innerVenueDiv.appendChild(venueNameTag)

    var detailsTbl = document.createElement('table')
    detailsTbl.setAttribute('id', 'detailsTbl')

    var row = document.createElement('tr')

    var dleft = document.createElement('td')
    dleft.style.borderRight = '1px solid black';
    dleft.style.width = '500px';
    dleft.style.verticalAlign = 'top'
    
    var dright = document.createElement('td')
    dright.style.width = '500px';
    dright.style.verticalAlign = 'top'
    dright.style.textAlign = 'center'

    var innerLeftDiv = document.createElement('div')


    var innerTbl = document.createElement('table')
    innerTbl.setAttribute('id', 'innerTbl')

    var innerrow1 = document.createElement('tr')
    innerrow1.style.verticalAlign = 'top'
    var innerleft = document.createElement('td')
    innerleft.style.width = '100px';
    innerleft.style.verticalAlign = 'top'
    innerleft.style.textAlign = 'center';
    var addressTag = document.createElement("p")
    addressTag.appendChild(document.createTextNode("Address:"))
    addressTag.style.fontWeight = 'bold'
    addressTag.style.marginTop='0px'
    innerleft.appendChild(addressTag)

    var innerright = document.createElement('td')
    innerright.style.width = '200px';
    innerright.style.verticalAlign = 'top'
    var addressValue = document.createElement('p')
    addressValue.style.marginTop='0px'
    addressValue.appendChild(document.createTextNode(address))
    addressValue.appendChild(document.createElement('br'))
    addressValue.appendChild(document.createTextNode(city+', '+state))
    addressValue.appendChild(document.createElement('br'))
    addressValue.appendChild(document.createTextNode(zipCode))
    innerright.appendChild(addressValue)

    var moreEvents = document.createElement('a')
    moreEvents.style.textDecoration = 'none';
    moreEvents.href = upcomingEventsUrl;
    moreEvents.style.color = "#66C2F6";
    moreEvents.target = '_blank';
    moreEvents.appendChild(document.createTextNode("More events at this venue"))
    dright.appendChild(moreEvents)

    var pmaps = document.createElement('p')
    pmaps.style.textAlign = 'center'
    var openInmaps = document.createElement('a')
    openInmaps.setAttribute('id', address);
    openInmaps.style.textDecoration = 'none';
    openInmaps.href = 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address);
    openInmaps.style.color = "#66C2F6";
    openInmaps.style.margin = '0 auto'
    openInmaps.target = '_blank';
    openInmaps.appendChild(document.createTextNode("Open in Google Maps"))    
    pmaps.appendChild(openInmaps)

    innerrow1.appendChild(innerleft)
    innerrow1.appendChild(innerright)
    innerTbl.appendChild(innerrow1)

    innerLeftDiv.appendChild(innerTbl)
    innerLeftDiv.appendChild(pmaps)
    dleft.appendChild(innerLeftDiv)
    // dleft.appendChild(innerTbl)
    // dleft.appendChild(pmaps)

    row.appendChild(dleft)
    row.appendChild(dright)
    detailsTbl.appendChild(row)    
    innerVenueDiv.appendChild(detailsTbl)

    outerVenueDiv.appendChild(innerVenueDiv)
    document.getElementsByTagName("body")[0].appendChild(outerVenueDiv);

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

    if (document.contains(document.getElementById("arrow_container"))) {
        document.getElementById("arrow_container").remove();
    }

    if (document.contains(document.getElementById("showVenueTag"))) {
        document.getElementById("showVenueTag").remove();
    }

    

    if (document.contains(document.getElementById("outerVenueDiv"))) {
        document.getElementById("outerVenueDiv").remove();
    }


}

function clearscreen(){
    console.log("clear")

    document.getElementById('eventForm').reset()

    if (document.contains(document.getElementById("no-results"))) {
            document.getElementById("no-results").remove();
        }

    if (document.contains(document.getElementById("events"))) {
            document.getElementById("events").remove();
        }

    if (document.contains(document.getElementById("event-details"))) {
            document.getElementById("event-details").remove();
        }

    if (document.contains(document.getElementById("arrow_container"))) {
        document.getElementById("arrow_container").remove();
    }

    if (document.contains(document.getElementById("showVenueTag"))) {
        document.getElementById("showVenueTag").remove();
    }

    

    if (document.contains(document.getElementById("outerVenueDiv"))) {
        document.getElementById("outerVenueDiv").remove();
    }


}