
var sortOrder = '';
var prevSortCol = null;

var ticketStatusColor={
    'onsale': ['green','On Sale'],
    'offsale': ['red', 'Off Sale'],
    'cancelled': ['black','Cancelled'],
    'postponed': ['orange', 'Postponed'],
     'rescheduled': ['orange', 'Rescheduled']
}
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

    if(document.getElementById("autodetect").checked){
        getIPInfo(searchInfo)
    }
    else{
        geocodeAddress(searchInfo)    

    }
    
    
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
        const lat = response.results[0].geometry.location.lat;
        const lng = response.results[0].geometry.location.lng;
    

        convertToGeohash(lat,lng, searchInfo);
}

async function getIPInfo(searchInfo) {

    let response = await fetch("https://ipinfo.io/json?token=2767c4a5860528")
                        .then((response) => response.json())
                         .then((jsonResponse) => {return jsonResponse});
    let coordinates=[];
    if ('loc' in response){
        coordinates = response.loc.split(",")
    }
    if (coordinates.length == 2){
        const lat = coordinates[0]
        const lng = coordinates[1]
        convertToGeohash(lat, lng, searchInfo);    
    }
    
}

 function convertToGeohash(lat,lng, searchInfo) {

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
        th.style.backgroundColor='white';
        th.style.height="40px";
        th.style.boxShadow= "5px 5px 8px grey";
        th.addEventListener('click', function(e) {
                    sortEvents(i)
                });
        thead.appendChild(th);
    }
 
    var tblBody = document.createElement("tbody");
    tbl.appendChild(tblBody);

    // tbl.style.width = '100%';
    tbl.style.border = '1px solid black';
    tbl.style.backgroundColor = 'white';
    tbl.style.borderSpacing= 0;
    tbl.style.borderCollapse= 'collapse';

    let totalEvents = Math.min(20, eventInfo._embedded.events.length);

    let events = eventInfo._embedded.events;

    for (let i = 0; i < totalEvents; i++) {

            let eventName = "";
            let eventIcon = "";
            let eventDate = "";
            let eventTime = "";
            let eventVenue = "";
            let eventGenre = "";

            if ('name' in events[i]){
                eventName = events[i]["name"];
            }

            if ('dates' in events[i] && 'start' in events[i].dates){
                if('localDate' in events[i].dates.start){
                    eventDate = events[i].dates.start.localDate;
                }

                if('localTime' in events[i].dates.start){
                    eventTime = events[i].dates.start.localTime;
                }
            }

            if("images" in events[i] && events[i].images.length > 0){
                eventIcon = events[i].images[0].url;
            }
            if("venues" in events[i]._embedded){
                eventVenue = events[i]._embedded.venues[0].name;
            }

            if( "classifications" in events[i] && events[i].classifications.length>0 && 'segment' in events[i].classifications[0]){
                if(events[i].classifications[0].segment.name != "Undefined" || events[i].classifications[0].segment.name != "undefined" ){
                    eventGenre = events[i].classifications[0].segment.name;
                }
            }

            var tr = document.createElement('tr');
            tblBody.appendChild(tr);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.width = "150px";
            td.appendChild(document.createTextNode(eventDate));
            td.appendChild(document.createTextNode('\n'));
            td.appendChild(document.createTextNode(eventTime));
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
            td.style.width = "500px";
            td.style.paddingLeft = "20px";
            td.style.paddingRight = "20px";

            

            var link = document.createElement("a");
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
            td.appendChild(link);
            tr.appendChild(td);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.width = "100px";
            td.style.paddingLeft = "20px";
            td.style.paddingRight = "20px";
            

            td.appendChild(document.createTextNode(eventGenre));
            tr.appendChild(td);

            var td = document.createElement('td');
            td.style.border = '1px solid black';
            td.style.width = "280px";
            td.style.paddingLeft = "20px";
            td.style.paddingRight = "20px";
            

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
    var seatMap = "";    
    var ticketStatus = '';
    var venueDetailsFromEvent = {};
    
    var buyTicket =  'url' in eventDetails? eventDetails.url:'';
    var eventName = 'name' in eventDetails? eventDetails.name: '';

    if('dates' in eventDetails && 'start' in eventDetails.dates && 'localDate' in eventDetails.dates.start){
        eventDate.push(eventDetails.dates.start.localDate);
    }

    if('dates' in eventDetails && 'start' in eventDetails.dates && 'localTime' in eventDetails.dates.start){
         eventDate.push(eventDetails.dates.start.localTime);
    }


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
    
    if('classifications' in eventDetails && eventDetails.classifications.length > 0){
        if('segment' in eventDetails.classifications[0] && 'name' in  eventDetails.classifications[0].segment){
            if(eventDetails.classifications[0].segment.name.toLowerCase() != 'undefined'){
                eventGenre.push(eventDetails.classifications[0].segment.name)
            }
              
        }
        if('genre' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].genre){
            if(eventDetails.classifications[0].genre.name.toLowerCase() != 'undefined'){
                eventGenre.push(eventDetails.classifications[0].genre.name)
            }
            
        }

        if('subGenre' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].subGenre){

            if(eventDetails.classifications[0].subGenre.name.toLowerCase() != 'undefined'){
                eventGenre.push(eventDetails.classifications[0].subGenre.name)
            }
           
        }
            
    }

    if('type' in eventDetails && eventDetails.type.toLowerCase() != 'undefined'){
        eventGenre.push(eventDetails.type);
    }

    if('subType' in eventDetails && eventDetails.subType.toLowerCase() != 'undefined'){
        eventGenre.push(eventDetails.subType)
    }

    if('priceRanges' in eventDetails){
        priceRanges.push(eventDetails.priceRanges[0].min)
        priceRanges.push(eventDetails.priceRanges[0].max)
        currencyType = eventDetails.priceRanges[0].currency
    }

    if ('dates' in eventDetails && 'status' in eventDetails.dates && 'code' in eventDetails.dates.status){
        ticketStatus= eventDetails.dates.status.code;
    }
    if('seatmap' in eventDetails && 'staticUrl' in eventDetails.seatmap){
        seatMap = eventDetails.seatmap.staticUrl;
    }

    if('_embedded' in eventDetails && 'venues' in eventDetails._embedded && eventDetails._embedded.venues.length > 0){
        details = eventDetails._embedded.venues[0]
        if('name' in details){
            venueDetailsFromEvent['name'] = details.name;
        }
        
        if('address' in details && 'line1' in details.address){
            venueDetailsFromEvent['address'] = details.address.line1
        }

        if('city' in details){
            venueDetailsFromEvent['city'] = details.city.name
        }

        if('state' in details && 'stateCode' in details.state){
            venueDetailsFromEvent['stateCode']=  details.state.stateCode
        }        

        if('postalCode' in details){
            venueDetailsFromEvent['zipCode'] = details.postalCode
        }

        if('location' in details && 'latitude' in details.location){
            venueDetailsFromEvent['latitude'] = details.location.latitude
        }
        if('location' in details && 'longitude' in details.location){
            venueDetailsFromEvent['longitude'] = details.location.longitude
        }

    }

    /////////////////////////////////////////////////////

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

    var ticketStatusDiv = document.createElement('div')
    ticketStatusDiv.setAttribute('id', 'ticketStatusDiv')
    var bgColor = '';
    try{
        arr = ticketStatusColor[ticketStatus]
        bgColor = arr[0]
        ticketStatus = arr[1]
    }
    catch{
        bgColor = 'red'
    }
    ticketStatusDiv.style.backgroundColor = bgColor;

    var ticketStatusValue = document.createElement("p");
    // ticketStatusValue.setAttribute('class','eventDetailValues');
    ticketStatusValue.style.fontFamily = 'Arial, sans-serif'
    ticketStatusValue.style.fontWeight = "12px";
    ticketStatusValue.style.color='white';
    ticketStatusValue.style.textAlign='center';
    ticketStatusValue.style.marginLeft = "10px";
    ticketStatusValue.style.marginRight = "10px";

    ticketStatusValue.style.marginTop = "5px";
    

    ticketStatusValue.appendChild(document.createTextNode(ticketStatus));
    ticketStatusDiv.appendChild(ticketStatusValue)
    leftdiv.appendChild(ticketStatusDiv);

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
            getVenueDetails(e.target.id, venueDetailsFromEvent);
        });

    arrowContainer.appendChild(arrow)
    document.getElementsByTagName("body")[0].appendChild(arrowContainer);


    div.scrollIntoView({behavior: "smooth"});


}

