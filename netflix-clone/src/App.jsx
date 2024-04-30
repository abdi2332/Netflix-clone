import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {Route, Routes} from 'react-router-dom'
import Banner from './components/Banner/Banner'
import Movies from './components/Movies/Movies'
import Tvshow from './components/TvShows/Tvshow'
const App = () => {
  return (
    <>
       <Navbar />
       <Routes>
        <Route path='/' element={<Banner/>}/>
        <Route path='/Movies' element={<Movies/>}/>
        <Route path='/Tvshows' element={<Tvshow/>}/>
       </Routes>
       </>
   
  )
}

export default App
