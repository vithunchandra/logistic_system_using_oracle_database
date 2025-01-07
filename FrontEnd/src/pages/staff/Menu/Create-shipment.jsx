import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createShipment, getAllUsers } from '../../../handler';
import GenerateBarcode from '../../../component/GenerateBarcode';

function CreateShipment() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    owner_id: '',
    receiver_name: '',
    origin_branch: '',
    destination_branch: '',
    item_name: '',
    weight: '',
    address: '',
    gross_amount: ''
  });
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [shipmentId, setShipmentId] = useState('');
  const [transitData, setTransitData] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    const result = await getAllUsers();
    if (result.success) {
      const userData = result.data?.users || [];
      setUsers(userData);
    } else {
      setErrorMessage('Gagal memuat data user');
      setShowErrorAlert(true);
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      owner_id: user.id
    });
    setShowUserModal(false);
    setSearchTerm('');
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm)
  ) : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowAlert(true);
  };

  const confirmSubmit = async () => {
    setIsLoading(true);
    const result = await createShipment(formData);

    if (result.success) {
      const newShipmentId = result.data.id;
      const transitIds = result.data.transit?.map(transit => ({
        id: transit.id,
        next_branch: transit.next_branch
      }));
      setShipmentId(newShipmentId);
      setTransitData(transitIds);
      setShowBarcodeModal(true);
      setShowAlert(false);
    } else {
      setErrorMessage(result.error);
      setShowErrorAlert(true);
      setShowAlert(false);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-[450px] min-h-screen mx-auto bg-white relative">
      {/* Header */}
      <div className="bg-[#3C6255] p-6 rounded-b-[30px] relative">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => navigate('/home-staff')}
            className="absolute left-4 top-6 text-white p-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-6 h-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M15.75 19.5L8.25 12l7.5-7.5" 
              />
            </svg>
          </button>
          <div className="flex items-center gap-4 ml-8">
            <h2 className="text-white text-xl font-medium">Create Shipment</h2>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Selection Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowUserModal(true)}
              className="w-full p-4 bg-gray-50 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-[#3C6255] flex justify-between items-center"
            >
              {selectedUser ? (
                <div className="flex flex-col">
                  <span className="font-medium">{selectedUser.name}</span>
                  <span className="text-sm text-gray-500">{selectedUser.id}</span>
                </div>
              ) : (
                <span className="text-gray-500">Select User</span>
              )}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
          </div>

          {/* Other form fields */}
          <div>
            <input
              type="text"
              name="receiver_name"
              value={formData.receiver_name}
              onChange={handleChange}
              placeholder="Receiver Name"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="origin_branch"
              value={formData.origin_branch}
              onChange={handleChange}
              placeholder="Origin Branch"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="destination_branch"
              value={formData.destination_branch}
              onChange={handleChange}
              placeholder="Destination Branch"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="Item Name"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight (kg)"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255] min-h-[100px]"
              required
            />
          </div>

          <div>
            <input
              type="number"
              name="gross_amount"
              value={formData.gross_amount}
              onChange={handleChange}
              placeholder="Gross Amount"
              className="w-full p-4 bg-gray-50 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3C6255] text-white py-4 rounded-xl hover:bg-[#3C6255]/90 transition-colors disabled:opacity-50"
            disabled={isLoading || !selectedUser}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </div>
            ) : (
              'Create Shipment'
            )}
          </button>
        </form>
      </div>

      {/* User Selection Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select User</h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
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
            </div>

            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleUserSearch}
                placeholder="Search users..."
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C6255]"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex justify-center items-center py-4">
                  <div className="w-6 h-6 border-2 border-[#3C6255] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => selectUser(user)}
                      className="w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-sm text-gray-500">{user.id}</span>
                        <span className="text-sm text-gray-500">{user.email}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">
                  {searchTerm ? 'No users found' : 'No users available'}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {showErrorAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4 text-red-600">Gagal Membuat Shipment</h3>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowErrorAlert(false)}
                className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[80%] max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Data</h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-600">Owner: {selectedUser?.name} ({formData.owner_id})</p>
              <p className="text-gray-600">Receiver: {formData.receiver_name}</p>
              <p className="text-gray-600">Origin: {formData.origin_branch}</p>
              <p className="text-gray-600">Destination: {formData.destination_branch}</p>
              <p className="text-gray-600">Item: {formData.item_name}</p>
              <p className="text-gray-600">Weight: {formData.weight} kg</p>
              <p className="text-gray-600">Address: {formData.address}</p>
              <p className="text-gray-600">Amount: Rp {parseInt(formData.gross_amount).toLocaleString()}</p>
            </div>
            <p className="text-gray-600 mb-6">Apakah data yang dimasukkan sudah benar?</p>
            
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAlert(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                disabled={isLoading}
              >
                Edit
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Shipment Created Successfully!</h3>
              <button
                onClick={() => {
                  setShowBarcodeModal(false);
                  navigate('/home-staff', { 
                    state: { 
                      successMessage: 'Shipment berhasil dibuat!' 
                    }
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
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
            </div>

            <GenerateBarcode value={shipmentId} />

            {/* Transit Information */}
            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold mb-2">Transit Information:</h4>
              <div className="space-y-2">
                {transitData?.map((transit, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Scan at: {transit.next_branch}</span>
                      <span className="text-sm text-gray-500">Transit {index + 1}</span>
                    </div>
                    <div className="text-sm text-gray-600">ID: {transit.id}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowBarcodeModal(false);
                  navigate('/home-staff', { 
                    state: { 
                      successMessage: 'Shipment berhasil dibuat!' 
                    }
                  });
                }}
                className="px-4 py-2 bg-[#3C6255] text-white rounded-lg hover:bg-[#3C6255]/90"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateShipment;
