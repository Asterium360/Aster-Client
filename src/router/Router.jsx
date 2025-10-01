import { createBrowserRouter } from "react-router-dom";
import AsterPost from "../pages/AsterPost";
import AsterProfile from "../pages/AsterProfile";
import AsterExplore from "../pages/AsterExplore";
import Contact from "../pages/Contact";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Layout from "../layout/Layout";
import AsterDetail from "../pages/AsterDetail";



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
            element: <AboutUs />
        },
        {
            path: "/myprofile",
            element: <AsterProfile />
        },
        {
            path: "/explore",
            element: <AsterExplore />
        },
        {
            path: "/viewpost/:id",
            element: <AsterDetail />
        },
        {
            path: "/newpost",
            element: <AsterPost />
        },
        {
            path: "/editpost/:id",
            element: <AsterPost />
        },
        {
            path: "/contact",
            element: <Contact />
        }
    ]
}])

export default AsterRouter;