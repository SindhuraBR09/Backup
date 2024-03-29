import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ShowMoreText from "react-show-more-text";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import VenueMap from './venueMap';
import MyComponent from './venueMap';

const Venue = (props) => {
    const venueDetails = props.venueDetails;
    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [location, setLocation] = useState(null);
    const [venueName, setVenueName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipcode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [openHous, setOpenHours] = useState('')
    const [childRule, setChildRule] = useState('')
    const [generalRule, setGeneralRule] = useState('')

    const customStyles = {
        content : {
          width: '50%',
          height: '50%'
        }
      };
    

    useEffect(() => {
        const extractDetails = () =>{
            console.log('extract')
            var vn = '';
            var add = '';
            var c = ''
            var s = '';
            var z = '';
            var venueCords = {}
            if('_embedded' in venueDetails && 'venues' in venueDetails._embedded && venueDetails._embedded.venues.length > 0){

                var v =  venueDetails._embedded.venues[0]
        
                if ('name' in v){
                    vn = v.name;
                    setVenueName(v.name)
                }
                if('address' in v && 'line1' in v.address){
                    add = v.address.line1
                    setAddress(v.address.line1)
                }
                if ('city' in v){
                    c = v.city.name
                    setCity(v.city.name)
                }
                if('state' in v && 'stateCode' in v.state){
                    s = v.state.stateCode
                    setState( v.state.stateCode)
                }
                if('postalCode' in v){
                    z = v.postalCode
                    setZipcode(v.postalCode)
                }        
        
                if('boxOfficeInfo' in v && 'openHoursDetail' in v.boxOfficeInfo){
                    setOpenHours(v.boxOfficeInfo.openHoursDetail)
                }
        
                if('boxOfficeInfo' in v && 'phoneNumberDetail' in v.boxOfficeInfo){
                    var ph = v.boxOfficeInfo.phoneNumberDetail
                    const phoneRegex = /\d{3}-\d{3}-\d{4}/;
                    const phoneMatch = ph.match(phoneRegex);
        
                    if (phoneMatch) 
                    {
                        setPhoneNumber(phoneMatch[0])
                        
                    }
        
                }
        
                if ('generalInfo' in v){
                    if('childRule' in v.generalInfo){
                        setChildRule(v.generalInfo.childRule)
                    }
                    if('generalRule' in v.generalInfo){
                        setGeneralRule(v.generalInfo.generalRule)
                    }
                }

                if('location' in v){
                    var loc1 = v.location
                    if('latitude' in loc1 && 'longitude' in loc1){
                        try{
                            venueCords['lat'] = parseFloat(loc1.latitude)
                            venueCords['lng'] = parseFloat(loc1.longitude)
                            setLocation(venueCords)

                        }
                        catch{
                            console.log('Error while parsing co-ords')
                        }                        
                    }
                }
                
            }
            if(Object.keys(venueCords).length === 0){
                console.log('fetching coordinates')
                var addressForUrl = encodeURIComponent(vn+' '+add+' '+c+' '+s+' '+z)
                var goggleApiKey = 'AIzaSyASJ4xGAbnjoTbRDnrA30mV6FVJCr4qM2k'
                const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressForUrl}&key=${goggleApiKey}`
                console.log(url)
                fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    const loc = data.results[0].geometry.location;
                    console.log(loc)
                    setLocation(loc);
                })
                .catch((error) => {
                    console.error(`Geocode API request failed: ${error}`);
                });

            }

        }
        extractDetails()
    }, []);

   
    
    return (  
        <Container>
            <Row  style={{marginTop:"20px"}} className='justify-content-md-center justify-content-xs-center'>
                <Col xs={12} md={6}>
                    <p className='eventTabHeading'>Name</p>
                    <p className='eventTabValue'>{venueName}</p>
                    <p className='eventTabHeading'>Address</p>
                    <p className='eventTabValue'>{address} {city} {state}</p>
                    <p className='eventTabHeading'>Phone Number</p>
                    <p className='eventTabValue'>{phoneNumber}</p>
                </Col>
                <Col xs={12} md={6}>
                    <p className='eventTabHeading'>Open Hours</p>
                    <ShowMoreText
                            className='eventTabValue'
                            lines={3} // Set the number of lines to show by default
                            more= {<p>Show more</p>} // Text to display for "show more" link
                            less={<p>Show Less</p>} // Text to display for "show less" link
                            anchorClass='my-anchor-class' // CSS class for the "show more" anchor tag
                             // Callback function for when "show more" link is clicked
                        >
                         {openHous}
                    </ShowMoreText>
                    
                    <p className='eventTabHeading'>General Rule</p>
                    <ShowMoreText
                            className='eventTabValue'
                            lines={3} // Set the number of lines to show by default
                            more= {<p>Show more</p>} // Text to display for "show more" link
                            less={<p>Show Less</p>} // Text to display for "show less" link
                            anchorClass='my-anchor-class' // CSS class for the "show more" anchor tag
                             // Callback function for when "show more" link is clicked
                        >
                         {childRule}
                    </ShowMoreText>
                    <p className='eventTabHeading'>Child Rule</p>
                    <ShowMoreText
                            className='eventTabValue'
                            lines={3} // Set the number of lines to show by default
                            more= {<p>Show more</p>} // Text to display for "show more" link
                            less={<p>Show Less</p>} // Text to display for "show less" link
                            anchorClass='my-anchor-class' // CSS class for the "show more" anchor tag
                            
                        >
                         {generalRule}
                    </ShowMoreText>         
                    
                </Col>
            </Row>
            <Button  variant="danger" size="sm"  onClick={handleShow} style={{marginTop:30}}>Show venue on Google Map</Button>
            <Modal show={show} onHide={handleClose} animation={true}>
                <Modal.Header closeButton={false}>
                <Modal.Title>Event Venue</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ height: '300px', padding: '0' }}>
                    <MyComponent location={location}/>
                </Modal.Body >
                <Modal.Footer style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant="dark"  onClick={handleClose}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
 
export default Venue;