import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateBranch() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
  };

  const confirmSubmit = () => {
    // Implementasi logic submit data ke API
    console.log('Data submitted:', formData);
    navigate('/home-staff');
  };

  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-white relative">
      {/* Header dengan Background Hijau */}
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
            <h2 className="text-white text-xl font-medium">Create Branch</h2>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="number"
              name="id"
              min="0"
              value={formData.id}
              onChange={handleChange}
              placeholder="ID"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Branch Name"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3C6255] text-white py-4 rounded-xl hover:bg-[#3C6255]/90 transition-colors"
          >
            Create Branch
          </button>
        </form>
      </div>

      {/* Confirmation Alert */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Data</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-600">ID: {formData.id}</p>
              <p className="text-gray-600">Name: {formData.name}</p>
              <p className="text-gray-600">Location: {formData.location}</p>
            </div>
            <p className="text-gray-600 mb-6">Apakah data yang dimasukkan sudah benar?</p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Edit
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateBranch;
