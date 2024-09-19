import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ClerkProvider } from '@clerk/clerk-react';
import './css/style.css';
import './css/satoshi.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'jsvectormap/dist/jsvectormap.css';
const queryClient = new QueryClient({
  
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },

})

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY



if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}  >
          <AppRoutes></AppRoutes>
        </ClerkProvider>
      </QueryClientProvider>
    </Router>
  </React.StrictMode>,
)
