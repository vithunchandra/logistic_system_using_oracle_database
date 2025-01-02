import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function BarcodeScanner({ onClose, onScanSuccess }) {
  const [scanning, setScanning] = useState(true);

  const handleUpdate = (err, result) => {
    if (result) {
      onScanSuccess(result.text);
      setScanning(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-[90%] max-w-md overflow-hidden">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Barcode Scanner</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              ✕
            </button>
          </div>
          
          <div className="relative">
            {scanning && (
              <BarcodeScannerComponent
                width="100%"
                height={300}
                onUpdate={handleUpdate}
                style={{ borderRadius: '8px' }}
              />
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BarcodeScanner;
