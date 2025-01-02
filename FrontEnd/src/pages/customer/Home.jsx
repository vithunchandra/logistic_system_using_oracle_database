import { useState } from 'react';
import { Link } from 'react-router-dom';
import BarcodeScanner from '../../component/BarcodeScanner';

function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleScanSuccess = (result) => {
    setTrackingNumber(result);
  };

  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-white relative">
      {/* Header dengan Background Hijau */}
      <div className="bg-[#3C6255] p-6 rounded-b-[30px] relative pb-48">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-white text-sm">Current Location</p>
            <h2 className="text-white text-xl font-semibold">Jomokkerto</h2>
          </div>
          <Link to="/profile">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden cursor-pointer">
              <img 
                src="/public/images/cihuy.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>

        <div className="text-white mb-6">
          <h1 className="text-2xl font-semibold mb-2">Tracking Your Package</h1>
          <p className="text-sm">Please enter your tracking number</p>
        </div>

        {/* Search Bar */}
        <div className="flex bg-white rounded-full p-2 items-center">
          <span 
            className="p-2 cursor-pointer"
            onClick={() => setShowScanner(true)}
          >
            <img src="/public/icons/photo-camera.svg" alt="scan" className="w-6 h-6" />
          </span>
          <input
            type="text"
            placeholder="enter your tracking number"
            className="flex-1 outline-none px-2 text-gray-600"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <button className="bg-[#F2B555] text-white px-6 py-2 rounded-full">
            Track
          </button>
        </div>

        {/* Background Illustration */}
        <div className="absolute bottom-0 left-0 right-0 h-40">
          <img 
            src="/public/images/city.png" 
            alt="City" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="px-6 mt-8">
        <h2 className="text-xl font-semibold mb-2">What are you looking for ?</h2>
        <p className="text-gray-400 mb-6">here we have best features</p>

        <div className="grid grid-cols-2 gap-4">
          {/* Pickup Card */}
          <div className="bg-white p-4 rounded-xl shadow transition-colors duration-300 hover:bg-[#3C6255] hover:text-white group">
            <div className="bg-[#F2B555] w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <img src="/public/icons/curier-svgrepo-com.svg" alt="Pickup" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Pickup</h3>
            <p className="text-gray-400 group-hover:text-gray-200 text-sm">Not yet sent</p>
          </div>

          {/* Delivery Card */}
          <div className="bg-white p-4 rounded-xl shadow transition-colors duration-300 hover:bg-[#3C6255] hover:text-white group">
            <div className="bg-[#F2B555] w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <img src="/public/icons/box.svg" alt="Delivery" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">Delivery</h3>
            <p className="text-gray-400 group-hover:text-gray-200 text-sm">Not yet sent</p>
          </div>

          {/* Additional Cards */}
          <div className="bg-white p-4 rounded-xl shadow transition-colors duration-300 hover:bg-[#3C6255] hover:text-white group">
            <div className="bg-[#F2B555] w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <img src="/public/icons/list.svg" alt="Delivery" className="w-6 h-6" />
            </div>
            <h3 className="font-semibold">History</h3>
            <p className="text-gray-400 group-hover:text-gray-200 text-sm">View all your history</p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow transition-colors duration-300 hover:bg-[#3C6255] hover:text-white group">
            <div className="bg-[#F2B555] w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <img src="/box-icon.png" alt="Box" className="w-6 h-6" />
            </div>
          </div>
        </div>
        {/* Barcode Scanner Modal */}
        {showScanner && (
            <BarcodeScanner
            onClose={() => setShowScanner(false)}
            onScanSuccess={handleScanSuccess}
            />
        )}
      </div>
    </div>
  )
}

export default Home
