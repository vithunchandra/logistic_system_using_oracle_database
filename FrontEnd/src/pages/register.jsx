import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi password
    if (formData.password !== formData.confirmPassword) {
      alert('Password tidak cocok!');
      return;
    }
    // TODO: Implement registration logic here
    console.log('Form submitted:', formData);
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
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="nama"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email"
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

          <div>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="konfirmasi password"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="lokasi"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="nomor telepon"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3C6255] text-white py-4 rounded-full text-lg font-medium hover:bg-[#3C6255]/90"
          >
            REGISTER
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-600">Sudah punya akun? </span>
          <Link to="/login" className="text-[#3C6255]">
            login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Register