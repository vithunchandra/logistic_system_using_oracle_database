import { createBrowserRouter } from "react-router-dom";

// import handler from "./handler.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import App from "./App.jsx";

// Customer
import Home from "./pages/customer/Home.jsx"
import Profile from "./pages/customer/Profile.jsx";
import Delivery from "./pages/customer/Menu/Delivery.jsx";

// staff
import StaffHome from "./pages/staff/Staff-Home.jsx"
import Setting from "./pages/staff/Setting.jsx"
import CreateBranch from "./pages/staff/Menu/Create-branch.jsx";
import Createcourier from "./pages/staff/Menu/Create-courier.jsx"
import CreateShipment from "./pages/staff/Menu/Create-shipment.jsx";

// courier
import Courier_home from "./pages/courier/Courier-home.jsx";




const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/login",
        element: <Login />,
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
        path: "/delivery",
        element: <Delivery />,
    },

    

]);

export default router;
