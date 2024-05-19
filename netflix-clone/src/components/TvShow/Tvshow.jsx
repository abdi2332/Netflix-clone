import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { API_KEY, random } from '../../Data';
import './TvShow.css';
import playe from '../Banner/images/images.png';
import pause from '../Banner/images/pause-40.png';
import icon1 from '../Banner/images/play-button.png'
import icon2 from '../Banner/images/pause.png'
import Modal from './Modal';
import Series from './Series/Series';
import Tv from './Tv/Tv';
import Crime from './Crime/Crime';
import Reality from './Reality/Reality';
import AnimationTv from './AnimationTv/AnimationTv';

const TvShow = () => {
    const [movies, setMovies] = useState([]);
    const [videoId, setVideoId] = useState('');
    const [playVideo, setPlayVideo] = useState(false);
    const [detail, setDetail] = useState(false);
    const [movieData, setMovieData] = useState([]);
    const [cast, setCast] = useState([]);
    const [mute, setMute] = useState(true);
    const [player, setPlayer] = useState(null);

    const fetchData = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`);
        const data = await response.json();
        console.log(data)
        setMovies(data.results[random()]);
    };

    const fetchDetail = async (movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits,seasons`);
        const data = await response.json();
        setMovieData(data);
        setCast(data.credits.cast.slice(0, 8));
    };
    console.log(movieData)
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

    const getVideos = async (movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
        const data = await response.json();
        const officialTrailer = data.videos.results.find(video => video.type === 'Trailer');
        if (officialTrailer) {
            setVideoId(officialTrailer.key);
        }
    };

    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) {
            return text;
        }
        return text.slice(0, maxLength) + '...';
    };

    const playPause = () => {
        setPlayVideo(prev => !prev);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (movies.id) {
            getVideos(movies.id);
            fetchDetail(movies.id);
        }
    }, [movies]);

    return (
        <div className='movie-Container'>
            {movies && (
                <div className='list'>
                    {playVideo ?
                        <img src={`https://image.tmdb.org/t/p/w500/${movies.backdrop_path}`} alt={movies.original_title} /> :
                        <div className='trailer'>
                            <YouTube
                                videoId={videoId}
                                className='video-trailer'
                                opts={{
                                    playerVars: {
                                        controls: 0,
                                        autoplay: 1,
                                        mute: mute ? 1 : 0,
                                        loop: 1,
                                        rel: '0'
                                    }
                                }}
                                onReady={(event) => {
                                    setPlayer(event.target);
                                    if (mute) {
                                        event.target.mute();
                                    } else {
                                        event.target.unMute();
                                    }
                                }}
                            />
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
                        </div>
                    }
                    <div className='banner-info'>
                        <h1>{movies.name}</h1>
                        <p>{movieData.overview && truncateText(movies.overview, 120)}</p> 
                        <button id='play' onClick={playPause}><img width="17px" src={playVideo ? playe : pause} alt="" />{playVideo ? 'play' : 'pause'}</button>
                        <button id='small' onClick={playPause}><img width="30px" src={playVideo ? icon1 : icon2} alt="" /></button>
                        <button onClick={() => setDetail(true)} id='more'>
                            <svg width="1em" height="1em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                                <path d="M12 11.5v5M12 7.51l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            More info
                        </button>
                        <Modal
                            videoId={videoId}
                            src={movieData.backdrop_path}
                            image={movieData.poster_path}
                            detail={detail}
                            title={movieData.title}
                            overview={movieData.overview}
                            onClose={() => setDetail(false)}
                            runtime={movieData.runtime}
                            genres={movieData.genres}
                            movieData={movieData}
                            Id={movieData.id}
                            moviedata={movieData}
                            casts={cast}
                        />
                    </div>
                </div>
            )}
           <Series/>
           <Tv/>
           <Crime/>
           <AnimationTv/>
           <Reality/>
        </div>
    );
}

export default TvShow;
