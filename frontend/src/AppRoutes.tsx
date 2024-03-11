
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/layout'
import HomePage from './pages/HomePage'
import ManageRestaurantPage from './pages/ManageRestaurantPage'
import ForgotPasswordPage from './components/Authentication/forgotPassword'
import Dashboard from './components/Dashboard'

const AppRoutes = () => {
    return (
        <Routes>


            <Route path='/' element={<Layout><HomePage></HomePage></Layout>}></Route>
            <Route path='/user-profile' element={ <span>hello</span>}></Route>
            <Route path='*' element={<Navigate to="/" />} />
            <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/manage-restaurant"
          element={
            <Layout>
              <ManageRestaurantPage />
            </Layout>
          }
        />
          <Route
          path="/forgot-password"
          element={
            <Layout>
              <ForgotPasswordPage />
            </Layout>
          }
        />
        </Routes>
    )
}

export default AppRoutes