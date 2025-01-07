import axios from 'axios';

const url_api = `http://localhost:3000/api/v1`;

// Register User
async function registerUser(formData) {
    try {
        const response = await axios.post(`${url_api}/user/auth/signup`, formData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Terjadi kesalahan saat registrasi'
        };
    }
}

// Login User
async function loginUser(formData) {
    try {
        const response = await axios.post(`${url_api}/user/auth/signin`, formData);
        
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Email atau password salah'
        };
    }
}

// Login Staff
async function loginStaff(formData) {
    try {
        const response = await axios.post(`${url_api}/staff/login`, formData);
        
        if (response.data.token) {
            localStorage.setItem('staffToken', response.data.token);
            localStorage.setItem('staffData', JSON.stringify(response.data.staff));
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Email atau password salah'
        };
    }
}

// Logout User
async function logoutUser() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal logout'
        };
    }
}

// Logout Staff
async function logoutStaff() {
    try {
        localStorage.removeItem('staffToken');
        localStorage.removeItem('staffData');
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal logout'
        };
    }
}

// Check Auth Status
function isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
}

// Check Staff Auth Status
function isStaffAuthenticated() {
    const staffToken = localStorage.getItem('staffToken');
    return !!staffToken;
}

// Get User Data
function getUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
}

// Get Staff Data
function getStaffData() {
    const staffData = localStorage.getItem('staffData');
    return staffData ? JSON.parse(staffData) : null;
}

// Create Shipment
async function createShipment(formData) {
    try {
        const staffToken = localStorage.getItem('staffToken');
        const response = await axios.post(
            `${url_api}/shipment-queue/create`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${staffToken}`
                }
            }
        );
        
        return {
            success: true,
            data: {
                id: response.data.shipment.id,
                transit: response.data.shipment.transit
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Terjadi kesalahan saat membuat shipment'
        };
    }
}

// Create Courier
async function createCourier(formData) {
    try {
        const staffToken = localStorage.getItem('staffToken');
        const response = await axios.post(
            `${url_api}/courier/create`, 
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${staffToken}`
                }
            }
        );
        
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Terjadi kesalahan saat membuat courier'
        };
    }
}

// Login Courier
async function loginCourier(formData) {
    try {
        const response = await axios.post(`${url_api}/courier/login`, formData);
        
        if (response.data.token) {
            localStorage.setItem('courierToken', response.data.token);
            localStorage.setItem('courierData', JSON.stringify(response.data.courier));
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Email atau password salah'
        };
    }
}

// Logout Courier
async function logoutCourier() {
    try {
        localStorage.removeItem('courierToken');
        localStorage.removeItem('courierData');
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            error: 'Gagal logout'
        };
    }
}

// Check Courier Auth Status
function isCourierAuthenticated() {
    const courierToken = localStorage.getItem('courierToken');
    return !!courierToken;
}

// Get Courier Data
function getCourierData() {
    const courierData = localStorage.getItem('courierData');
    return courierData ? JSON.parse(courierData) : null;
}

