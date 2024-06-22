import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import { API_KEY } from '../../Data';
const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

 // Replace with your TMDB API key
  const API_URL = 'https://api.themoviedb.org/3/search/multi';

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        fetchResults();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchResults = async () => {
    try {
      const response = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          query: query,
        },
      });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search Movies or TV Shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="results-container">
        {results.map((item) => (
          <div key={item.id} className="result-item">
            {item.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                alt={item.title || item.name}
                className="result-image"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
