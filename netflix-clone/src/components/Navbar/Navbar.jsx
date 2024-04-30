import React from 'react'
import logo from '../Navbar/images/logo.svg'
import './Navbar.css'
import { Link } from 'react-router-dom'



const Navbar = () => {
  return (
    <div className='navbar-container'>
        <ul className='navbar-list'>
        <img src={logo} alt="" />
        <li><Link to="/">Home</Link></li>
        <li><Link to="/TvShow">Tv Shows</Link></li>
        <li><Link to="/Movies">Movies</Link></li>
        <li><Link to="/Movies">My List</Link></li>
        <li><Link to="/Movies">Browse By Genres</Link></li>
        </ul>
        <div className='search-icon'>
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M17 17l4 4M3 11a8 8 0 1016 0 8 8 0 00-16 0z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>
    </div>
  )
}

export default Navbar
