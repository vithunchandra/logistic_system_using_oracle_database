import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getShipment, getTrackings } from '../../../handler';

function Tracking() {
  const { trackingNumber } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [shipmentData, setShipmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      try {
        const response = await getTrackings(trackingNumber);
        if (response && response.data) {
          const formattedData = {
            tracking_number: trackingNumber,
            tracks: Array.isArray(response.data.tracks) 
              ? response.data.tracks 
              : [response.data.tracks]
          };
          setTrackingData(formattedData);
        } else {
          setError('Tracking data not found');
        }
      } catch (err) {
        setError('Failed to fetch tracking data');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchShipmentData = async () => {
      try{
        const response = await getShipment(trackingNumber);
        if (response && response.data) {
          setShipmentData(response.data.shipment);
        }
      }catch(err){
        setError('Failed to fetch shipment data');
      }finally {
        setIsLoading(false);
      }
    };

    fetchTrackingData();
    fetchShipmentData();
  }, [trackingNumber, shipmentData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3C6255] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg mx-auto mt-10">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!trackingData) {
    return null;
  }

  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-white relative">
      {/* Header dengan Background Hijau */}
      <div className="bg-[#3C6255] p-6 rounded-b-[30px] relative">
        <div className="text-white">
          <h1 className="text-2xl font-semibold mb-2">Tracking Details</h1>
          <p className="text-sm opacity-80">Track your package location</p>
        </div>
      </div>

      {/* Tracking Content */}
      <div className="px-6 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tracking Number:</span>
              <span className="font-semibold">{trackingData.tracking_number}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Status:</span>
              <span className={`font-semibold px-3 py-1 rounded-full ${
                shipmentData.status === 'Delivered' ? 'bg-green-100 text-green-600' : 
                shipmentData.status === 'In Transit' ? 'bg-blue-100 text-blue-600' : 
                'bg-yellow-100 text-yellow-600'
              }`}>
                {shipmentData.status}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-6">Tracking History</h2>
          <div className="space-y-6">
            {trackingData.tracks.map((item, index) => (
              <div key={index} className="flex items-start">
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-[#3C6255] border-4 border-[#3C6255]/20"></div>
                  {index !== trackingData.tracks.length - 1 && (
                    <div className="absolute top-4 left-2 -ml-[1px] w-[2px] h-full bg-gray-200"></div>
                  )}
                </div>
                <div className="ml-6 pb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-[#3C6255]">{item.message}</p>
                    <p className="text-sm text-gray-600 mt-1">{item.location || '-'}</p>
                    <p className="text-xs text-gray-400 mt-2">{item.timestamp || '-'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;