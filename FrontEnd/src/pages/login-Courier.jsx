import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginCourier } from '../handler'

function LoginCourier() {
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

    const result = await loginCourier(formData);

    if (result.success) {
      navigate('/courier_home');
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
              placeholder="username"
              className="w-full p-4 bg-gray-100 rounded-full text-gray-700 focus:outline-none"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-[#3C6255] text-white py-4 rounded-full text-lg font-medium 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#3C6255]/90'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Error Alert */}
        {showAlert && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-red-600">Login Gagal</h3>
              <p className="text-gray-600 mb-6">{errorMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowAlert(false)}
                  className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginCourier