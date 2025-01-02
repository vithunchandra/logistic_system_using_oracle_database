import React, { useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

const GenerateBarcode = () => {
    const barcodeRef = useRef(null);
    const [currentValue, setCurrentValue] = useState('');

    const generateRandomValue = () => {
        // Generate random 17-digit number
        let randomNum = '';
        for (let i = 0; i < 17; i++) {
            randomNum += Math.floor(Math.random() * 10);
        }
        return randomNum;
    };

    const generateBarcode = (value) => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, value, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
            });
        }
    };

    const handleGenerate = () => {
        const randomValue = generateRandomValue();
        setCurrentValue(randomValue);
        generateBarcode(randomValue);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-2xl font-bold">Generate Barcode</h1>
            <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleGenerate}
            >
                Generate Random Barcode
            </button>
            {currentValue && (
                <p className="text-gray-600">Current Value: {currentValue}</p>
            )}
            <svg ref={barcodeRef}></svg>
        </div>
    );
};

export default GenerateBarcode;
