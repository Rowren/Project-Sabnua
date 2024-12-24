import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useSabnuaStore from '../../store/SabnuaStore';
import { createProduct } from '../../api/product';
import Uploadfile from './Uploadfile';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';

const initialState = {
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: []
};

const FormProduct = () => {
    const token = useSabnuaStore((state) => state.token);
    const getCategory = useSabnuaStore((state) => state.getCategory);
    const categories = useSabnuaStore((state) => state.categories);
    const getProducts = useSabnuaStore((state) => state.getProducts);
    const products = useSabnuaStore((state) => state.products);

    const [form, setForm] = useState(initialState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getCategory(token);
        getProducts(token, 20); // โหลดรายการสินค้าจาก API
    }, [getCategory, getProducts, token]);

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        if (!form.categoryId) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'กรุณาเลือกประเภทอาหาร',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
            return;
        }

        try {
            const res = await createProduct(token, form)
            setForm(initialState); // รีเซ็ตฟอร์ม
            getProducts(token, 20); // รีโหลดรายการสินค้า
            Swal.fire({
                title: 'สำเร็จ!',
                text: `เพิ่มรายการอาหาร "${res.data.title}" สำเร็จ!`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'ไม่สามารถเพิ่มรายการอาหารได้ กรุณาลองใหม่',
                icon: 'error',
                confirmButtonText: 'ตกลง',
            });
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-center items-center">
                <form
                    onSubmit={handleOnSubmit}
                    className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <h1 className="col-span-2 text-2xl font-bold mb-6 text-center text-red-600">
                        เพิ่มรายการอาหาร
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
                        {isSubmitting ? 'กำลังบันทึก...' : 'เพิ่มรายการอาหาร'}
                    </button>
                </form>
            </div>

            <div className="mt-10 overflow-x-auto">
                <h2 className="text-xl font-bold mb-4">รายการสินค้า</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300">

                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th scope="col" className="p-3">No.</th>
                                <th scope="col" className="p-3">รูปเมนู</th>
                                <th scope="col" className="p-3">ชื่อเมนู</th>
                                <th scope="col" className="p-3">รายละเอียด</th>
                                <th scope="col" className="p-3">ประเภทอาหาร</th>
                                <th scope="col" className="p-3">ราคา</th>
                                <th scope="col" className="p-3">จำนวน</th>
                                <th scope="col" className="p-3">จำนวนที่ขาย</th>
                                <th scope="col" className="p-3">วันที่อัปเดต</th>
                                <th scope="col" className="p-3">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
    {products?.map((product, index) => {
        const category = categories.find(category => category.id === product.categoryId);
        return (
            <tr key={index} className="border-t">
                <td className="p-3">{index + 1}</td>
                <td>
                    {product.images.length > 0 ? (
                        <img
                            className="w-24 h-24 rounded-lg shadow-md"
                            src={product.images[0].url}
                        />
                    ) : (
                        <div
                            className="w-24 h-24 bg-gray-200 rounded-md 
                            flex items-center justify-center shadow-sm"
                        >
                            No Image
                        </div>
                    )}
                </td>
                <td className="p-3">{product.title}</td>
                <td className="p-3">{product.description}</td>
                <td className="p-3">{category ? category.name : 'ไม่มีข้อมูล'}</td>
                <td className="p-3">{product.price}</td>
                <td className="p-3">{product.quantity}</td>
                <td className="p-3">{product.sold}</td>
                <td className="p-3">{product.updatedAt}</td>
                <td className="p-3 text-center">
                    <p className="flex items-center justify-center gap-1 bg-green-500 px-2 rounded-md shadow-md">
                        <Link to={'/admin/product/' + product.id} className="text-white hover:text-yellow-500 flex items-center">
                            <FaEdit /> แก้ไข
                        </Link>
                    </p>
                    <p onClick={() => handleDelete(product.id)} className="flex items-center justify-center gap-1 text-white bg-red-600 hover:text-yellow-500 rounded-md shadow-md cursor-pointer mt-2">
                        <FaTrash /> ลบ
                    </p>
                </td>
            </tr>
        );
    })}
</tbody>

                    </table>

                </div>
            </div>
        </div>
    );
};

export default FormProduct;
