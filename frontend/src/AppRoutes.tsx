
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/layout'
import HomePage from './pages/HomePage'
import ManageRestaurantPage from './pages/Restaurant/ManageRestaurantPage'
import ForgotPasswordPage from './components/Authentication/forgotPassword'
import Dashboard from './components/Dashboard'
import PageTitle from './components/PageTitle'
import ECommerce from './pages/Dashboard/ECommerce';
import FormLayout from './pages/Form/FormLayout';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Displayrestaurants from './pages/Restaurant/Displayrestaurants'
import DetailsSection from './forms/manage-restaurant-form/DetailsSection'
import DisplayProductsPage from './pages/Products/DisplayProducts'; // Import the DisplayProductsPage component
import ProductDetailContainer from './components/Products/ProductDetailContainer '
import ManageProductPage from './pages/Products/ManageProductPage'
import RegisterForm from './forms/manage-user-form/RegisterForm'
import CategoryComponent from './components/Categories/CategoryComponent'
import ProductTable from './pages/Products/ProductTable'
import LoginFormModal from './forms/manage-user-form/LoginFormModal'
import { useState } from 'react'
const AppRoutes = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Routes>


      <Route path='/' element={<Layout><HomePage></HomePage></Layout>}></Route>
      <Route path='/user-profile' element={<span>hello</span>}></Route>
      <Route path='*' element={<Navigate to="/" />} />
      <Route
        path="/dashboard"
        element={

          <Dashboard />
        }
      />
      <Route
        path="/authentication"
        element={
          <>
            <LoginFormModal closeModal={closeModal} />

          </>
        }
      />
      <Route
        path="/manage-restaurant"
        element={

          <ManageRestaurantPage />

        }
      />
      //vendor
      <Route
        path="/display-products"
        element={<DisplayProductsPage />} // Use DisplayProductsPage component as the element
      />
//Admin
      <Route
        path="/adminproducts"
        element={

          <ProductTable />

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
      <Route
        path="/dashboards"

        element={
          <>
            <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <ECommerce />
          </>
        }
      />
      <Route
        path="/calendar"
        element={
          <>
            <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Calendar />
          </>
        }
      />
      <Route
        path="/profile"
        element={
          <>
            <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Profile />
          </>
        }
      />
      <Route
        path="/display-restaurant-details"
        element={
          <>
            <Displayrestaurants />
          </>
        }
      />
      <Route
        path="/product/:productId"
        element={
          <>
            <ProductDetailContainer />
          </>
        }
      />

      <Route
        path="/details"
        element={
          <>
            <DetailsSection />
          </>
        }
      />
      <Route
        path="/forms/form-layout"
        element={
          <>
            <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <FormLayout />
          </>
        }
      />
      <Route
        path="/tables"
        element={
          <>
            <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Tables />
          </>
        }
      />
      <Route
        path="/settings"
        element={
          <>
            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Settings />
          </>
        }
      />
      <Route
        path="/add-product"
        element={
          <>
            < ManageProductPage />
          </>
        }
      />
      <Route
        path="/categories"
        element={
          <>
            <CategoryComponent />
          </>
        }
      />

      <Route
        path="/chart"
        element={
          <>
            <Chart />
          </>
        }
      />
      <Route
        path="/ui/alerts"
        element={
          <>
            <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Alerts />
          </>
        }
      />
      <Route
        path="/ui/buttons"
        element={
          <>
            <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Buttons />
          </>
        }
      />
      <Route
        path="/auth/signin"
        element={
          <>
            <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignIn />
          </>
        }
      />

      <Route
        path="/register"
        element={
          <>
            <RegisterForm closeModal={closeModal} />

          </>
        }
      />

      <Route
        path="/auth/signup"
        element={
          <>
            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignUp />
          </>
        }
      />
    </Routes>
  )
}

export default AppRoutes