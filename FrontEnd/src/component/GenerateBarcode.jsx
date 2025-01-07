import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

const GenerateBarcode = ({ value }) => {
    const barcodeRef = useRef(null);

    useEffect(() => {
        if (barcodeRef.current && value) {
            JsBarcode(barcodeRef.current, value, {
                format: "CODE128",
                width: 2,
                height: 100,
                displayValue: true,
                fontSize: 14,
                margin: 10
            });
        }
    }, [value]);

    return (
        <div className="flex flex-col items-center gap-4 p-4">
            <h1 className="text-xl font-semibold">Shipment Receipt</h1>
            <p className="text-gray-600">Tracking Number: {value}</p>
            <svg ref={barcodeRef}></svg>
        </div>
    );
};

export default GenerateBarcode;
