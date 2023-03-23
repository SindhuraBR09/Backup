import React, { Component, useState, useEffect } from 'react';
import './style.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const Favorites = () => {

    const [favorites, setFavorites] = useState([]);
    const [active, setActive] = useState('favorites');


    useEffect(() => {
      const favoritesData = JSON.parse(localStorage.getItem('favorites'));
      if (favoritesData) {
        setFavorites(favoritesData);
      }
    }, []);
  
    const handleDelete = (eventId) => {
      const updatedFavorites = favorites.filter(favorite => favorite.id !== eventId);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    }
  
    
    return ( 
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
        

            <table className='fvt' style={{ margin: '0 auto', borderCollapse: 'separate', borderSpacing: '0 0', backgroundColor: 'white', borderRadius: '10px' }}>
                    <thead>
                    <tr style={{padding:10}}>
                        <th style={{padding:10,borderBottom: '1px solid #ccc'}}>#</th>
                        <th style={{padding:10,borderBottom: '1px solid #ccc'}}>Date</th>
                        <th style={{padding:10,borderBottom: '1px solid #ccc'}}>Event Name</th>
                        <th style={{padding:10,borderBottom: '1px solid #ccc'}}>Genre</th>
                        <th style={{padding:10,borderBottom: '1px solid #ccc'}}>Venue</th>
                        <th style={{padding:10,borderBottom: '1px solid #ccc'}}>Favorite</th>
                    </tr>
                    </thead>
                    <tbody>
                    {favorites.map((favorite, index) => (
                        <tr key={favorite.id}>
                        <th style={{padding:10, borderBottom: '1px solid #ccc'}}>{index + 1}</th>
                        <td style={{padding:10,borderBottom: '1px solid #ccc'}}>{favorite.date}</td>
                        <td style={{padding:10,borderBottom: '1px solid #ccc'}}>{favorite.name}</td>
                        <td style={{padding:10,borderBottom: '1px solid #ccc'}}>{favorite.genre.join(' | ')}</td>
                        <td style={{padding:10,borderBottom: '1px solid #ccc'}}>{favorite.venue}</td>
                        <td style={{padding:10,borderBottom: '1px solid #ccc'}}>
                            <FontAwesomeIcon icon={faTrashAlt}  onClick={() => handleDelete(favorite.id)} style={{ backgroundColor: 'transparent' }} />
                            
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            
        </div>
     );
}
 
export default Favorites;