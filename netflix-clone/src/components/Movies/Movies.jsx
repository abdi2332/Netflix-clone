import React, { useEffect, useState } from 'react';
import './Movies.css';
import { API_KEY } from '../../Data';
import Slider from "react-slick";
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";

const Movies = () => {
  const [popular, setPopular] = useState([]);
  const [clickedId, setClickedId] = useState(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  const fetchPopular = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
    const data = await response.json();
    setPopular(data.results);
  };

  useEffect(() => {
    fetchPopular();
  }, []);

  const handleImageClick = (id, e) => {
    setClickedId(id);
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.top, left: rect.left });
  };

  return (
    <div className="movies-container">
      <Slider {...settings} className="my-slider">
        {popular.map((elem, index) => (
          <div key={index} className="images" onClick={(e) => handleImageClick(elem.id, e)}>
            <img src={`https://image.tmdb.org/t/p/w500/${elem.poster_path}`} alt="" />
          </div>
        ))}
      </Slider>
      {clickedId !== null && (
        <div className="clicked-item" style={{ top: position.top, left: position.left }}>
          <img src={`https://image.tmdb.org/t/p/w500/${popular.find(movie => movie.id === clickedId)?.poster_path}`} alt="" />
        </div>
      )}
    </div>
  );
};

export default Movies;
