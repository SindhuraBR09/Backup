import React, { Component, useState, useEffect } from 'react';
import  PropTypes  from "prop-types";
import './style.css';
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image'
import Button from 'react-bootstrap/Button';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import axios from "axios";
import AppBar  from '@mui/material/AppBar';
import Events  from './eventsTab';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <div sx={{ p: 3 }}>
            <p>{children}</p>
          </div>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const EventList = (props) => {
    const [showDetails, setShowDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [eventDetails, setEventDetails] = useState({});
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    var events = []
    for( let i=0; i < props.events.length;i++){
        let eventName = "";
        let eventIcon = "";
        let eventDate = "";
        let eventTime = "";
        let eventVenue = "";
        let eventGenre = "";
        let eventId = '';

        if ('name' in props.events[i]){
            eventName = props.events[i]["name"];
        }

        if ('id' in props.events[i]){
            eventId= props.events[i]["id"];
        }
        if ('dates' in props.events[i] && 'start' in props.events[i].dates){
            if('localDate' in props.events[i].dates.start){
                eventDate = props.events[i].dates.start.localDate;
            }

            if('localTime' in props.events[i].dates.start){
                eventTime = props.events[i].dates.start.localTime;
            }
        }

        if("images" in props.events[i] && props.events[i].images.length > 0){
            eventIcon = props.events[i].images[0].url;
        }
        if("venues" in props.events[i]._embedded && props.events[i]._embedded.venues.length > 0){

            if(props.events[i]._embedded.venues[0].name != "Undefined" || props.events[i]._embedded.venues[0].name != "undefined" )
            {
                eventVenue = props.events[i]._embedded.venues[0].name;
            }                  
            
        }

        if( "classifications" in props.events[i] && props.events[i].classifications.length>0 && 'segment' in props.events[i].classifications[0]){
            if(props.events[i].classifications[0].segment.name != "Undefined" || props.events[i].classifications[0].segment.name != "undefined" ){
                eventGenre = props.events[i].classifications[0].segment.name;
            }
        }
        events.push({
            'name':eventName,
            'date':eventDate,
            'time': eventTime,
            'icon': eventIcon,
            'genre': eventGenre,
            'venue': eventVenue,
            'id':eventId
        })
       
    }

    const handleEventClick = (event) => {
        setSelectedEvent(event.id);
        setShowDetails(true);
        console.log(selectedEvent)
      };

      const handleBackClick = () => {
        setSelectedEvent('')
        setEventDetails({})
        setShowDetails(false);
      };

      useEffect(() => {
        const fetchEventDetails = async () => {
            const params = {
                keyword: selectedEvent
            }
            const response = await axios.get('/getEventDetails', {params});      
            console.log(response.data)
            setEventDetails(response.data);
        };
    
        if (showDetails) {
          fetchEventDetails();
        }
      }, [selectedEvent, showDetails]);

    const renderEvents = (event, index) => {
        return ( 
            <tr key={index}>
                <td>{event.date}<br/>{event.time}</td>
                <td><Image src={event.icon} alt="" /></td>
                <td key={event.name} onClick={() => handleEventClick(event)}>{event.name}</td>
                <td>{event.genre}</td>
                <td>{event.venue}</td>
            </tr>
         );
    }
    

    return (  

        <div>
            {showDetails ? (
                <div className='eventDetailDiv'>
                    <h2 style={{color:"white"}}>{eventDetails.name}</h2>
                    <AppBar sx={{backgroundColor:'#559A8E'}} position="static">
                        <Tabs value={selectedTab} onChange={handleTabChange} textColor="white" variant="fullWidth" aria-label="tabs">
                            <Tab label="Events" {...a11yProps(0)}/>
                            <Tab label="Artists/Teams" {...a11yProps(1)}/>
                            <Tab label="Venue" {...a11yProps(2)}/>
                        </Tabs>
                    </AppBar>
                        <TabPanel value={selectedTab} index={0}><Events eventTabDetails={eventDetails}/></TabPanel>
                        <TabPanel value={selectedTab} index={1}>Artist/Teams</TabPanel>
                        <TabPanel value={selectedTab} index={2}>Venue</TabPanel>
                    
                    <Button onClick={handleBackClick}>Back</Button>
                </div>
            ) : 
            (<Table responsive striped bordered hover variant="dark">
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Icon</th>
                        <th>Event</th>
                        <th>Genre</th>
                        <th>Venue</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(renderEvents)}
                </tbody>

            </Table>)}
        </div>
    

    );
}
 
export default EventList;