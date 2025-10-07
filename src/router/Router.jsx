import { createBrowserRouter } from "react-router-dom";
import AsterProfile from "../pages/AsterProfile";
import AsterExplore from "../pages/AsterExplore";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Layout from "../layout/Layout";
import AsterDetail from "../pages/AsterDetail";
import AuthForm from "../components/AuthForm";
import ProtectedRoute from "../store/protectedRoutes";
import AsterForm from "../components/AsterForm";


export const AsterRouter = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
        {
            index: true,
            element: <Home />
        },
        {
            path: "/about",
            element: <ProtectedRoute><AboutUs /></ProtectedRoute>
        },
        {
            path: "/myprofile",
            element: <ProtectedRoute><AsterProfile /></ProtectedRoute>
        },
        {
            path: "/explore",
            element:<ProtectedRoute><AsterExplore /></ProtectedRoute>
        },
        {
            path: "/viewpost/:id",
            element: <AsterDetail />
        },
        {
            path: "/newpost",
            element:<ProtectedRoute><AsterForm /></ProtectedRoute>
        },
        {
            path: "/editpost/:id",
            element: <ProtectedRoute><AsterForm /></ProtectedRoute>
        },
        {
            path: "/contact",
            element: <ProtectedRoute><Contact /></ProtectedRoute>
        },
        /*Rutas para login/register usando el componente de authform */
        {
            path: "/login",
            element: <AuthForm mode="login" />
        },
        {
            path: "/register",
            element: <AuthForm mode="register"/>
        }
    ]
}])

export default AsterRouter;