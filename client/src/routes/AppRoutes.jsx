import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Cart from '../pages/Cart';
import History from '../pages/History';
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
import HomeUser from'../pages/user/HomeUser';
import ProtectRouteUser from './ProtectRouteUser';
import ProtectRouteAdmin from './ProtectRouteAdmin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'menu', element: <Menu /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'cart', element: <Cart /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'history', element: <History /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'checkout', element: <Checkout /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'login', element: <Login /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'register', element: <Register /> }, // ใช้ path แบบสัมพัทธ์
    ],
  },
  {
    path: '/admin',
    element: <ProtectRouteAdmin element={<LayoutAdmin/>}/>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'category', element: <Category /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'product', element: <Product /> }, // ใช้ path แบบสัมพัทธ์
      { path: 'manage', element: <Manage /> }, // ใช้ path แบบสัมพัทธ์
    ],
  },
  {
    path: '/user',
    // element: <LayoutUser />,
    element: <ProtectRouteUser element={<LayoutUser/>}/>,
    children: [
      { index: true, element: <HomeUser /> },
    ],
  },

]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
