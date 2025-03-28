import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [userName, setUserName] = useState("");
      const [password, setPassword] = useState("");
      const navigate=useNavigate("")
      
    
      const handleSubmit = async () => {
        try {
          const res = await axios.post(
            "https://video-management-back.onrender.com/auth/login",
            { userName, password }
          );
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            toast.success("Login Successful! 🎉"||res.data.msg, { position: "top-right" });
            navigate("/")
          }

        } catch (error) {
          console.error("Error:", error.response ? error.response.data : error.message);
        }
      };
  return (
    <>
     <div className="flex justify-center items-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="bg-white shadow-lg rounded-lg p-8 w-96">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
              Create an Account
            </h2>
            
            <input
              type="text"
              placeholder="Enter username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
    
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
    
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Sign in
            </button>
    
            <p className="text-center text-gray-600 mt-4">
             Create new account?{" "}
              <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

    </>
  )
}

export default Login