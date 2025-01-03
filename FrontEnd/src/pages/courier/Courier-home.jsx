import { useState } from 'react';
import { Link } from 'react-router-dom';

function Courier_home() {
  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-white relative">
      {/* Header dengan Background Hijau */}
      <div className="bg-[#3C6255] p-6 rounded-b-[30px] relative pb-48">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-white text-sm">Current Location</p>
            <h2 className="text-white text-xl font-semibold">Jomokkerto</h2>
          </div>
          <Link to="/setting">
            <div className="w-10 h-10 bg-white rounded-full overflow-hidden cursor-pointer flex items-center justify-center hover:bg-gray-100">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={1.5} 
                stroke="#3C6255" 
                className="w-6 h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" 
                />
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
            </div>
          </Link>
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
        <h2 className="text-xl font-semibold mb-4">What would you like to do?</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Pick Package Card */}
          <Link to="/pick-package">
            <div className="bg-white p-4 rounded-xl shadow transition-colors duration-300 hover:bg-[#3C6255] hover:text-white group">
              <div className="bg-[#F2B555] w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <img src="/public/icons/box.svg" alt="Pick Package" className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Pick Package</h3>
              <p className="text-gray-400 group-hover:text-gray-200 text-sm">Choose packages to deliver</p>
            </div>
          </Link>

          {/* Complete Delivery Card */}
          <Link to="/complete-delivery">
            <div className="bg-white p-4 rounded-xl shadow transition-colors duration-300 hover:bg-[#3C6255] hover:text-white group">
              <div className="bg-[#F2B555] w-10 h-10 rounded-full flex items-center justify-center mb-4">
                <img src="/public/icons/check.svg" alt="Complete" className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Complete Delivery</h3>
              <p className="text-gray-400 group-hover:text-gray-200 text-sm">Finish your deliveries</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Courier_home;
