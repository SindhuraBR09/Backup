import React, { Component, useState, useRef, props } from 'react';
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
import { Autocomplete, TextField,CircularProgress } from '@mui/material';
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import EventList from './eventList'
import { Spinner } from 'react-bootstrap';
import NoResults from './noResults';

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
    const [active, setActive] = useState('search');
    const [loading, setLoading] = useState(false);
    const myForm = useRef(null);
    
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(keyword, distance, category, location);
        if (autolocate) {
            findLocation();
          } else {
            geocodeAddress(location);
          }   
           
    }

    const findLocation = async () =>{
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
                console.log("IPInfo")
                console.log(response)
                console.log(lat,lng)
                getEvents(lat, lng);    
            }

    }
    
    const geocodeAddress = (location) =>{
        const myAPIKey = 'AIzaSyBpZvMEg8E7OCm6Umc8FX80tXwiCFNCJ2k';
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${myAPIKey}`;
        
        axios.get(geocodingUrl)
            .then(response => { 
                if(response.data.status == 'OK'){
                    getEvents(response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng) 
                }
                else{
                    console.log('Error in geocodeAddress');
                    setEventComponent(<NoResults text="No results available"/>)
                }               
            
            })
            .catch(error => console.log(error)); 
    }

    const getEvents = (latitude, longitude) =>{
        console.log('getevents for '+ latitude,longitude)
        const params = {
            lat: latitude,
            lng: longitude,
            loc: location,
            key : keyword,
            genre : category,
            dist: distance
        }

        axios.get('\search', {params})
            .then(response => { 
                if( '_embedded' in response.data && 'events' in response.data._embedded){
                    var tempList = response.data._embedded.events
                    const sortedEvents = tempList.sort((a, b) => {
                        const dateA = a.dates.start.localDate ? a.dates.start.localTime ? new Date(`${a.dates.start.localDate} ${a.dates.start.localTime}`) : new Date(`${a.dates.start.localDate}`) : null
                        const dateB = b.dates.start.localDate ? b.dates.start.localTime ? new Date(`${b.dates.start.localDate} ${b.dates.start.localTime}`) : new Date(`${b.dates.start.localDate}`) : null
                        if (dateA < dateB) {
                            return -1;
                          } 
                        else if (dateA > dateB) {
                            return 1;
                          } 
                        else {
                            return 0;
                          }

                      });
                    
                    setEventList(sortedEvents)
                    console.log(response.data);
                    setEventComponent(<EventList events={response.data._embedded.events}/>)
                    
                }
                else{
                    console.log('No results')
                    setEventComponent(<NoResults/>)
                }
            })
            .catch(error => console.log(error));
    }

    const getSuggestions = async (e) => {
        setLoading(true);
        setSuggestions([])
        const params = {
            keyword:e
        }
        console.log('getSuggestions '+e)
        // axios.get('\getSuggestions', {params})
        // .then(response => displaySuggestions(response.data))
        // .catch(error => console.log(error));

        try {
            const response = await axios.get('\getSuggestions', {params})
            displaySuggestions(response.data)
          } catch (error) {
            console.error(error);
          }
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
        setLoading(false);
        
    }

    // const handleNavClick = (event, name) => {
    //     event.preventDefault();
    //     setActive(name);
    // };

    const handleSelect = (event, newValue) => {
        if (newValue === undefined) {
            setKeyword(event.target.value);
        } else {
            setKeyword(newValue);
        }
    };

    const handleAutoDetectChange = (event) => {
        setAutoLocate(event.target.checked);    
        if (event.target.checked) {
          setLocation('');
        }
    };

    const handleClearClick = () => {
        setEventComponent([])
        setKeyword('')
        setCategory('default')
        setLocation('')
        setDistance(10)
        setAutoLocate(false)
    };

    const renderSpinner = () => {
        return (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        );
      };

    return(
    <div>                
        <Navbar  className='main-navbar'>
            <Nav activeKey={active} onSelect={(selectedKey) => setActive(selectedKey)} className='ms-auto'>
                <Nav.Link 
                    eventKey='search'
                    className={active === 'search' ? 'active-link' : ''}
                    href="/search"
                    style={{
                        color:'white', 
                        marginRight : 20, 
                        
                    }}                                       
                >Search
                </Nav.Link>
                <Nav.Link 
                    eventKey='favorites'
                    className={active === 'favorites' ? 'active-link' : '' }
                    style={{color:'white', marginRight : 20}} 
                    href='/favorites'
                    >Favorites
                </Nav.Link>
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
                            <Form.Label className='formLabel' style={{float:'left'}}>Keyword<span style={{color:'red'}}>*</span></Form.Label>
                            <Autocomplete 
                                required
                                disablePortal
                                disableClearable
                                options={suggestions}
                                onSelect={handleSelect}
                                value={keyword}
                                renderInput={(params) => <TextField required {...params} autoComplete="off"  sx={{bgcolor:'white',  height:40, borderRadius:2 }} onChange={(e) => getSuggestions(e.target.value)}/>}                                
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
                        <Form.Label className='formLabel' style={{float:'left'}}>Distance</Form.Label>
                        <Form.Control type="number" placeholder=""  value={distance} onChange={(e) => setDistance(e.target.value)} />
                        </Form.Group>
                        </Col>

                        <Col md={4} xs={10}>
                        <Form.Group  className="mb-3" controlId='formCategory'>
                            <Form.Label className='formLabel' style={{float:'left'}}>Category<span style={{color:'red'}}>*</span></Form.Label>
                        
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
                        <Form.Label className='formLabel' style={{float:'left'}}>Location<span style={{color:'red'}}>*</span></Form.Label>
                        <Form.Control required={!autolocate} type="text" placeholder="" value={location} onChange={(e) => setLocation(e.target.value)} disabled={autolocate} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formCheckbox">
                        <Form.Check style={{float:'left'}} className='formLabel' type="checkbox" label="Auto-Detect your location" checked={autolocate}   onChange={handleAutoDetectChange} />
                    </Form.Group>

                    <br />
                    <br />
                    <Button  className='mr-3'variant="danger" type="submit" style={{marginRight:10}}>
                        SUBMIT
                    </Button>

                    <Button variant="primary" type="reset" style={{marginLeft:10}}  
                        onClick={handleClearClick}
                    >
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