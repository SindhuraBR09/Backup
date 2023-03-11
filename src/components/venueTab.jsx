import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Venue = (props) => {
    const [openHrShowMore, setOHShowMore] = useState(false)
    const [grShowMore, setGRShowMore] = useState(false)
    const [crShowMore, setCRShowMore] = useState(false)    
    const venueDetails = props.venueDetails;

    const toggleOHShowMore = () => setOHShowMore(!openHrShowMore);
    const toggleGRShowMore = () => setGRShowMore(!grShowMore);
    const toggleCRShowMore = () => setCRShowMore(!crShowMore);

    var venueName = ""
    var address = ""
    var city = ""
    var state=""
    var zipCode = ""
    var phoneNumber = ""
    var openHous = ''
    var childRule = ''
    var generalRule = ''

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

        if('boxOfficeInfo' in v && 'openHoursDetail' in v.boxOfficeInfo){
            openHous = v.boxOfficeInfo.openHoursDetail
        }

        if('boxOfficeInfo' in v && 'phoneNumberDetail' in v.boxOfficeInfo){
            var ph = v.boxOfficeInfo.phoneNumberDetail
            const phoneRegex = /\d{3}-\d{3}-\d{4}/;
            const phoneMatch = ph.match(phoneRegex);

            if (phoneMatch) 
            {
                phoneNumber = phoneMatch[0];
            }

        }

        if ('generalInfo' in v){
            if('childRule' in v.generalInfo){
                childRule= v.generalInfo.childRule
            }
            if('generalRule' in v.generalInfo){
                generalRule= v.generalInfo.generalRule
            }
        }
        
    }

    const displayTextOH = openHrShowMore
    ? openHous
    : openHous.split(" ").slice(0, 25).join(" ") + "...";

    const displayTextGR = grShowMore
    ? generalRule
    : generalRule.split(" ").slice(0, 25).join(" ") + "...";

    const displayTextCR = crShowMore
    ? childRule
    : childRule.split(" ").slice(0, 25).join(" ") + "...";


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
                    <p className='eventTabValue'>{displayTextOH}</p>
                        {openHous.split(" ").length > 25 && (
                            <button onClick={toggleOHShowMore} style={{paddingTop:'2px', all: 'unset',color:'#566EA8', cursor: 'pointer',textDecoration: 'underline'}}>
                            {openHrShowMore ? "Show Less" : "Show More"}
                            </button>
                        )}
                    <p className='eventTabHeading'>General Rule</p>
                    <p className='eventTabValue'>{displayTextGR}</p>
                        {generalRule.split(" ").length > 25 && (
                            <button onClick={toggleGRShowMore} style={{ all: 'unset',color:'#566EA8', cursor: 'pointer',textDecoration: 'underline'}}>
                            {grShowMore ? "Show Less" : "Show More"}
                            </button>
                        )}
                    <p className='eventTabHeading'>Child Rule</p>
                    <p className='eventTabValue'>{displayTextCR}</p>
                        {childRule.split(" ").length > 25 && (
                            <button onClick={toggleCRShowMore} style={{ all: 'unset',color:'#566EA8', cursor: 'pointer',textDecoration: 'underline'}}>
                            {crShowMore ? "Show Less" : "Show More"}
                            </button>
                        )}
                    
                </Col>
            </Row>
        </Container>
    );
}
 
export default Venue;