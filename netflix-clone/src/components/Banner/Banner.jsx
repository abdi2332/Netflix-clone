import React, { useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { API_KEY, random } from '../../Data';
import './Banner.css';
import Popular from './Popular/Popular';
import playe from'../Banner/images/images.png'
import pause from'../Banner/images/pause-40.png'
import Modal from './Modal';

const Banner = () => {
    const [movies, setMovies] = useState([]);
   
    const [videoId,setVideoId]=useState('')
    const[playVideo,setPlayVideo]=useState(false)
    const[detail,setDetail]=useState(false)
    const[movieData,setMovieData]=useState([])
    const [cast,setCast]=useState()

    const fetchData = async () => {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`);
        const data = await response.json();
        setMovies(data.results[random()]);
        console.log(movies)
    }
    const fetchDetail= async(movieId)=>{
        const response= await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,genres`)
        const data=await response.json()
        setMovieData(data)
        setCast(data.credits.cast.slice(0,8))
      }
      console.log(movieData)
  
    
    const getVideos = async (movieId) => {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
       console.log(data)
        const officialTrailer = data.results.find(elem => elem.name === "Official Trailer");
        if (officialTrailer) {
            setVideoId(officialTrailer.key);
        }
    };
    function play(){
        setPlayVideo(prev=>!prev)
    }
    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (movies.id) {
            getVideos(movies.id);
            fetchDetail(movies.id)
        }
    }, [movies]);


    return (
        <div className='movie-Container'>
            {movies && (
                <div className='list'>
                  { playVideo? <img src={`https://image.tmdb.org/t/p/w500/${movies.backdrop_path}`}
                     alt={movies.original_title} />:
                     <div className='trailer'>
                   <YouTube videoId={videoId} className='video-trailer' opts={{ playerVars: { controls: 0, autoplay: 1 ,mute:1,rel:'0'} }}/>

                     </div>}
                  <div className='banner-info'>
                    <h1>{movies.title}</h1>
                    <p>{movies&&movies.overview}</p>
                    <button id='play' onClick={play}><img width="17px" src={playVideo?playe:pause} alt="" />{playVideo?'play':'pause'}</button>
                    <button onClick={()=>setDetail(true)} id='more'><svg width="1em" height="1em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M12 11.5v5M12 7.51l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>More info</button>
                    
                    <Modal videoId={videoId}
                           src={movieData.backdrop_path}
                           image={movieData.poster_path}
                           detail={detail}
                           title={movieData.title}
                           overview={movieData.overview}
                           onClose={()=>setDetail(false)}
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
            <Popular/>
        </div>
    );
}

export default Banner;
