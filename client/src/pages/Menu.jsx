import React, { useEffect, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import ProductCard from '../components/card/ProductCard';
import useSabnuaStore from '../store/SabnuaStore';
import SearchCard from '../components/card/SearchCard';
import CartCard from '../components/card/CartCard';

const Menu = () => {
  const getProducts = useSabnuaStore((state) => state.getProducts);
  const products = useSabnuaStore((state) => state.products);
  const carts = useSabnuaStore((state) => state.carts); // ดึง carts จาก store
  const actionAddtoCart = useSabnuaStore((state) => state.actionAddtoCart); // ฟังก์ชันเพิ่มสินค้า

  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const handleCartToggle = () => {
    setCartOpen(!isCartOpen);
  };

  return (
    <div className="relative min-h-screen bg-yellow-50">
      {/* Main Content */}
      <div className="p-4 lg:grid lg:grid-cols-[3fr_1fr] lg:gap-4">
        {/* Product Section */}
        <div className="bg-white p-4 shadow-md rounded-md border border-yellow-300 mb-4">
          <SearchCard />
          <h2 className="text-lg font-semibold text-yellow-700 mb-4">เมนูอาหาร</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
          {Array.isArray(products) && products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  onAddToCart={() => actionAddtoCart(product)} // เรียกใช้ actionAddtoCart
                />
              ))
            ) : (
              <p>ไม่พบสินค้าที่จะแสดง</p>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white p-6 shadow-md border border-yellow-300 flex flex-col ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 z-40 lg:relative lg:translate-x-0 lg:w-auto lg:h-auto lg:block`}
        >
          {carts.length > 0 ? ( // ใช้ carts จาก store
            <ul className="flex-grow overflow-auto space-y-2">
              
                <CartCard  />
             
            </ul>
          ) : (
            <p className="text-yellow-600 flex-grow">ไม่มีสินค้าในตะกร้า</p>
          )}
        </div>
      </div>

      {/* Cart Icon */}
      <button
        className="fixed bottom-4 right-4 bg-yellow-700 text-white p-3 rounded-full shadow-lg z-50 lg:hidden"
        onClick={handleCartToggle}
      >
        <FaShoppingCart size={24} />
        {carts.length > 0 && ( // ใช้ carts.length
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {carts.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default Menu;
