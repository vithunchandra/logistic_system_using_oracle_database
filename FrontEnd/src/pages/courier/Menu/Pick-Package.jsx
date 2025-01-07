import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCourierQueue, assignPackage } from '../../../handler';

function PickPackage() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('courierToken');
    if (!token) {
      navigate('/login-courier');
      return;
    }
    loadPackages();
  }, [navigate]);

  const loadPackages = async () => {
    setIsLoading(true);
    const result = await getAllCourierQueue();
    console.log('API Response:', result); // Debug
    if (result.success) {
      const packagesArray = Array.isArray(result.data) ? result.data : 
                          result.data.courierQueues ? result.data.courierQueues : [];
      setPackages(packagesArray);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
    }
    setIsLoading(false);
  };

  const handleAssignPackage = async (queueId) => {
    setIsLoading(true);
    const result = await assignPackage(queueId);
    if (result.success) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        navigate('/courier_home');
      }, 2000);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
    }
    setIsLoading(false);
  };

  const filteredPackages = Array.isArray(packages) ? packages.filter(pkg => 
    selectedStatus === 'all' || pkg.status === selectedStatus
  ) : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full max-w-[450px] mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}
        <div className="bg-[#3C6255] p-6 rounded-b-[30px]">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/courier_home')}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </button>
            <h2 className="text-2xl font-semibold text-white">Pick Package</h2>
            <div className="w-6"></div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-transparent outline-none text-gray-700"
            >
              <option value="all">All Packages</option>
              <option value="Delivery">Delivery</option>
              <option value="Pending">Pending</option>
              <option value="Arrived">Arrived</option>
            </select>
          </div>
        </div>

        {/* Package List */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-[#3C6255] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{pkg.item_name}</h3>
                    <p className="text-sm text-gray-500">ID: {pkg.id}</p>
                  </div>
                  <button
                    onClick={() => handleAssignPackage(pkg.id)}
                    className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90 transition-colors"
                    disabled={isLoading}
                  >
                    Pick Up
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">Branch:</p>
                    <p>{pkg.branch}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Owner:</p>
                    <p>{pkg.owner}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Receiver:</p>
                    <p>{pkg.receiver}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Status:</p>
                    <p>{pkg.status}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-700">Address:</p>
                    <p>{pkg.address}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No packages available</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Success!</h3>
            <p className="text-gray-600">Package has been assigned to you.</p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Error</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorAlert(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PickPackage;