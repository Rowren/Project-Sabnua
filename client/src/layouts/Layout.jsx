import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Layout = () => {
  return (
    <div>
      <Navbar />
      <main className='h-full p-4 mx-auto'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}



export default Layout
