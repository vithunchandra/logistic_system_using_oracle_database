import { createBrowserRouter } from "react-router-dom";

// import handler from "./handler.jsx";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import App from "./App.jsx";


// Customer
import Home from "./pages/customer/Home.jsx"

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

]);

export default router;
