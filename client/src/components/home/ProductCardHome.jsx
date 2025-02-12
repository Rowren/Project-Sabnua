import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { numberFormat } from '../../utils/number';
import { motion } from 'framer-motion';

const ProductCardHome = ({ product }) => {
  const navigate = useNavigate();

  if (!product) {
    return (
      <div className="w-full max-w-sm flex flex-col justify-between min-h-[320px]">
        <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105">
          <div className="w-full h-36 bg-gray-100 rounded-md text-center flex items-center justify-center shadow">
            ไม่มีสินค้าที่จะแสดง
          </div>
        </div>
      </div>
    );
  }

  // ฟังก์ชันไปยังหน้าเมนู
  const goToMenu = () => {
    navigate('/menu');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm flex flex-col justify-between h-80 cursor-pointer"
      onClick={goToMenu} // กดที่การ์ดแล้วไปหน้าเมนู
    >
      <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        {/* รูปสินค้า */}
        <div>
          {product?.images && product.images.length > 0 ? (
            <img
              src={product.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={product.title || 'Product Image'}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center shadow">
              ไม่มีภาพสินค้า
            </div>
          )}
        </div>

        {/* รายละเอียดสินค้า */}
        <div className="p-3">
          <p className="text-lg font-semibold truncate">{product.title}</p>
          <p className="text-sm text-gray-600 truncate">
            {product.description}
          </p>
        </div>

        {/* ราคา */}
        <div className="flex justify-center p-3">
          <span className="text-lg font-bold text-yellow-700">
            {numberFormat(product.price)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

ProductCardHome.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
    price: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCardHome;
