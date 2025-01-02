import React from "react";

function Table({ data, columns }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-4xl p-8 bg-gray-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6 text-[#3C6255]">Data Table</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-[#3C6255] text-white">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="text-left py-4 px-6 text-sm font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    {columns.map((column) => (
                      <td
                        key={column}
                        className="py-4 px-6 text-sm text-gray-700"
                      >
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Table;
