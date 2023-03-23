import React, { Component, useState, useEffect } from 'react';
import './style.css';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import axios from "axios";
import spotifyIcon from './spotifyIcon.png';
import { CircularProgressbar, buildStyles} from "react-circular-progressbar";
  

const Artists = (props) => {
    const artistDetails = props.artistDetails
    const eventDetails = props.eventDetails
    const [eventName, setEventName] = useState('')
    
    const [index, setIndex] = useState(0);
    var numberOfArtists = artistDetails.length;
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };
    
    const handlePrevClick = () => {
        if (index === 0) {
          setIndex(numberOfArtists-1);
        } else {
          setIndex(index - 1);
        }
      };
    
      const handleNextClick = () => {
        if (index === numberOfArtists-1) {
          setIndex(0);
        } else {
          setIndex(index + 1);
        }
      };

      if (artistDetails === null) {
        return <p style={{color:'white'}}>Loading artist details...</p>;
      }

    return ( 
        <Container interval={null} activeIndex={index} onSelect={handleSelect}>
            <Carousel>
                {artistDetails.map((artist, index) => (
                    <Carousel.Item key={index}>
                     <Container>
                        <Row style={{width:'80%',margin:'0 auto', marginTop:20}}>
                            <Col md={3} xs={12}>
                                <img id= 'artistPicture' src={artist.artistPicture} alt="" />
                                <p className='eventTabHeading'>{artist.name}</p>
                            </Col>
                            <Col md={3} xs={12}>
                                <p className="eventTabHeading">Popularity</p>
                                <div style={{ width:50, margin:'0 auto'}} >
                                    <CircularProgressbar
                                        radius='10'
                                        value={artist.popularity}
                                        text={`${artist.popularity}`}
                                        styles={buildStyles({
                                        textColor: "white",
                                        pathColor: "purple",
                                        textSize: '22px'
                                        })}
                                    />
                                </div>
                                
                                                                
                            </Col>
                            <Col md={3} xs={12}>
                                <p className='eventTabHeading'>Followers</p>
                                { artist.followers != '-' && !isNaN(parseInt(artist.followers)) && (
                                    <p className='eventTabValue'>{parseInt(artist.followers).toLocaleString()}</p>
                                )}
                                { artist.followers == '-'  && (
                                    <p className='eventTabValue'>{artist.followers}</p>
                                )}
                                
                            
                            </Col>
                            <Col md={3} xs={12}>
                                <p className='eventTabHeading'>Spotify</p>
                                <p><a href={artist.spotifyLink} target='_blank'><img src={spotifyIcon} style={{width:30,height:30}}/></a></p>
                            </Col>

                        </Row>

                        <Row className="align-items-center" style={{width:'80%',margin:'0 auto', marginTop:20}}>
                        <p className='eventTabHeading' style={{textAlign:'left', marginBottom:30}}>Albums featuring {artist.name}</p>
                        
                        {artist.items.map((item, itemIndex) => (
                        <Col md={4} xs={12} key={itemIndex}>
                            <img className="card-img-top" id='artistAlbumImages' key={itemIndex} src={item.images[1].url}  />
                        </Col>
                        ))}
                            </Row>
                        </Container>
                                       
                    
                </Carousel.Item>
                ))}
            </Carousel>        
        </Container>

    );
}
 
export default Artists;

