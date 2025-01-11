import React from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart } from 'react-icons/fa';
import useSabnuaStore from '../../store/SabnuaStore';

const ProductCard = ({ product, onAddToCart }) => {
  const actionAddtoCart = useSabnuaStore((state)=> state.actionAddtoCart)



  return (
    <div className="w-full max-w-sm flex flex-col justify-between min-h-[420px]">
      <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url || 'https://via.placeholder.com/150'}
              alt={product.title}
              className="w-full h-36 object-cover"
            />
          ) : (
            <div className="w-full h-36 bg-gray-100 rounded-md text-center flex items-center justify-center shadow">
              No Image
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-2xl font-semibold">{product.title}</p>
          <p
            className="text-sm text-gray-500 overflow-hidden text-ellipsis"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 1, // จำกัดข้อความไม่เกิน 2 บรรทัด
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.description || 'No description available.'}
          </p>
        </div>

        <div className="flex justify-between p-3 items-center">
          <span className="text-lg font-bold text-yellow-700">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(product.price)}
          </span>
          <button className='bg-yellow-700 text-white rounded-md p-2 hover:bg-yellow-300 shadow-md' onClick={() => actionAddtoCart(product)}>
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
      })
    ),
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
