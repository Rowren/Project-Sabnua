import React from 'react';
import PropTypes from 'prop-types';
import { FaShoppingCart } from 'react-icons/fa';

const ProductCard = ({ product, onAddToCart }) => {
  const buttonClass =
    'bg-yellow-700 text-white rounded-md p-2 hover:bg-yellow-300 shadow-md';

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-lg shadow-lg border border-yellow-200 overflow-hidden hover:shadow-xl transform transition-all duration-300 hover:scale-105">
        <div>
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0].url || 'https://via.placeholder.com/150'}
              alt={product.title}
              className="w-full h-36 object-cover hover:scale-110 hover:duration-200"
            />
          ) : (
            <div className="w-full h-36 bg-gray-100 rounded-md text-center flex items-center justify-center shadow">
              No Image
            </div>
          )}
        </div>

        <div className="p-3">
          <p className="text-2xl font-semibold">{product.title}</p>
          <p className="text-sm text-gray-500">
            {product.description?.length > 100
              ? `${product.description.slice(0, 100)}...`
              : product.description || 'No description available.'}
          </p>
        </div>

        <div className="flex justify-between p-3 items-center">
          <span className="text-lg font-bold text-yellow-700">
            {new Intl.NumberFormat('th-TH', {
              style: 'currency',
              currency: 'THB',
            }).format(product.price)}
          </span>
          <button className={buttonClass} onClick={() => onAddToCart(product.id)}>
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
