import React, { useState } from 'react';
import { PiListPlusFill } from "react-icons/pi";
import useSabnuaStore from '../../store/SabnuaStore';
import { useNavigate } from 'react-router-dom';
import { createUserCart } from '../../api/user';
import Swal from 'sweetalert2';

const ListCart = () => {
    const cart = useSabnuaStore((state) => state.carts);
    const user = useSabnuaStore((state) => state.user);
    const token = useSabnuaStore((state) => state.token);
    const getTotalPrice = useSabnuaStore((state) => state.getTotalPrice);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSaveCart = async () => {
        setLoading(true);
        try {
            const res = await createUserCart(token, { cart });
            console.log(res);
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                text: 'บันทึกรายการในตะกร้าเรียบร้อย',
            });
            navigate('/Checkout');
        } catch (err) {
            console.error("ข้อผิดพลาด:", err.response || err.message);
            Swal.fire({
                icon: 'error',
                title: 'บันทึกล้มเหลว!',
                text: err.response.data.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 rounded-md p-4 space-y-6">
            {/* Header */}
            <div className="flex gap-4 items-center">
                <PiListPlusFill size={36} />
                <p className="text-2xl font-semibold">รายการอาหาร {cart.length} รายการ</p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left */}
                <div className="lg:col-span-2">
                    {cart.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className="bg-white p-4 rounded-lg shadow-md mb-3"
                        >
                            {/* Row 1 */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4 items-center">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            className="w-20 h-20 rounded-md shadow-sm"
                                            src={item.images[0].url}
                                            alt={item.title}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">
                                            No Image
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-yellow-700">{item.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {item.price} x {item.count}
                                        </p>
                                    </div>
                                </div>
                                <div className="font-semibold text-yellow-700 text-lg">
                                    ฿{(item.price * item.count).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right */}
                <div className="bg-white p-4 rounded-md shadow-md space-y-4">
                    <p className="text-2xl font-bold">ยอดรวม</p>
                    <div className="flex justify-between">
                        <span>รวมสุทธิ</span>
                        <span className="text-xl">฿{getTotalPrice().toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                    <button
  onClick={() => {
    if (user) {
        console.log('User is logged in:', user);
        handleSaveCart();
      } else {
        console.log('User is not logged in. Redirecting to login...');
        navigate('/login');
      }
  }}
  className={`w-full rounded-md text-white p-1.5 shadow-md ${
    loading
      ? 'bg-gray-400 cursor-not-allowed'
      : user
      ? 'bg-green-600 hover:bg-green-800'
      : 'bg-blue-600 hover:bg-blue-800'
  }`}
  disabled={loading}
>
  {user ? 'สั่งซื้อ' : 'เข้าสู่ระบบ'}
</button>



                        <button
                            onClick={() => navigate('/Menu')}
                            className="bg-yellow-300 w-full rounded-md text-white p-1.5 shadow-md hover:bg-yellow-600"
                        >
                            แก้ไขรายการอาหาร
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListCart;