function getVenueDetails(venueName, venueDetailsFromEvent){
    console.log(venueName);
    const url = "/getVenueDetails?venueName="+encodeURIComponent(venueName);
    fetch(url)
      .then(
        response => response.json() // .json(), .blob(), etc.
      ).then(
        json => { console.log(json); displayVenueInfo(json, venueDetailsFromEvent)} // Handle here
      );
}

function displayVenueInfo(venueDetails, venueDetailsFromEvent){
    console.log( venueDetailsFromEvent)
    if (document.contains(document.getElementById("arrow_container"))) {
        document.getElementById("arrow_container").remove();
    }

    if (document.contains(document.getElementById("showVenueTag"))) {
        document.getElementById("showVenueTag").remove();
    }

    var venueName = ""
    var address = ""
    var city = ""
    var state=""
    var zipCode = ""
    var upcomingEventsUrl = "";
    var venueIcon = "";

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
        if('images' in v && v.images.length > 0 && 'url' in v.images[0]){
            venueIcon = v.images[0].url
        }
    }

    if(!venueName){
        venueName = 'name' in venueDetailsFromEvent ? venueDetailsFromEvent['name']:''
    }
    if(!address){
        address = 'address' in venueDetailsFromEvent ? venueDetailsFromEvent['address']:'N/A'
    }

    if(!city){
        city = 'city' in venueDetailsFromEvent ? venueDetailsFromEvent['city']: 'N/A'
        
    }
    if(!state){
        state = 'stateCode' in venueDetailsFromEvent ? venueDetailsFromEvent['stateCode'] : 'N/A'
    }

    if(!zipCode){
        zipCode = 'zipCode' in venueDetailsFromEvent ? venueDetailsFromEvent['zipCode'] : 'N/A'
    }


    var outerVenueDiv = document.createElement("div")
    outerVenueDiv.setAttribute('id', 'outerVenueDiv')

    var innerVenueDiv = document.createElement("div")
    innerVenueDiv.setAttribute('id', 'innerVenueDiv')

    var venueNameTag = document.createElement("p")
    venueNameTag.setAttribute('id', 'venueNameTag')
    venueNameTag.appendChild(document.createTextNode(venueName))
    innerVenueDiv.appendChild(venueNameTag)

    console.log('venue icon '+ venueIcon)
    if(venueIcon){
        var venueImgTag = document.createElement("img")
        venueImgTag.src = venueIcon
        venueImgTag.style.margin = 'auto';
        venueImgTag.style.marginTop = '20px';
        venueImgTag.style.display = 'block';
        innerVenueDiv.appendChild(venueImgTag)
    }

    

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
    openInmaps.href = 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address+' '+city+' '+state);
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
    sortOrder = '';
    prevSortCol = null;

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
    prevSortCol = null;
    sortOrder = '';
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


