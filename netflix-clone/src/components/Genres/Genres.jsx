import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_KEY, convertToHours } from '../../Data';
import YouTube from 'react-youtube';
import playe from '../Banner/images/images.png'
import pause from '../Banner/images/pause-40.png';
function Genres() {
  const { movie, id, genreName } = useParams();
  const [media, setMedia] = useState([]);
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [videoData, setVideoData] = useState(null);
  const [mute, setMute] = useState(true);

  console.log(videoData)

  useEffect(() => {
    const fetchMediaByGenre = async () => {
      try {
        const endpoint = movie === 'movie' ? 'discover/movie' : 'discover/tv';
        const response = await fetch(`https://api.themoviedb.org/3/${endpoint}?api_key=${API_KEY}&with_genres=${id}`);
        const data = await response.json();
        setMedia(data.results);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMediaByGenre();
  }, [id, movie]);

  const fetchVideo = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`);
    const data = await response.json();
    setVideoData(data);
    const video = data.videos.results.find(video => video.type === 'Trailer');
    return video.key;
  };

  const handleMouseEnter = async (movieId, e) => {
    const videoKey = await fetchVideo(movieId);
    setHoveredMovie({ id: movieId, videoKey });
  };

  const handleMouseLeave = () => {
    setHoveredMovie(null);
    setPlaying(true);
  };

  const onReady = (event) => {
    setPlayer(event.target);
  };

  const playPause = () => {
    if (player) {
      if (playing) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setPlaying(prevPlaying => !prevPlaying);
    }
  };

  const toggleMute = () => {
    if (player) {
      if (mute) {
        player.unMute();
      } else {
        player.mute();
      }
      setMute(prevMute => !prevMute);
    }
  };


  return (
    <>
      <h2>{genreName}</h2>
      <div className='list-container'>
        {media && media.map((elem, index) => (
          <div className="fav-list" key={index} onClick={(e) => handleMouseEnter(elem.id, e)} onMouseLeave={handleMouseLeave}>
            {elem.poster_path && <img src={`https://image.tmdb.org/t/p/w500/${elem.poster_path}`} alt="" />}
            {hoveredMovie && hoveredMovie.id === elem.id && (
              <div className='youtube-trailers'>
                <YouTube videoId={hoveredMovie.videoKey} opts={{ playerVars: { controls: 0, autoplay: 1, mute: 1, rel: '0', disablekb: 1 } }} onReady={onReady} />
                <div className="player-controls" onClick={toggleMute}>
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
                  <button className='pause-btn' onClick={playPause}><img style={{ width: "17px" }} src={playing ? pause : playe} alt="" /></button>
                  <button className='add-btn'>+</button>
                  <button className='like-btn'><svg width="1.5em" height="1.5em" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M16.472 20H4.1a.6.6 0 01-.6-.6V9.6a.6.6 0 01.6-.6h2.768a2 2 0 001.715-.971l2.71-4.517a1.631 1.631 0 012.961 1.308l-1.022 3.408a.6.6 0 00.574.772h4.575a2 2 0 011.93 2.526l-1.91 7A2 2 0 0116.473 20z" stroke="currentColor" strokeLinecap="round"></path>
                    <path d="M7 20V9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </button>
                </div>
                {videoData && (
                  <div className="description">
                    <h3>{elem.title || elem.name}</h3>
                    <p>
                      <span>69% match </span>
                      {videoData.runtime
                        ? convertToHours(videoData.runtime)
                        : `${videoData.number_of_seasons} Seasons ${videoData.number_of_episodes} episodes`}
                    </p>
                    <p className='genre-list'>
                      {videoData.genres.map((genre, index) => (
                        <React.Fragment key={genre.id}>
                          {genre.name}
                          {index !== videoData.genres.length - 1 && <span id="dot"> . </span>}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                )}


              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default Genres;
