import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GenerateBarcode from '../component/GenerateBarcode';
import { loginUser } from '../handler';

function LoginCustomer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await loginUser(formData);

    if (result.success) {
      navigate('/home');
    } else {
      setErrorMessage(result.error);
      setShowAlert(true);
    }

    setIsLoading(false);
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

          <button
            type="submit"
            className="w-full bg-[#3C6255] text-white py-4 rounded-full text-lg font-medium hover:bg-[#3C6255]/90"
          >
            LOGIN
          </button>
        </form>
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

export default LoginCustomer