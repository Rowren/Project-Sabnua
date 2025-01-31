import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';


const LayoutUser = () => {
  return (
    <div>
      <Navbar />
      <main className='h-full p-2 mx-auto'>
  
  <Outlet />
</main>

    </div>
  )
}

export default LayoutUser
