import { createBrowserRouter } from "react-router-dom";
import AsterProfile from "../pages/AsterProfile";
import AsterExplore from "../pages/AsterExplore";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Layout from "../layout/Layout";
import AsterDetail from "../pages/AsterDetail";
import AuthForm from "../components/AuthForm";
import AsterForm from "../components/AsterForm";
import { routeValidator } from "../validators/routeValidator";


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
            element:<AboutUs />,
            loader: routeValidator,
        },
        {
            path: "/myprofile",
            element: <AsterProfile />,
            loader: routeValidator,
        },
        {
            path: "/explore",
            element:<AsterExplore />,
            loader: routeValidator,
        },
        {
            path: "/viewpost/:id",
            element: <AsterDetail />,
            //loader: routeValidator,
        },
        {
            path: "/newpost",
            element:<AsterForm />,
            loader: routeValidator,
        },
        {
            path: "/editpost/:id",
            element: <AsterForm />,
            //loader: routeValidator,
        },
        {
            path: "/contact",
            element: <Contact />,
            //loader: routeValidator,
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