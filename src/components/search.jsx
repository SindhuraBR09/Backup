import React, { Component, useState } from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.css'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { Autocomplete, TextField } from '@mui/material';
import EventList from './eventList'

function toggle(value){
    return !value;
  }


const Search = () => {
    
    const [keyword, setKeyword] = useState('');
    const [distance, setDistance] = useState(10);
    const [category, setCategory] = useState('default');
    const [location, setLocation] = useState('');
    const [autolocate, setAutoLocate] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState('');
    const [eventComponent, setEventComponent] = useState([])
    const [eventList, setEventList] = useState([])

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(keyword, distance, category, location)   
        geocodeAddress(location);     
    }
    
    const geocodeAddress = (location) =>{
        const myAPIKey = 'AIzaSyBpZvMEg8E7OCm6Umc8FX80tXwiCFNCJ2k';
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${myAPIKey}`;
        
        axios.get(geocodingUrl)
            .then(response => { getEvents(response.data) })
            .catch(error => console.log(error)); 
    }

    const getEvents = (data) =>{
        console.log(data)
        if(data.status == 'OK'){
            const params = {
                lat: data.results[0].geometry.location.lat,
                lng: data.results[0].geometry.location.lng,
                loc: location,
                key : keyword,
                genre : category,
                dist: distance
            }

            axios.get('\search', {params})
                .then(response => { 
                    if( '_embedded' in response.data && 'events' in response.data._embedded){
                        setEventList(response.data._embedded.events)
                        console.log(response.data);
                        setEventComponent(<EventList events={response.data._embedded.events}/>)
                        
                    }
                })
                .catch(error => console.log(error));
            
        }
    }

    const getSuggestions = (e) => {
        setKeyword(e)
        const params = {
            keyword:e
        }
        console.log('getSuggestions')
        axios.get('\getSuggestions', {params})
        .then(response => displaySuggestions(response.data))
        .catch(error => console.log(error));
    }

    const displaySuggestions = (data) =>{
        setSuggestions([])
        var temp=[]
        if('_embedded' in data && 'attractions' in data._embedded){
            var sugArray = data._embedded.attractions;
            for (let i=0; i<sugArray.length; i++){
                temp.push(sugArray[i].name)
            }
        }
        setSuggestions(temp)
        
    }
    return(
    <div>                
        <Navbar  className='main-navbar'>
            <Nav className='ms-auto'>
                <Nav.Link style={{color:'white', marginRight : 20}} href='/search'>Search</Nav.Link>
                <Nav.Link style={{color:'white', marginRight : 20}} href='/favorites'>Favorites</Nav.Link>
            </Nav>
        </Navbar>
        <div id='formContainer'>
            <Container>
                <h1 id='event_search'>Event Search</h1>
                <hr style={{ color: 'white', height:5}} />
                <Form id = 'mainForm' onSubmit={handleSubmit}>
                    <Row>
                        <Col>
                        <Form.Group className="mb-3" controlId='formKeyword'>
                            <Form.Label className='formLabel'>Keyword</Form.Label>
                            {/* <Form.Control required type="text" placeholder=""  value={keyword} onChange={(e) => getSuggestions(e.target.value)}/>                             */}
                            <Autocomplete 
                                disablePortal
                                disableClearable
                                options={suggestions}
                                renderInput={(params) => <TextField required {...params} sx={{bgcolor:'white',  height:40, borderRadius:2 }} onChange={(e) => getSuggestions(e.target.value)}/>}                                
                                freeSolo
                                ListboxProps={
                                    {
                                      style:{
                                          maxHeight: '150px',
                                    
                                      }
                                    }
                                  }
                                
                            />
                        </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={7} xs={12}>
                        <Form.Group className="mb-3" controlId='formDistance'>
                        <Form.Label className='formLabel'>Distance</Form.Label>
                        <Form.Control type="text" placeholder=""  value={distance} onChange={(e) => setDistance(e.target.value)} />
                        </Form.Group>
                        </Col>

                        <Col md={5} xs={10}>
                        <Form.Group  className="mb-3" controlId='formCategory'>
                            <Form.Label className='formLabel'>Category</Form.Label>
                        
                            <Form.Select aria-label="Category"  value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="default">Default</option>
                                <option value="music">Music</option>
                                <option value="sports">Sports</option>
                                <option value="art">Art & Theater</option>
                                <option value="film">Film</option>
                                <option value="miscellaneous">Miscellaneous</option>
                            </Form.Select>
                        </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId='formLocation'>
                        <Form.Label className='formLabel'>Location</Form.Label>
                        <Form.Control required type="text" placeholder="" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCheckbox">
                        <Form.Check className='formLabel' type="checkbox" label="Auto Detect" checked={autolocate}  onChange={() => setAutoLocate(toggle)} />
                    </Form.Group>


                    
                    <Button  className='mr-3'variant="danger" type="submit">
                        SUBMIT
                    </Button>

                    <Button variant="primary" type="reset">
                        CLEAR
                    </Button>
                </Form>
            </Container>            
        </div>

        {eventComponent}
    </div> 
    )}
 
export default Search;



// componentDidMount() {
    //     this.callBackendAPI()
    //       .then(res => this.setState({ data: res.data }))
    //       .catch(err => console.log(err));
    //   }
    // callBackendAPI = async () => {
    //     const response = await fetch('/search');
    //     const body = await response.json();
    
    //     if (response.status !== 200) {
    //       throw Error(body.message) 
    //     }
    //     return body;
    //   };