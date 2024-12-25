import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';


const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className='h-full p-4 mx-auto'></main>
      <Outlet />
    </div>
  )
}

export default Layout
