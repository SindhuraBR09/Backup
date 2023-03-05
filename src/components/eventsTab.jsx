import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";

const Events = (props) => {
    const eventDetails = props.eventTabDetails

    var eventTeams = []
    var eventTeamsUrl = []
    var eventVenue = ""
    var eventGenre = []
    var priceRanges = [] //TODO
    var eventDate = []
    var currencyType = ''
    var seatMap = "";    
    var ticketStatus = '';

    var buyTicket =  'url' in eventDetails? eventDetails.url:'';
    var eventName = 'name' in eventDetails? eventDetails.name: '';

    // const renderArtists = (team, index) => {
    //     console.log(team.link)            
    //     return ( 
    //         <p key={index} style={{display:'inline'}} > {team.name} |</p>
    //      );
    // }

    if('dates' in eventDetails && 'start' in eventDetails.dates && 'localDate' in eventDetails.dates.start){
        eventDate.push(eventDetails.dates.start.localDate);
    }

    if('dates' in eventDetails && 'start' in eventDetails.dates && 'localTime' in eventDetails.dates.start){
         eventDate.push(eventDetails.dates.start.localTime);
    }


    if('_embedded' in eventDetails &&  "attractions" in eventDetails._embedded && eventDetails._embedded.attractions.length > 0){
        for(let i=0; i < eventDetails._embedded.attractions.length;i++){
            eventTeams.push(eventDetails._embedded.attractions[i].name)
            // var teamLink=''
            // if('url'in eventDetails._embedded.attractions[i]){
            //     teamLink = eventDetails._embedded.attractions[i].url
            // }
            // eventTeams.push({name:eventDetails._embedded.attractions[i].name, link:teamLink})
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

        if('type' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].type){

            if(eventDetails.classifications[0].type.name.toLowerCase() != 'undefined'){
                eventGenre.push(eventDetails.classifications[0].type.name)
            }
           
        }

        if('subType' in eventDetails.classifications[0] && 'name' in eventDetails.classifications[0].subType){

            if(eventDetails.classifications[0].subType.name.toLowerCase() != 'undefined'){
                eventGenre.push(eventDetails.classifications[0].subType.name)
            }
           
        }
            
    }

    if('priceRanges' in eventDetails){
        if( eventDetails.priceRanges.length > 0 && 'min' in eventDetails.priceRanges[0]){
            priceRanges.push(eventDetails.priceRanges[0].min)        
        }
        if( eventDetails.priceRanges.length > 0 && 'max' in eventDetails.priceRanges[0]){
            priceRanges.push(eventDetails.priceRanges[0].max)        
        }
        if( eventDetails.priceRanges.length > 0 && 'currency' in eventDetails.priceRanges[0]){
            currencyType =  eventDetails.priceRanges[0].currency    
        }
    }

    if ('dates' in eventDetails && 'status' in eventDetails.dates && 'code' in eventDetails.dates.status){
        ticketStatus= eventDetails.dates.status.code;
    }
    if('seatmap' in eventDetails && 'staticUrl' in eventDetails.seatmap){
        seatMap = eventDetails.seatmap.staticUrl;
    }

    return (  
        <Container>
            <Row  style={{marginTop:"20px"}} className='justify-content-md-center justify-content-xs-center'>
                <Col xs={12} md={6}>
                    <p className='eventTabHeading'>Date</p>
                    <p className='eventTabValue'>{eventDate.join(' ')}</p>
                    <p className='eventTabHeading'>Artists/Teams</p>
                    <p className='eventTabValue'>{eventTeams.join(' | ')}</p>
                    <p className='eventTabHeading'>Venue</p>
                    <p className='eventTabValue'>{eventVenue}</p>
                    <p className='eventTabHeading'>Genre</p>
                    <p className='eventTabValue'>{eventGenre.join(' | ')}</p>
                    <p className='eventTabHeading'>Price Ranges</p>
                    <p className='eventTabValue'>{priceRanges.join(' - ')} {currencyType}</p>
                    <p className='eventTabHeading'>Ticket Status</p>
                    <p className='eventTabValue'>{ticketStatus}</p>

                </Col>
                <Col xs={12} md={6}>
                    <Image src={seatMap} fluid/>
                </Col>
            </Row>
        </Container>
    );
}
 
export default Events;
