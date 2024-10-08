
import {  Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layouts/layout'
import ManageRestaurantPage from './pages/Restaurant/ManageRestaurantPage'
import ForgotPasswordPage from './components/Authentication/forgotPassword'
import Dashboard from './components/Dashboard'
import PageTitle from './components/PageTitle'
import ECommerce from './pages/Dashboard/ECommerce';
import FormLayout from './pages/Form/FormLayout';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
// import Tables from './pages/Tables';
import Displayrestaurants from './pages/Restaurant/Displayrestaurants'
import DetailsSection from './forms/manage-restaurant-form/DetailsSection'
import DisplayProductsPage from './pages/Products/DisplayProducts'; // Import the DisplayProductsPage component
import ProductDetailContainer from './components/Products/ProductDetailContainer '
import ManageProductPage from './pages/Products/ManageProductPage'
import RegisterForm from './forms/manage-user-form/RegisterForm'
import CategoryComponent from './components/Categories/CategoryComponent'
import ProductTable from './pages/Products/ProductTable'
import LoginFormModal from './forms/manage-user-form/LoginFormModal'
import { useEffect, useState } from 'react'
import OrdersList from './pages/Orders/OrdersDisplay'
import RestaurantTable from './pages/Restaurant/RestaurantTable'
// import UsersDisplay from './components/Authentication/AdminsDisplay'
// import { BrowserRouter as Router } from 'react-router-dom';
// import UserDisplayTest from './pages/Users/userDisplayTest'
import StockComponent from './components/Products/StockComponent'
import RevenueByDateComponent from './components/Products/RevenueByDateComponent'
import Statistics from './components/Dashboard/Statistics'
import QRCodeGenerator from './pages/QrcodeGenerator/QRCodeGenerator'
import ChatComponent from './components/Chat/ChatComponent'
import AddCouponCode from './pages/Discount/AddCouponCode'
// import CouponList from './pages/Discount/CouponList'
import OrderDetails from './pages/Orders/OrderDetails'
import AdminsDisplay from './components/Authentication/AdminsDisplay'
import ClientsDisplay from './components/Authentication/ClientsDisplay'
import VendorsDisplay from './components/Authentication/VendorsDisplay'
import AdditivesForm from './forms/manage-product-forms/AdditivesForm'
import RestaurantDetails from './pages/Restaurant/RestaurantDetails '
// import EditRestaurant from './pages/Restaurant/EditRestaurant'
import Dashboardadmin from './components/Dashboard/statisticsAdmin'
import OrdersTable from './pages/Orders/OrdersTable'
import ManageCategoriesPage from './forms/manage-category-form/ManageCategoriesPage'

const AppRoutes = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        console.error('No token found');
        return;
      }

      fetch("http://localhost:7000/api/my/auth/login/success", {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          throw new Error("Authentication has failed!");
        })
        .then((resObject) => {
          setUser(resObject.user);
          console.log(user,'userr');

        }
      )
        .catch((err) => {
          console.log(err);
        });
    };

    getUser();
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setIsModalOpen] = useState(false);
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };


  return (

<Routes>


      <Route path='/' element={<Layout></Layout>}></Route>
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
          
            <LoginFormModal closeModal={closeModal} />

          
        }
      />

 
          <Route
            path="/manage-restaurant"
            element={<ManageRestaurantPage />}
          />
          <Route
            path="/display-products"
            element={<DisplayProductsPage />}
          />
       
       <Route
            path="/display-orders"
            element={<OrdersList />}
          />
        <Route path="/order-details/:id" element={<OrderDetails />} />


      <Route
        path="/adminproducts"
        element={

          <ProductTable />

        }
      />
       <Route
        path="/Orderstable"
        element={

          <OrdersTable />

        }
      />
          <Route
        path="/categoriestable"
        element={

          <CategoryComponent />

        }
      />
           <Route
        path="/adminrestaurants"
        element={

          <RestaurantTable />

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
          
            <Displayrestaurants />
          
        }
      />
              <Route path="/restaurant-details/:id" element={<RestaurantDetails />} />

      <Route
        path="/product/:productId"
        element={
          
            <ProductDetailContainer />
          
        }
      />
      <Route path="/additives" element={<AdditivesForm />} />

  <Route
        path="/chat"
        element={
          
            <ChatComponent />
          
        }
      />
      <Route
        path="/details"
        element={
          
            <DetailsSection />
          
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
        path="/settings"
        element={
          <>
            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <Settings />
          </>
        }
      />
      <Route
        path="/statsticsVendor"
        element={
          
            <Statistics />
          
        }
      />
            <Route
        path="/statsticsAdmin"
        element={
          
            <Dashboardadmin />
          
        }
      />
         <Route
        path="/revenueChart"
        element={
          <>
            <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <RevenueByDateComponent />
          </>
        }
      />
      <Route
        path="/add-product"
        element={
          
            < ManageProductPage />
          
        }
      />
         <Route
        path="/stock"
        element={
          
            < StockComponent />
          
        }
      />
       <Route
        path="/coupons"
        element={

            <AddCouponCode />
     
        }
      />

      <Route
        path="/admins"
        element={
          
            <AdminsDisplay />
          
        }
      />
      <Route
        path="/clients"
        element={
          
            <ClientsDisplay />
        }
      />
      <Route
        path="/vendors"
        element={
          
            <VendorsDisplay />
          
        }
      />
      <Route
        path="/categories"
        element={
          
            <CategoryComponent />
          
        }
      />
 <Route
        path="/categories"
        element={
          
            <CategoryComponent />
          
        }
      />
      {/* <Route path="/manage-categories" element={<AddCategoryForm fetchCategories={fetchCategories} />} /> */}
      <Route path="/manage-categories" element={<ManageCategoriesPage />} />

      
    
        <Route
        path="/QrCode"
        element={
          
            <QRCodeGenerator />
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
          
            <RegisterForm closeModal={closeModal} />

          
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