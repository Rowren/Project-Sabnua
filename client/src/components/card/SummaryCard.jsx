import React, { useEffect, useState } from 'react';
import useSabnuaStore from '../../store/SabnuaStore';
import { listUserCart, saveAddress } from '../../api/user';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { numberFormat } from '../../utils/number';

const SummaryCard = () => {

    const token = useSabnuaStore((state) => state.token)
    const [products, setProducts] = useState([])
    const [cartTotal, setCartTotal] = useState(0)

    const [address, setAddress] = useState('')
    const [addressSaved, setAddressSaved] = useState(false)
    
    const navigate = useNavigate()

    useEffect(() => {
        handleGetUserCart(token)
    }, [])

    const handleGetUserCart = async (token) => {
        try {
            const res = await listUserCart(token)
            console.log(res)
            setProducts(res.data.products)
            setCartTotal(res.data.cartTotal)
        } catch (err) {
            console.error('มีข้อผิดพลาด', err)
        }
    }


  
    const handleSaveAddress = async () => {
        if (!address) {
            Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกที่อยู่',
                text: 'กรุณากรอกที่อยู่ในการจัดส่งก่อนบันทึก',
            });
            return; // หยุดการทำงานของฟังก์ชันหากไม่มีที่อยู่
        }

        try {
            const res = await saveAddress(token, address); // ใช้ token และ address
            console.log(res);

            // แจ้งเตือนความสำเร็จ
            Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ!',
                text: 'บันทึกที่อยู่สำเร็จ',
            });

            setAddressSaved(true); // ตั้งค่าสถานะว่าเซฟสำเร็จ
        } catch (err) {
            console.error('มีข้อผิดพลาด', err);

            // แจ้งเตือนข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด!',
                text: 'บันทึกที่อยู่ไม่สำเร็จ',
            });
        }
    };

    const handleToPayment =() => {
        if(!addressSaved){
            return Swal.fire({
                icon: 'warning',
                title: 'กรุณากรอกที่อยู่',
                text: 'กรุณากรอกที่อยู่ในการจัดส่งก่อนจะชำระเงิน',
            });
        }
        navigate('/user/payment')
    }


    return (
        <div className="mx-auto max-w-4xl p-6 bg-white shadow-md rounded-md">
            <div className="flex flex-wrap -mx-4">
                {/* Left */}
                <div className="w-full md:w-1/2 px-4 mb-6 md:mb-0">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
                        <h1 className="text-lg font-semibold text-gray-800 mb-4">ที่อยู่ในการจัดส่ง</h1>
                        <textarea
                            required
                            onChange={(e) => setAddress(e.target.value)} // เก็บที่อยู่ที่กรอก
                            className="w-full p-2 m-2 rounded-md"
                            placeholder="กรุณากรอกที่อยู่ในการจัดส่ง"
                        />
                        <button
                            onClick={handleSaveAddress} // เรียกฟังก์ชันเมื่อคลิก
                            className="bg-blue-500 text-white p-1.5 rounded-md shadow-md hover:bg-blue-800 hover:scale-105 hover:translate-y-1 hover:duration-200"
                        >
                            บันทึกที่อยู่ในการจัดส่ง
                        </button>
                    </div>
                </div>

                {/* Right */}
                <div className="w-full md:w-1/2 px-4">
                    <div className="p-4 bg-gray-100 rounded-lg shadow-md space-y-4">
                        <h1 className="text-lg font-semibold text-gray-800 mb-4">รายละเอียดคำสั่งซื้อของคุณ</h1>

                        {/* Item List */}

                        {
                            products?.map((pd, index) =>
                                <div key={index}>
                                    <div className='flex justify-between items-end'>
                                        <div>
                                            <p className='font-semibold'>{pd.product.title}</p>
                                            <p className='text-sm'>จำวนวน: {pd.count} x {pd.product.price}</p>
                                        </div>

                                        <div>
                                            <p className='text-red-500 font-bold'>{numberFormat(pd.count * pd.product.price)}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        <hr />
                        <div>
                            <div className='flex justify-between'>
                                <p>ค่าจัดส่ง:</p>
                                <p>0.00</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>ส่วนลด:</p>
                                <p>0.00</p>
                            </div>
                        </div>
                        <hr />
                        <div>
                            <div className='flex justify-between'>
                                <p className='text-lg font-semibold'>ยอดรวมสุทธิ:</p>
                                <p className='text-lg text-red-500 font-semibold'>{numberFormat(cartTotal)}</p>
                            </div>
                        </div>

                        <hr />
                        <div>
                            <button
                            onClick={handleToPayment}
                            
                            className='bg-green-400 w-full p-2 rounded-md shadow-md text-white hover:bg-green-600'>ดำเนินการชำระเงิน</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
