import { useState } from 'react';
import BarcodeScanner from '../../../component/BarcodeScanner';
import { finishTransit } from '../../../handler';

function FinishTransit({ isOpen, onClose }) {
  const [showScanner, setShowScanner] = useState(false);
  const [transitId, setTransitId] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transitInfo, setTransitInfo] = useState(null);

  const handleScanSuccess = async (result) => {
    setTransitId(result);
    setShowScanner(false);
    handleFinishTransit(result);
  };

  const handleFinishTransit = async (id) => {
    setIsLoading(true);
    const result = await finishTransit(id);
    setIsLoading(false);

    if (result.success) {
      setTransitInfo(result.data.transit);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        onClose();
      }, 2000);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFinishTransit(transitId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-6">Finish Transit</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={transitId}
              onChange={(e) => setTransitId(e.target.value)}
              placeholder="Input Transit ID"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
            />
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="bg-[#3C6255] p-3 rounded-lg text-white hover:bg-[#3C6255]/90"
            >
              <img src="/public/icons/photo-camera.svg" alt="Scan" className="w-6 h-6" />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#3C6255] py-3 rounded-lg text-white hover:bg-[#3C6255]/90 disabled:opacity-50"
            disabled={isLoading || !transitId}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              'Finish Transit'
            )}
          </button>
        </form>
      </div>

      {showScanner && (
        <BarcodeScanner
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-green-600">Success!</h3>
            <p className="text-gray-600 mb-2">
              Barang telah sampai di {transitInfo?.previous_branch || 'cabang ini'}.
            </p>
            {transitInfo?.next_branch && transitInfo.next_branch !== transitInfo.previous_branch && (
              <p className="text-sm text-gray-500">
                Tujuan selanjutnya: {transitInfo.next_branch}
              </p>
            )}
          </div>
        </div>
      )}

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
