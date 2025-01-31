import React from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart } from 'react-icons/fa';
import useSabnuaStore from '../../store/SabnuaStore';
import { numberFormat } from '../../utils/number';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  if (!product) {
    // จัดการกรณีที่ product เป็น undefined หรือ null
    return (
      <div className="w-full max-w-sm flex flex-col justify-between min-h-[420px]">
        <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105">
          <div className="w-full h-36 bg-gray-100 rounded-md text-center flex items-center justify-center shadow">
            ไม่มีสินค้าที่จะแสดง
          </div>
        </div>
      </div>
    );
  }

  const actionAddtoCart = useSabnuaStore((state) => state.actionAddtoCart);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-sm flex flex-col justify-between h-80 "
    >
      <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div>
          {product?.images && product.images.length > 0 ? (
            <img
              src={product.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={product.title || 'Product Image'}
              className="w-full h-40 object-cover"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 rounded-md text-center flex items-center justify-center shadow">
              ไม่มีภาพสินค้า
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-2xl font-semibold truncate">{product.title}</p>
          <p
            className="text-sm text-gray-500 overflow-hidden text-ellipsis truncate"
            
          >
            {product.description}
          </p>
        </div>

        <div className="flex justify-between p-3 items-center">
          <span className="text-lg font-bold text-yellow-700">
            {numberFormat(product.price)}
          </span>
          <button
            className="bg-yellow-700 text-white rounded-md p-2 hover:bg-yellow-300 shadow-md"
            onClick={() => actionAddtoCart(product)}
            aria-label={`เพิ่ม ${product.title} ลงในตะกร้า`}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string, // Description can be null or undefined
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string, // Not required
      })
    ),
    price: PropTypes.number.isRequired, // Assuming price is a number
  }).isRequired,
};

export default ProductCard;
