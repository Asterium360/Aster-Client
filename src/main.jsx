import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import AsterRouter from './router/Router'
import useAuthStore from './store/authStore'

useAuthStore.getState().initialize();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={AsterRouter}/>
  </StrictMode>,
)
