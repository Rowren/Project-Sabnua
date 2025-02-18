import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import History from '../pages/user/History';
import Checkout from '../pages/Checkout';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Layout from '../layouts/Layout';
import LayoutAdmin from '../layouts/LayoutAdmin';
import Dashboard from '../pages/admin/Dashboard';
import Category from '../pages/admin/Category';
import Product from '../pages/admin/Product';
import Manage from '../pages/admin/Manage';
import LayoutUser from '../layouts/LayoutUser';
import HomeUser from '../pages/user/HomeUser';
import ProtectRouteUser from './ProtectRouteUser';
import ProtectRouteAdmin from './ProtectRouteAdmin';
import EditProduct from '../pages/admin/EditProduct';
import Payment from '../pages/user/Payment';
import ManageOrders from '../pages/admin/ManageOrders';
import EditUser from '../pages/admin/EditUser';
import EditProfile from '../pages/user/EditProfile';
import ProtectRouteEmployee from './ProtectRouteEmployee';
import DashBoardEmp from '../pages/employee/DashBoardEmp';
import ProductEmp from '../pages/employee/ProductEmp';
import LayoutEmployee from '../layouts/LayoutEmployee';
import EditProductEmp from '../pages/employee/EditProductEmp';
import ManageOrdersEmp from '../pages/employee/ManageOrdersEmp';
import ListUser from '../pages/employee/ListUser';
import EditUserEmp from '../pages/employee/EditUserEmp';
import DetailOrder from '../pages/employee/DetailOrderEmp';
import DetailOrderEmp from '../pages/employee/DetailOrderEmp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'menu', element: <Menu /> },
      { path: 'cart', element: <Cart /> },
     
      { path: 'checkout', element: <Checkout /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ],
  },
  {
    path: '/admin',
    element: <ProtectRouteAdmin element={<LayoutAdmin />} />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'category', element: <Category /> },
      { path: 'product', element: <Product /> },
      { path: 'product/:id', element: <EditProduct /> },
      { path: 'manage', element: <Manage /> },
      { path: 'user/:id', element: <EditUser /> },
      { path: 'orders', element: <ManageOrders /> },
    ],
  },
  {
    path: '/user',
    element: <ProtectRouteUser element={<LayoutUser />} />,
    children: [
      { index: true, element: <HomeUser /> },
      { path: 'payment', element: <Payment /> },
      { path: 'history', element: <History /> },
      { path: 'update/:id', element: <EditProfile /> }, // <-- ID ที่ใช้ใน URL
    ],
  },
  {
    path: '/employee',
    element: <ProtectRouteEmployee element={<LayoutEmployee/>} />,
    children: [
      { index: true, element: <DashBoardEmp /> },
      { path: 'product', element: <ProductEmp /> },
      { path: 'product/:id', element: <EditProductEmp /> },
      { path: 'orders', element: <ManageOrdersEmp /> },
      { path: 'order/:orderId', element: <DetailOrderEmp /> },
      { path: 'manage', element: <ListUser /> },
      { path: 'user/:id', element: <EditUserEmp /> },



      
    ],
  }
  
  

  

]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
