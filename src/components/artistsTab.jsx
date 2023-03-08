import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";
import Carousel from 'react-bootstrap/Carousel';
import axios from "axios";


const Artists = (props) => {
    // const artistDetails = props.artistDetails
    const eventDetails = props.eventDetails
    const [eventName, setEventName] = useState('')
    const [artistDetails, setArtistDetails] = useState([])
    // console.log(artistDetails)
    
    
      useEffect(() => {
            const fetchArtistDetails = async (eventData) => {
            var Teams = []
            if('classifications' in eventDetails && eventDetails.classifications.length > 0){
                if('segment' in eventDetails.classifications[0] && 'name' in  eventDetails.classifications[0].segment){
                    if(eventDetails.classifications[0].segment.name.toLowerCase() != 'music'){
                        return;
                    }
                      
                }
            }
            if('_embedded' in eventData &&  "attractions" in eventData._embedded && eventData._embedded.attractions.length > 0){
                for(let i=0; i < eventData._embedded.attractions.length;i++){
                    Teams.push(eventData._embedded.attractions[i].name)
                }
            }  
    
    
            const temp = [];
            for (let i = 0; i < Teams.length; i++) {
                const artist = Teams[i];
                try{
                    const albumResponse = await axios.get(`/getArtistAlbums?name=${artist}`);
                    const artistDetails = albumResponse.data;
                    temp.push(artistDetails);
                }
                catch (error)
                {
                    console.log('Artist not found')
                }
                
            }
            console.log(temp)
            setArtistDetails(temp)
            props.handleFetchArtistAlbums();
        };

        if(props.fetchArtistAlbums){
          console.log('called axios')
          fetchArtistDetails(props.eventDetails)
          
        }
      }, [props.fetchArtistAlbums]);

    return ( 
        <Container>
            <p>{eventDetails.name}</p>
        </Container> 

    );
}
 
export default Artists;