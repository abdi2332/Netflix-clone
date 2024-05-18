import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { API_KEY, convertToHours } from '../../../Data';
import './Popular.css';
import playe from '../../Banner/images/images.png';
import pause from '../../Banner/images/pause-40.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CustomNextArrow,CustomPrevArrow } from './CustomArrow';

const Series = () => {
    const [popular, setPopular] = useState([]);
    const [player, setPlayer] = useState(null);
    const [playing, setPlaying] = useState(true);
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [videoData, setVideoData] = useState([]);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [mute, setMute] = useState(true);

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 3,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
    };

    const fetchPopular = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`);
        const data = await response.json();
        setPopular(data.results);
    };
    const onReady = (event) => {
        setPlayer(event.target);
    };

    const play = () => {
        setPlaying(prev => !prev);
        if (playing) {
            handlePause();
        } else {
            handlePlay();
        }
    };

    const handlePause = () => {
        if (player) {
            player.pauseVideo();
        }
    };

    const handlePlay = () => {
        if (player) {
            player.playVideo();
        }
    };
    const handleMute = () => {
        if (player) {
            if (mute) {
                player.unMute();
            } else {
                player.mute();
            }
            setMute(prevMute => !prevMute);
        }
    };

    const fetchVideo = async (movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
        const data = await response.json();
        setVideoData(data);
        const video = data.videos.results.find(video => video.type === 'Trailer');
        return video && video.key ? video.key : null;
    };

    useEffect(() => {
        fetchPopular();
    }, []);

    const handleMouseEnter = async (movieId, e) => {
        const videoKey = await fetchVideo(movieId);
    
        setHoveredMovie({ id: movieId, videoKey });
        setPosition({ top: e.clientY, left: e.clientX });}
    

    const handleMouseLeave = () => {
        setHoveredMovie(null);
        setPlaying(true);
    };

    return (
        <div className='popular'>
            <h3>Tv Shows</h3>
            <div className='popular-item'>
                <Slider {...settings}>
                    {popular.map((movie, index) => (
                        <div key={index} className='popular-list'
                            onClick={(e) => { handleMouseEnter(movie.id, e); setIsOpen(!isOpen); }}
                          >
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
                        </div>
                    ))}
                </Slider>

                {popular.map((movie, index) => {
                    if (hoveredMovie && hoveredMovie.id === movie.id&&hoveredMovie.videoKey!==null) {
                        return (
                            <div className='youtube-trailer'  onMouseLeave={handleMouseLeave} key={index} style={{ top: position.top, left: position.left }}>
                                <YouTube videoId={hoveredMovie.videoKey} opts={{ playerVars: { controls: 0, autoplay: 1, mute: 1, rel: '0', disablekb: 1 } }} onReady={onReady} />
                                <div className="player-control" onClick={handleMute}>
                            {mute ?
                                <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                                    <g clip-path="url(#sound-off_svg__clip0_3173_16686)" stroke="currentColor">
                                        <path d="M18 14l2-2m2-2l-2 2m0 0l-2-2m2 2l2 2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M2 13.857v-3.714a2 2 0 012-2h2.9a1 1 0 00.55-.165l6-3.956a1 1 0 011.55.835v14.286a1 1 0 01-1.55.835l-6-3.956a1 1 0 00-.55-.165H4a2 2 0 01-2-2z"></path>
                                    </g>
                                </svg> :
                                <svg width="1.5em" height="1.5em" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                                    <path d="M1 13.857v-3.714a2 2 0 012-2h2.9a1 1 0 00.55-.165l6-3.956a1 1 0 011.55.835v14.286a1 1 0 01-1.55.835l-6-3.956a1 1 0 00-.55-.165H3a2 2 0 01-2-2z" stroke="currentColor"></path>
                                    <path d="M17.5 7.5S19 9 19 11.5s-1.5 4-1.5 4M20.5 4.5S23 7 23 11.5s-2.5 7-2.5 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            }
                        </div>
                                <div className='control'>
                                    <button className='pause-btn' onClick={play}><img width='17px' src={playing ? pause : playe} alt="" /></button>
                                    <button className='add-btn'>+</button>
                                    <button className='like-btn'><svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M16.472 20H4.1a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h2.768a2 2 0 001.715-.971l2.71-4.517a1.631 1.631 0 012.961 1.308l-1.022 3.408a.6.6 0 00.574.772h4.575a2 2 0 011.93 2.526l-1.91 7A2 2 0 0116.473 20z" stroke="currentColor" strokeLinecap="round"></path>
                                        <path d="M7 20V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                                    </button>
                                </div>
                                 <div className="description">
                                    <h3>{movie.name}</h3>
                                    <p><span>69% match </span>{videoData.number_of_seasons} Seasons {videoData.number_of_episodes} episodes</p>
                                    <p className='genre-list'>
                                        {videoData.genres.map((genre, index) => (
                                            <React.Fragment key={genre.id}>
                                                {genre.name}
                                                {index !== videoData.genres.length - 1 && <span id="dot"> . </span>}
                                            </React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    );
};

export default Series;

