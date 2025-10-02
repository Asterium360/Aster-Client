import { createBrowserRouter } from "react-router-dom";
import AsterPost from "../pages/AsterPost";
import AsterProfile from "../pages/AsterProfile";
import AsterExplore from "../pages/AsterExplore";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import About from "../pages/AboutUs";
import Layout from "../layout/Layout";
import AsterDetail from "../pages/AsterDetail";
import AuthForm from "../components/AuthForm";
import ProtectedRoute from "./protectedRoutes";



export const AsterRouter = createBrowserRouter([{
    path: "/",
    element: <Layout />,
    children: [
        {
            index: true,
            element: <ProtectedRoute><Home /></ProtectedRoute>
        },
        {
            path: "/about",
            element: <ProtectedRoute><About /></ProtectedRoute>
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
            element: <ProtectedRoute><AsterDetail /></ProtectedRoute>
        },
        {
            path: "/newpost",
            element: <ProtectedRoute><AsterPost /></ProtectedRoute>
        },
        {
            path: "/editpost/:id",
            element: <ProtectedRoute><AsterPost /></ProtectedRoute>
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