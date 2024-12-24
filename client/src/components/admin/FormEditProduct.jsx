import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSabnuaStore from '../../store/SabnuaStore';
import { readProduct, updateProduct } from '../../api/product';
import Uploadfile from './Uploadfile';
import { useParams, useNavigate } from 'react-router-dom';

const initialState = {
    title: "",
    description: "",
    price: 0.0,
    quantity: 0,
    categoryId: "",
    images: []
};

const FormEditProduct = () => {
    const { id } = useParams();  // ดึง id จาก URL
    const navigate = useNavigate();
    const token = useSabnuaStore((state) => state.token);
    const getCategory = useSabnuaStore((state) => state.getCategory);
    const categories = useSabnuaStore((state) => state.categories);

    const [form, setForm] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ฟังก์ชันดึงข้อมูลสินค้า
    const fetchProduct = async (token, id) => {
        try {
            const res = await readProduct(token, id);
            if (res?.data) {
                setForm({
                    ...form,
                    ...res.data,
                    title: res.data.title || "",  // ป้องกัน title เป็น undefined
                    description: res.data.description || "",  // ป้องกัน description เป็น undefined
                });
            }
        } catch (err) {
            console.error("Error Fetch Data", err);
        }
    };

    useEffect(() => {
        getCategory(token);  // ดึงข้อมูลประเภทสินค้า
        fetchProduct(token, id);  // ดึงข้อมูลสินค้าจาก API
    }, [getCategory, token, id]);

    // ฟังก์ชันเปลี่ยนแปลงข้อมูลในฟอร์ม
    const handleOnChange = (e) => {
//console.log(e.target.name, e.target.value)
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    // ฟังก์ชันเมื่อส่งฟอร์ม
   const handleOnSubmit = async (e) => {
    e.preventDefault();

   
    try {
        const res = await updateProduct(token, id, form);
        console.log(res)
            Swal.fire({
                title: 'สำเร็จ!',
                text: `แก้ไขข้อมูล "${res.data.title}" สำเร็จ!`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
            });
            navigate('/admin/product');
       
    } catch (err) {
        console.error('Error updating product:', err);
        Swal.fire({
            title: 'ผิดพลาด!',
            text: 'ไม่สามารถแก้ไขรายการอาหารได้ กรุณาลองใหม่',
            icon: 'error',
            confirmButtonText: 'ตกลง',
        });
    } finally {
        setIsSubmitting(false);
    }
   }


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-center items-center">
                <form
                    onSubmit={handleOnSubmit}
                    className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                    <h1 className="col-span-2 text-2xl font-bold mb-6 text-center text-red-600">
                        แก้ไขรายการอาหาร
                    </h1>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">ชื่ออาหาร</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={handleOnChange}
                            placeholder="ชื่ออาหาร"
                            name="title"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">รายละเอียด</label>
                        <input
                            type="text"
                            value={form.description}
                            onChange={handleOnChange}
                            placeholder="รายละเอียด"
                            name="description"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">ราคา (บาท)</label>
                        <input
                            type="number"
                            value={form.price}
                            onChange={handleOnChange}
                            placeholder="ราคา"
                            name="price"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">จำนวน</label>
                        <input
                            type="number"
                            value={form.quantity}
                            onChange={handleOnChange}
                            placeholder="จำนวน"
                            name="quantity"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                        <label className="block text-gray-700 font-bold mb-2">ประเภทอาหาร</label>
                        <select
                            value={form.categoryId}
                            onChange={handleOnChange}
                            name="categoryId"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <option value="" disabled>
                                กรุณาเลือก
                            </option>
                            {categories?.map((category, index) => (
                                <option key={index} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr />
                    {/* Upload file */}
                    <Uploadfile form={form} setForm={setForm} />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`col-span-2 ${isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-red-700'} text-white py-3 rounded-lg font-bold transition`}
                    >
                        {isSubmitting ? 'กำลังบันทึก...' : 'แก้ไขรายการอาหาร'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormEditProduct;
