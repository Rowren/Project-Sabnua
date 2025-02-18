import React from 'react';
import { FaBars } from 'react-icons/fa';

const HeaderEmp = ({ toggleSidebar }) => {
  return (
    <header className="bg-orange-400 h-16 flex items-center px-6 ">
      <button onClick={toggleSidebar} className="text-white md:hidden">
        <FaBars size={30} />
      </button>
      <div className="ml-4 text-2xl font-bold text-white">แซ่บนัวครัวยินดี</div>
    </header>
  );
};

export default HeaderEmp;