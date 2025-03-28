import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Components/Home'

import Login from '../Components/login'
import SignUp from '../Components/signUp'
import PrivateRoute from './privateRoute'
import VideosUpload from '../Components/videosUpload'
import GetVideos from '../Components/getVideos'


const AllRoutes = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/signup' element={<SignUp/>}/>
            <Route path='/signin' element={<Login/>}/>
            <Route path='/videos' element={<PrivateRoute><GetVideos/></PrivateRoute>}/>
            
        </Routes>
    </div>
  )
}

export default AllRoutes