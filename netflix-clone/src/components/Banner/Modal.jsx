import React, { useEffect, useState } from 'react';
import './Modal.css';
import ReactDom from 'react-dom';
import YouTube from 'react-youtube';
import playe from'../Banner/images/images.png'
import pause from'../Banner/images/pause-40.png'
import { API_KEY, random,convertToHours } from '../../Data';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'black',
  padding: 0,
  zIndex: 1000,
  maxHeight: '80vh',
  overflowY: 'auto',
  marginTop: '20px'
};

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, .7)',
  zIndex: 1000
};

const Modal = ({ detail, onClose, videoId,title,runtime,overview,casts,genres,movieData,Id,src,image}) => {
  const [player, setPlayer] = useState(null);
  const[playing,setPlaying]= useState(true)
  const[sameMovie,setSameMovie]=useState([])
  const[film,setFilm]=useState([])
  const[id,setID]=useState('')
  const[modalCast,setModalCast]=useState([])
  const [mute, setMute] = useState(true);


  const fetchModalvideo= async(movieId)=>{
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    const data = await response.json();
    const video = data.videos.results.find(video => video.type === 'Trailer');
    setID(video.key)
  setModalCast(data.credits.cast.slice(0, 8)); 
   setFilm(data)
   console.log(data)
  }

  const onReady = (event) => {
    setPlayer(event.target);
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
  
  const play=()=>{
    setPlaying(prev=>!prev)
    if(playing){
        handlePause()
    }
    else{
        handlePlay()
    }
  }


  const fetchSimilarMovies = async () => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${Id}/similar?api_key=${API_KEY}&language=en-US&page=1`);
    const data = await response.json();
    setSameMovie(data.results.slice(0,16))
};


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

  useEffect(()=>{
    fetchSimilarMovies()
    fetchModalvideo(videoId)
  },[movieData])


  if (!detail) return null;
  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES}>
        <div style={MODAL_STYLES} className='modal-container'>
          <div className="movie">
            <YouTube videoId={id?id:videoId} className='modal-video' opts={{ playerVars: { autoplay: 1, controls: '0', mute: 1, rel:'0' } }} onReady={onReady} />
            <div className='controls'>
                <button className='pause-btn' onClick={play}><img width='17px' src={playing?pause:playe} alt="" />{playing?'pause':'play'}</button>
                <button className='add-btn'>+</button>
                <button className='like-btn'><svg width="1.5em" height="1.5em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M16.472 20H4.1a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h2.768a2 2 0 001.715-.971l2.71-4.517a1.631 1.631 0 012.961 1.308l-1.022 3.408a.6.6 0 00.574.772h4.575a2 2 0 011.93 2.526l-1.91 7A2 2 0 0116.473 20z" stroke="currentColor" stroke-linecap="round"></path>
                <path d="M7 20V9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </button>
            </div>
            <button className='close-btn' onClick={onClose}>X</button>
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
            <div className='movie-detail'>
                <div id='movie-description'>
                    <h2>{film.title?film.title:title}</h2>
                    <p><span>69% match </span>{convertToHours(film.runtime?film.runtime:runtime)}</p>
                    <p>{film.overview?film.overview:overview}</p>
                </div>
                <div id='movie-producers'>
                <p><span>Casts:</span>{modalCast[0]?modalCast.map(actor=>actor.name+', '):casts.map(actor=>actor.name+', ')}</p>
                  <p><span>Genres:</span>{film.genres?film.genres.map(genre => genre.name+', '):genres.map(gener=>gener.name+', ')}</p>
                </div>
            </div>
            <div className='container'>
            <h2>More Like This</h2>
              <div className='similar-movies'>
              {
                sameMovie.map((movie,index)=>{
                  return(
                    <div key={index} id='movies'onClick={()=>fetchModalvideo(movie.id)}>
                      <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="" />
                    </div>
                  )
                }
              )
              }
              </div>
              <div id='trailer-image'>
                <h2>Trailer & More</h2>
                <div id='images'>
                  <a href={`https://www.youtube.com/watch?v=${id?id:videoId}`}>
                <img src={`https://image.tmdb.org/t/p/w500/${film.backdrop_path?film.backdrop_path:src}`} alt="" />
                <svg id='first' width="1.5em" height="1.5em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M6.906 4.537A.6.6 0 006 5.053v13.894a.6.6 0 00.906.516l11.723-6.947a.6.6 0 000-1.032L6.906 4.537z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </a>
                  <a href={`https://www.youtube.com/watch?v=${id?id:videoId}`}>
                <img src={`https://image.tmdb.org/t/p/w500/${film.poster_path?film.poster_path:image}`} alt="" />
                <svg id='second' width="1.5em" height="1.5em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                  <path d="M6.906 4.537A.6.6 0 006 5.053v13.894a.6.6 0 00.906.516l11.723-6.947a.6.6 0 000-1.032L6.906 4.537z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  </a>
                  <p>Official Trailer</p>
                </div>
              </div>
              <div className='final'>
                <h4>About <span id='title'>{film.title?film.title:title}</span></h4>
                <p><span>Director:</span>{casts[6].name}</p>
                <p><span>Cast:</span>{modalCast[0]?modalCast.map(actor=>actor.name+', '):casts.map(actor=>actor.name+', ')}</p>
                <p><span>Genre:</span>{film.genres?film.genres.map(genre => genre.name+', '):genres.map(gener=>gener.name+', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>, document.getElementById('portal')
  );
};

export default Modal;
