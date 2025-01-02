import { createBrowserRouter } from "react-router-dom";

// import handler from "./handler.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import App from "./App.jsx";


// Customer
import Home from "./pages/customer/Home.jsx"
import Profile from "./pages/customer/Profile.jsx";

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

]);

export default router;
