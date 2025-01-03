import { useState } from 'react';
import BarcodeScanner from '../../../component/BarcodeScanner';

function FinishTransit({ isOpen, onClose }) {
  const [showScanner, setShowScanner] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [showConfirmAlert, setShowConfirmAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleScanSuccess = (result) => {
    setTrackingId(result);
    setShowScanner(false);
  };

  const handleSubmit = () => {
    if (trackingId.trim()) {
      setShowConfirmAlert(true);
    } else {
      setShowErrorAlert(true);
    }
  };

  const handleConfirmFinish = () => {
    console.log('Finishing transit for:', trackingId);
    setShowConfirmAlert(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* Main Popup */}
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
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
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-6">Finish Transit</h2>

        {/* Tracking ID Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="Enter Tracking ID"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
          />
          <button
            onClick={() => setShowScanner(true)}
            className="bg-[#3C6255] p-3 rounded-lg text-white hover:bg-[#3C6255]/90"
          >
            <img src="/public/icons/photo-camera.svg" alt="Scan" className="w-6 h-6" />
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#3C6255] text-white py-3 rounded-lg hover:bg-[#3C6255]/90"
        >
          Finish Transit
        </button>
      </div>

      {/* Barcode Scanner */}
      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {/* Confirmation Alert */}
      {showConfirmAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi</h3>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin mengakhiri transit untuk resi {trackingId}?</p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowConfirmAlert(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmFinish}
                className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
              >
                Ya, Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Error</h3>
            <p className="text-gray-600 mb-6">Tracking ID tidak ditemukan. Silakan periksa kembali.</p>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorAlert(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinishTransit;