// Create Branch
async function createBranch(formData) {
    try {
        const staffToken = localStorage.getItem('staffToken');
        const response = await axios.post(
            `${url_api}/branch/create`, 
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${staffToken}`
                }
            }
        );
        
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Terjadi kesalahan saat membuat branch'
        };
    }
}

// Get All Users
async function getAllUsers() {
    try {
        const staffToken = localStorage.getItem('staffToken');
        const response = await axios.get(
            `${url_api}/user/`,
            {
                headers: {
                    'Authorization': `Bearer ${staffToken}`
                }
            }
        );
        
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Gagal mengambil data user'
        };
    }
}

// Get Shipment Transit
async function getShipmentTransit(shipmentId) {
    try {
        const staffToken = localStorage.getItem('staffToken');
        const response = await axios.get(
            `${url_api}/shipment-transit/?shipment_id=${shipmentId}`,
            {
                headers: {
                    'Authorization': `Bearer ${staffToken}`
                }
            }
        );
        
        return {
            success: true,
            data: response.data.transit[0] // Mengambil transit pertama
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Gagal mengambil data transit'
        };
    }
}

// Finish Transit
async function finishTransit(transitId) {
    try {
        const staffToken = localStorage.getItem('staffToken');
        console.log('Sending request to:', `${url_api}/shipment-transit/finish/${transitId}`); // Debug URL
        console.log('Using token:', staffToken); // Debug token

        const response = await axios({
            method: 'PUT', // Ubah ke PUT karena ini update status
            url: `${url_api}/shipment-transit/finish/${transitId}`,
            headers: {
                'Authorization': `Bearer ${staffToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response:', response.data); // Debug response

        if (response.data.error) {
            return {
                success: false,
                error: response.data.error
            };
        }

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Finish Transit Error:', error.response || error); // Debug error
        
        if (error.response?.status === 403) {
            return {
                success: false,
                error: 'Anda tidak memiliki akses untuk menyelesaikan transit di cabang ini'
            };
        }
        
        return {
            success: false,
            error: error.response?.data?.message || 'Gagal menyelesaikan transit'
        };
    }
}

// Get All Courier Queue
async function getAllCourierQueue() {
    try {
        const courierToken = localStorage.getItem('courierToken');
        const response = await axios.get(
            `${url_api}/courier-queue/`,
            {
                headers: {
                    'Authorization': `Bearer ${courierToken}`
                }
            }
        );
        
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Gagal mengambil data paket'
        };
    }
}

// Assign Package
async function assignPackage(queueId) {
    try {
        const courierToken = localStorage.getItem('courierToken');
        console.log('Assigning package with ID:', queueId); // Debug
        console.log('Using token:', courierToken); // Debug

        const response = await axios({
            method: 'PUT', // Ubah ke PUT method
            url: `${url_api}/courier-queue/assign/${queueId}`,
            headers: {
                'Authorization': `Bearer ${courierToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Assign Response:', response.data); // Debug

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error assigning package:', error.response || error);
        
        // Tampilkan pesan error yang lebih spesifik
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           'Gagal mengambil paket';
                           
        return {
            success: false,
            error: errorMessage
        };
    }
}

// Get Courier Deliveries
async function getCourierDeliveries() {
    try {
        const courierToken = localStorage.getItem('courierToken');
        console.log('Using token:', courierToken); // Debug

        const response = await axios.get(
            `${url_api}/courier-queue/`,
            {
                headers: {
                    'Authorization': `Bearer ${courierToken}`
                }
            }
        );
        
        console.log('API Response:', response.data); // Debug

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error fetching deliveries:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Gagal mengambil data pengiriman'
        };
    }
}

// Finish Delivery
async function finishDelivery(queueId) {
    try {
        const courierToken = localStorage.getItem('courierToken');
        console.log('Finishing delivery:', queueId); // Debug

        const response = await axios({
            method: 'PUT',
            url: `${url_api}/courier-queue/finish/${queueId}`,
            headers: {
                'Authorization': `Bearer ${courierToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Finish Response:', response.data); // Debug

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error('Error finishing delivery:', error);
        return {
            success: false,
            error: error.response?.data?.message || 'Gagal menyelesaikan pengiriman'
        };
    }
}

export {
    registerUser,
    loginUser,
    loginStaff,
    logoutUser,
    logoutStaff,
    isAuthenticated,
    isStaffAuthenticated,
    getUserData,
    getStaffData,
    createShipment,
    createCourier,
    loginCourier,
    logoutCourier,
    isCourierAuthenticated,
    getCourierData,
    createBranch,
    getAllUsers,
    getShipmentTransit,
    finishTransit,
    getAllCourierQueue,
    assignPackage,
    getCourierDeliveries,
    finishDelivery
};