import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function SettingCourier() {
  const navigate = useNavigate();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const handleLogout = () => {
    setShowLogoutAlert(true);
  };

  const confirmLogout = () => {
    navigate('/login-courier');
  };

  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-white relative">
      {/* Header with Back Button */}
      <div className="bg-[#3C6255] p-6 rounded-b-[30px] relative">
        <div className="flex items-center gap-4 mb-4">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/home-staff')}
            className="absolute left-4 top-6 text-white p-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 19.5L8.25 12l7.5-7.5" 
              />
            </svg>
          </button>

          {/* Title Section */}
          <div className="flex items-center gap-4 ml-8">
            <h2 className="text-white text-xl font-medium">Settings</h2>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="p-6">
        <div className="space-y-4">
          {/* Logout Option */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 w-full"
          >
            <div className="w-6 h-6">
              <img 
                src="/public/icons/logout.svg" 
                alt="Logout" 
                className="w-full h-full"
              />
            </div>
            <span className="text-gray-700">Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Alert */}
      {showLogoutAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar?</p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutAlert(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-[#bf1432] text-white rounded-lg hover:bg-[#720b1d]/90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingCourier;