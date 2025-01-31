import React from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import useSabnuaStore from '../../store/SabnuaStore';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { numberFormat } from '../../utils/number';

const CartCard = () => {
  const carts = useSabnuaStore((state) => state.carts);
  const actionUpdateQuantity = useSabnuaStore((state) => state.actionUpdateQuantity);
  const actionRemoveProduct = useSabnuaStore((state) => state.actionRemoveProduct);
  const getTotalPrice = useSabnuaStore((state) => state.getTotalPrice);

  const handleRemoveProduct = (productId) => {
    Swal.fire({
      title: 'ยืนยันการลบสินค้า',
      text: 'คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        actionRemoveProduct(productId);
        Swal.fire('ลบสำเร็จ!', 'สินค้าถูกลบออกจากตะกร้าแล้ว', 'success');
      }
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold text-yellow-700 mb-4">ตะกร้าของฉัน</h1>
      {carts.length > 0 ? (
        <div className="border border-yellow-300 rounded-lg shadow-lg p-4 mb-4 overflow-auto">
          {carts.map((cart, index) => (
            <div key={`${cart.id}-${index}`} className="bg-white p-4 rounded-lg shadow-md mb-3">
              {/* Row 1 */}
              <div className="flex justify-between mb-4">
                {/* Left */}
                <div className="flex gap-4 items-center">
                  {cart.images && cart.images.length > 0 && typeof cart.images[0].url === 'string' ? (
                    <img
                      className="w-20 h-20 rounded-md shadow-sm"
                      src={cart.images[0].url}
                      alt={cart.title || 'Product Image'}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                      No Image
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-yellow-700">{cart.title}</p>
                    <p className="text-sm text-gray-500">{cart.description}</p>
                  </div>
                </div>
                {/* Right */}
                <button
                  onClick={() => handleRemoveProduct(cart.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold p-2"
                  title="Remove Item"
                >
                  <FaTrash />
                </button>
              </div>
              {/* Row 2 */}
              <div className="flex justify-between items-center border-t pt-4">
                {/* Left */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => actionUpdateQuantity(cart.id, Math.max(cart.count - 1, 1))}
                    className={`px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 shadow-sm ${
                      cart.count === 1 ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                    disabled={cart.count === 1}
                    title="Decrease Quantity"
                  >
                    <FaMinus size={16} />
                  </button>
                  <span className="font-semibold text-yellow-700">{cart.count}</span>
                  <button
                    onClick={() => actionUpdateQuantity(cart.id, cart.count + 1)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 shadow-sm"
                    title="Increase Quantity"
                  >
                    <FaPlus size={16} />
                  </button>
                </div>
                {/* Right */}
                <div className="font-semibold text-yellow-700 text-lg">
                  ฿{numberFormat(cart.price * cart.count)}
                </div>
              </div>
            </div>
          ))}
          {/* Total */}
          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <span className="text-gray-700 text-lg font-semibold">รวมทั้งหมด:</span>
            <span className="text-yellow-700 text-xl font-bold">฿{numberFormat(getTotalPrice())}</span>
          </div>
          {/* Button */}
          <Link to="/cart">
            <button className="mt-4 w-full bg-yellow-700 text-white py-2 rounded-md hover:bg-yellow-800 shadow-md text-lg font-semibold">
              ดำเนินการชำระเงิน
            </button>
          </Link>
        </div>
      ) : (
        <p className="text-yellow-600 text-center">ไม่มีสินค้าในตะกร้า</p>
      )}
    </div>
  );
};

export default CartCard;
