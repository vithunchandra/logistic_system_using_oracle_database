import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourierDeliveries, finishDelivery } from '../../../handler';

function CompleteDelivery() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('Delivering');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('courierToken');
    if (!token) {
      navigate('/login-courier');
      return;
    }
    loadDeliveries();
  }, [navigate]);

  const loadDeliveries = async () => {
    setIsLoading(true);
    const result = await getCourierDeliveries();
    console.log('API Response:', result); // Debug
    if (result.success) {
      const deliveriesArray = Array.isArray(result.data) ? result.data : 
                            result.data.courierQueues ? result.data.courierQueues : [];
      setDeliveries(deliveriesArray);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
    }
    setIsLoading(false);
  };

  const handleFinishDelivery = async (queueId) => {
    setIsLoading(true);
    const result = await finishDelivery(queueId);
    if (result.success) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        loadDeliveries(); // Refresh list after completion
      }, 2000);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
    }
    setIsLoading(false);
  };

  const filteredDeliveries = deliveries.filter(delivery => 
    delivery.status === selectedStatus
  );

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
            <h2 className="text-2xl font-semibold text-white">Complete Delivery</h2>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Delivery List */}
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-[#3C6255] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredDeliveries.length > 0 ? (
            filteredDeliveries.map((delivery) => (
              <div 
                key={delivery.id}
                className="bg-white rounded-lg p-4 shadow-md border border-gray-100"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{delivery.item_name}</h3>
                    <p className="text-sm text-gray-500">ID: {delivery.id}</p>
                  </div>
                  <button
                    onClick={() => handleFinishDelivery(delivery.id)}
                    className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90 transition-colors"
                    disabled={isLoading}
                  >
                    Complete
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">Branch:</p>
                    <p>{delivery.branch}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Owner:</p>
                    <p>{delivery.owner}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Receiver:</p>
                    <p>{delivery.receiver}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Status:</p>
                    <p>{delivery.status}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium text-gray-700">Address:</p>
                    <p>{delivery.address}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No deliveries in progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Success!</h3>
            <p className="text-gray-600">Delivery has been completed.</p>
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

export default CompleteDelivery;
