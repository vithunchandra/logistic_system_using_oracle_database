import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import GenerateBarcode from '../component/GenerateBarcode';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-[390px] h-screen p-8 flex flex-col items-center">
        <img 
          src="public/images/supermarket.png" 
          alt="Super Market Logo" 
          className="w-100 mb-16 mt-16"
        />
        
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="username"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3C6255] text-white py-4 rounded-full text-lg font-medium hover:bg-[#3C6255]/90"
          >
            LOGIN
          </button>
        </form>

        <Link to="/home" className="text-[#3C6255]">
         jalur langit
        </Link>

        <Link to="/home-staff" className="text-[#3C6255]">
         jalur langit 2
        </Link>

        <Link to="/courier_home" className="text-[#3C6255]">
         jalur langit 3
        </Link>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Belum punya akun? </span>
          <Link to="/register" className="text-[#3C6255]">
            daftar sekarang
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login