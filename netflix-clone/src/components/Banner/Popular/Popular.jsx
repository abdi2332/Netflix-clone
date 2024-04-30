import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { API_KEY,convertToHours } from '../../../Data';
import './Popular.css';
import playe from'../images/images.png'
import pause from'../images/pause-40.png'

const Popular = () => {
    const [popular, setPopular] = useState([]);
    const [player, setPlayer] = useState(null);
    const[playing,setPlaying]= useState(true)
    const [hoveredMovie, setHoveredMovie] = useState(null);
    const[isOpen,setIsOpen]=useState(false)
    const[videoData,setVideoData]=useState([])

    const fetchPopular = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        setPopular(data.results);
        console.log(popular)
    };

    const onReady = (event) => {
        setPlayer(event.target);
      };
      
      const play=()=>{
        setPlaying(prev=>!prev)
        if(playing){
            handlePause()
        }
        else{
            handlePlay()
        }
      }
      const handlePause = () => {
        if (player) {
          player.pauseVideo();
        }
      };
      const handlePlay=()=>{
        if(player){
            player.playVideo()
        }
      }

    const fetchVideo = async (movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
        const data = await response.json();
        setVideoData(data)
        const video = data.videos.results.find(video => video.type === 'Trailer');
        return video.key
        };

    useEffect(() => {
        fetchPopular();
    }, []);

    const handleMouseEnter = async (movieId) => {
        const videoKey = await fetchVideo(movieId);
        setHoveredMovie({ id: movieId, videoKey });
    };

    const handleMouseLeave = () => {
        setHoveredMovie(null);
        setPlaying(true)
    };

    return (
        <div className='popular'>
            <h3>Popular Movies</h3>
            <div className='popular-item'>
                {popular.map((movie, index) => (
                    <div key={index} className='popular-list'
                        onClick={() => {handleMouseEnter(movie.id)
                                        setIsOpen(!isOpen)}}
                        onMouseLeave={handleMouseLeave}>
                        {hoveredMovie && hoveredMovie.id === movie.id ? (
                         <div className='youtube-trailer'>
                    <YouTube videoId={hoveredMovie.videoKey} opts={{ playerVars: { controls: 0, autoplay: 1, mute: 1, rel: '0',disablekb: 1  } }} onReady={onReady} />
                    <div className='control'>
                <button className='pause-btn' onClick={play}><img width='17px' src={playing?pause:playe} alt="" /></button>
                <button className='add-btn'>+</button>
                <button className='like-btn'><svg width="1.5em" height="1.5em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M16.472 20H4.1a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h2.768a2 2 0 001.715-.971l2.71-4.517a1.631 1.631 0 012.961 1.308l-1.022 3.408a.6.6 0 00.574.772h4.575a2 2 0 011.93 2.526l-1.91 7A2 2 0 0116.473 20z" stroke="currentColor" stroke-linecap="round"></path>
                <path d="M7 20V9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
                     </div>
                     <div className="description">
                   <h3>{movie.title}</h3>
                 <p><span>69% match </span>{convertToHours(videoData.runtime)}</p>
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
                          
                        ) : (
                            <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Popular;
