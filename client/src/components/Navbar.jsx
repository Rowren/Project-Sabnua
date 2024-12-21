import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className="bg-red-600 shadow-lg">
            <div className="container mx-auto px-4">

                {/* Top Navbar */}
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <img 
                            src="/images/food-logo.png" 
                            alt="Logo" 
                            className="h-10 w-10 rounded-full border-4 border-yellow-400" 
                        />
                        <Link to="/" className="text-4xl font-bold text-yellow-400 hover:text-yellow-500">
                            แซ่บนัวครัวยินดี
                        </Link>
                    </div>

                    {/* Menu Links for Desktop */}
                    <div className="hidden md:flex items-center gap-8 text-lg font-medium">
                        <Link to="/" className="text-white hover:text-yellow-400 transition duration-300">หน้าแรก</Link>
                        <Link to="/menu" className="text-white hover:text-yellow-400 transition duration-300">เมนู</Link>
                        <Link to="/cart" className="text-white hover:text-yellow-400 transition duration-300">รายการอาหาร</Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/register" className="text-white bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                            สมัครสมาชิก
                        </Link>
                        <Link to="/login" className="text-white border border-white px-4 py-2 rounded-lg hover:bg-red-700 hover:text-yellow-400 transition duration-300">
                            เข้าสู่ระบบ
                        </Link>
                    </div>

                    {/* Hamburger Menu for Mobile */}
                    <div className="md:hidden flex items-center">
                        <button onClick={toggleMenu} className="text-3xl text-yellow-400">
                            {isMenuOpen ? 'X' : '☰'}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-red-600 py-4`}>
                    <div className="flex flex-col items-center gap-4">
                        <Link to="/" className="text-lg font-medium text-yellow-400 hover:text-yellow-500 transition duration-300">หน้าแรก</Link>
                        <Link to="/menu" className="text-lg font-medium text-yellow-400 hover:text-yellow-500 transition duration-300">เมนู</Link>
                        <Link to="/cart" className="text-lg font-medium text-yellow-400 hover:text-yellow-500 transition duration-300">รายการอาหาร</Link>
                        <div className="flex flex-col items-center gap-4 mt-4">
                            <Link to="/register" className="text-white bg-yellow-400 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300">
                                สมัครสมาชิก
                            </Link>
                            <Link to="/login" className="text-white border border-white px-4 py-2 rounded-lg hover:bg-red-700 hover:text-yellow-400 transition duration-300">
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
