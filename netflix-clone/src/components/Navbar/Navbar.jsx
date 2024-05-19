import React, { useState, useEffect } from 'react';
import logo from '../Navbar/images/logo.svg';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { API_KEY } from '../../Data';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [genres, setGenres] = useState({ movie: [], tv: [] });
  const [showModal, setShowModal] = useState(false);

  const handleEnter = () => {
    setShowModal(true);
  };

  const handleLeave = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const [movieGenresResponse, tvGenresResponse] = await Promise.all([
          fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
          fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`)
        ]);
        const [movieGenresData, tvGenresData] = await Promise.all([
          movieGenresResponse.json(),
          tvGenresResponse.json()
        ]);
        setGenres({
          movie: movieGenresData.genres,
          tv: tvGenresData.genres
        });
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  return (
    <nav className={`navbar-container ${scrolled ? 'scrolled' : ''}`}>
      <ul className='navbar-list'>
        <li key="home-logo" id='home-logo'>
          <img src={logo} alt="Logo" />
        </li>
        <li key="home-link">
          <Link to="/">Home</Link>
        </li>
        <li key="tv-show-link">
          <Link to="/TvShow">TV Shows</Link>
        </li>
        <li key="movies-link">
          <Link to="/Movies">Movies</Link>
        </li>
        <li key="my-list-link">
          <Link to="/List">My List</Link>
        </li>
        <li key="browse-genres-link" onMouseEnter={handleEnter} onMouseLeave={handleLeave} style={{ cursor: 'pointer' }}>
          Browse By Genres
          {showModal && (
            <div className='navbar-modal'>
              <p>Movies</p>
              <ul className='movie-link'>
                {genres.movie.map(genre => (
                  <li key={genre.id}>
                    <Link to={`/Genres/movie/${genre.id}/${genre.name}`}>{genre.name}</Link>
                  </li>
                ))}
              </ul>
              <p>TV Shows</p>
              <ul className='tv-link'>
                {genres.tv.map(genre => (
                  <li key={genre.id}>
                    <Link to={`/Genres/tv/${genre.id}/${genre.name}`}>{genre.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      </ul>
      <div className='search-icon'>
        <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" strokeWidth="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
          <path d="M17 17l4 4M3 11a8 8 0 1016 0 8 8 0 00-16 0z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      </div>
    </nav>
  );
};

export default Navbar;
