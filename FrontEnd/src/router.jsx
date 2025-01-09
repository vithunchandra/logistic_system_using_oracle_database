import { createBrowserRouter } from "react-router-dom";

// import handler from "./handler.jsx";
import Register from "./pages/register.jsx";
import App from "./App.jsx";

// Login
import LoginStaff from "./pages/login-Staff.jsx";
import LoginCourier from "./pages/login-Courier.jsx";
import LoginCustomer from "./pages/login-Customer.jsx";

// Customer
import Home from "./pages/customer/Home.jsx"
import Profile from "./pages/customer/Profile.jsx";

// staff
import StaffHome from "./pages/staff/Staff-Home.jsx"
import Setting from "./pages/staff/Setting.jsx"
import CreateBranch from "./pages/staff/Menu/Create-branch.jsx";
import Createcourier from "./pages/staff/Menu/Create-courier.jsx"
import CreateShipment from "./pages/staff/Menu/Create-shipment.jsx";

// courier
import Courier_home from "./pages/courier/Courier-home.jsx";
import SettingCourier from "./pages/courier/SettingCourier.jsx";
import PickPackage from "./pages/courier/Menu/Pick-Package.jsx";
import CompleteDelivery from "./pages/courier/Menu/Complete-Delivery.jsx";

import Tracking from './pages/customer/Menu/tracking';




const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login-customer",
        element: <LoginCustomer />,
    },
    {
        path: "/login-staff",
        element: <LoginStaff />,
    },
    {
        path: "/login-courier",
        element: <LoginCourier />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/profile",
        element: <Profile />,
    },
    {
        path: "/home-staff",
        element: <StaffHome />,
    },
    {
        path: "/setting",
        element: <Setting />,
    },
    {
        path: "/setting-courier",
        element: <SettingCourier />,
    },
    {
        path: "/create-branch",
        element: <CreateBranch />,
    },
    {
        path: "/create-courier",
        element: <Createcourier />,
    },
    {
        path: "/create-shipment",
        element: <CreateShipment />,
    },
    {
        path: "/courier_home",
        element: <Courier_home />,
    },
    {
        path: "/pick-package",
        element: <PickPackage />,
    },
    {
        path: "/complete-delivery",
        element: <CompleteDelivery />,
    },
    {
        path: '/tracking/:trackingNumber',
        element: <Tracking />
    },
    

]);

export default router;