function sortEvents(index) 
{
    console.log(index, sortOrder);
    if (index == 2 || index == 3 || index == 4)
    {

            const table = document.getElementById('events')
            const tableBody = table.querySelector('tbody');
            const rows = tableBody.querySelectorAll('tr');
            const newRows = Array.from(rows);

            if (!sortOrder || sortOrder == "dsc" || prevSortCol != index)
            {
                sortOrder = "asc";
                prevSortCol = index;
                newRows.sort(function (rowA, rowB) 
                {
                // Get the content of cells
                const cellA = rowA.querySelectorAll('td')[index].innerText;
                const cellB = rowB.querySelectorAll('td')[index].innerText;

                switch (true) 
                    {
                        case cellA > cellB:
                            return 1;
                        case cellA < cellB:
                            return -1;
                        case cellA === cellB:
                            return 0;
                    }
                });

            }
            else if(sortOrder == "asc")
            {
                sortOrder= "dsc"
                 newRows.sort(function (rowA, rowB) 
                 {
                        // Get the content of cells
                        const cellA = rowA.querySelectorAll('td')[index].innerText;
                        const cellB = rowB.querySelectorAll('td')[index].innerText;

                        switch (true) 
                        {
                            case cellA < cellB:
                                return 1;
                            case cellA > cellB:
                                return -1;
                            case cellA === cellB:
                                return 0;
                        }
                });
            }

            [].forEach.call(rows, function (row) {
                tableBody.removeChild(row);
            });

            // Append new row
            newRows.forEach(function (newRow) {
                tableBody.appendChild(newRow);
            });

    }
    

}