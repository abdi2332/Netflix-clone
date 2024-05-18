import React from 'react'
import Navbar from './components/Navbar/Navbar'
import {Route, Routes} from 'react-router-dom'
import Banner from './components/Banner/Banner'
import Movies from './components/Movies/Movies'
import Tvshow from './components/TvShow/Tvshow'
import List from './components/List/List'
import Genres from './components/Genres/Genres'
const App = () => {
  return (
    <>
       <Navbar />
       <Routes>
        <Route path='/' element={<Banner/>}/>
        <Route path='/Movies' element={<Movies/>}/>
        <Route path='/TvShow' element={<Tvshow/>}/>
        <Route path='/List' element={<List/>}/>
        <Route path="/Genres/:movie/:id/:genreName" element={<Genres />} />
       </Routes>
       </>
   
  )
}

export default App
