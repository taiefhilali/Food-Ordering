import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { ClerkProvider } from '@clerk/clerk-react'
// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


 const customTheme = {
  colors: {
    primary: '#FDBA74',
    secondary: '#ffff',
   
  }}
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <Router>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} >
     <AppRoutes></AppRoutes>
    </ClerkProvider>   
  </Router>
  </React.StrictMode>,
)
