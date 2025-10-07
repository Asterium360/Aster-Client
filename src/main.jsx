import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import AsterRouter from './router/Router'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AsterDetail from "./pages/AsterDetail";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={AsterRouter}/>
  </StrictMode>,
)
