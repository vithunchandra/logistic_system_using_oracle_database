import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-8">
      <div className="w-full max-w-[390px] flex flex-col items-center flex-grow">
        {/* Header Section */}
        <div className="text-center mt-16 mb-4">
          <h1 className="text-[28px] font-light text-gray-800 mb-2">
            Fast Delivery MOSA
          </h1>
          <p className="text-[#D3D3D3] text-lg">
            we turn your retail pickup<br />
            order even faster
          </p>
        </div>

        {/* Illustration */}
        <div className="flex-grow flex items-center justify-center my-8">
          <img 
            src="public/images/Home.png" 
            alt="Delivery Illustration" 
            className="w-full max-w-[300px]"
          />
        </div>

        {/* Button Section */}
        <div className="w-full mb-8">
          <Link 
            to="/login-customer" 
            className="block w-full bg-[#3C6255] text-white py-4 px-8 rounded-full text-center text-lg font-medium hover:bg-[#3C6255]/90"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}

export default App
