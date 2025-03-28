import axios from 'axios';
import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';

import GetVideos from './getVideos';
import VideosUpload from './videosUpload';


const Home = () => {
    const token = localStorage.getItem("token");
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token"); 
            if (!token) {
                toast.error("No token found. Please log in first.", { position: "top-right" });
                return;
            }
    
            const res = await axios.post(
                "https://video-management-back.onrender.com/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
    
            // Remove token after successful logout
            localStorage.removeItem("token"); 
            toast.success(res.data.msg || "Logout Successful! 🎉", { position: "top-right" });
    
            // Optionally, redirect to login or home page
            window.location.href = "/signin";
    
        } catch (error) {
            console.error("Logout Error:", error.response ? error.response.data : error.message);
            toast.error("Logout failed. Please try again.", { position: "top-right" });
        }
    };
    
    
  return (
    <>
   
      <div className='flex justify-between  items-center bg-purple-600 p-4 text-white px-28'> 
        <div className='flex items-center'>
          <img className='w-10' src="https://images.scalebranding.com/letter-s-logo-39e9ee57-e28f-47ea-9085-9352cfc621dc.jpg" alt="logo" />
          <p className='ml-2 text-xl font-semibold'>Sierra</p>
        </div>
        <div>
        {token?<button onClick={handleLogout}>Logout</button>:          <Link to="/signup" className='text-white font-medium hover:underline'>Sign up</Link>
        }
        </div>       
        
      </div>
      <VideosUpload/>
     <GetVideos/>
    </>
  )
}

export default Home;
