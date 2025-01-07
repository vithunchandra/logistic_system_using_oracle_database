import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../handler';

function Register() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Password tidak cocok!');
      setShowErrorAlert(true);
      return;
    }

    setIsLoading(true);
    const result = await registerUser(formData);

    if (result.success) {
      setShowSuccessAlert(true);
      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/login-customer');
      }, 2000);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
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
          <Link to="/login-customer" className="text-[#3C6255]">
            login
          </Link>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-[#3C6255]">Registrasi Berhasil!</h3>
            <p className="text-gray-600 mb-6">
              Akun Anda telah berhasil dibuat. Anda akan diarahkan ke halaman login.
            </p>
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-[#3C6255] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Registrasi Gagal</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorAlert(false)}
                className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && !showSuccessAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}

export default Register