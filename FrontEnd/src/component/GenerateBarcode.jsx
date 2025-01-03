import React, { useRef, useState } from 'react';
import JsBarcode from 'jsbarcode';

const GenerateBarcode = () => {
    const barcodeRef = useRef(null);
    const [currentValue, setCurrentValue] = useState('');

    const generateBarcodeValue = () => {
        const cityCode = 'SUR';
        
        let randomNum = '';
        for (let i = 0; i < 10; i++) {
            randomNum += Math.floor(Math.random() * 10);
        }

        return `${cityCode}${randomNum}`;
    };

    const generateBarcode = (value) => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, value, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10
            });
        }
    };

    const handleGenerate = () => {
        const barcodeValue = generateBarcodeValue();
        setCurrentValue(barcodeValue);
        generateBarcode(barcodeValue);
    };

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-2xl font-bold">Generate Barcode</h1>
            <button 
                className="px-4 py-2 bg-[#3C6255] text-white rounded hover:bg-[#3C6255]/90"
                onClick={handleGenerate}
            >
                Generate Barcode
            </button>
            {currentValue && (
                <p className="text-gray-600">Current Value: {currentValue}</p>
            )}
            <svg ref={barcodeRef}></svg>
        </div>
    );
};

export default GenerateBarcode;
