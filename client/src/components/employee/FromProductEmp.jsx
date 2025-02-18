import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import useSabnuaStore from '../../store/SabnuaStore';
import { numberFormat } from '../../utils/number';
import { dateFormat } from '../../utils/dateFormat';

const FormProductEmp = () => {
    const getCategory = useSabnuaStore((state) => state.getCategory);
    const categories = useSabnuaStore((state) => state.categories);
    const getProducts = useSabnuaStore((state) => state.getProducts);
    const products = useSabnuaStore((state) => state.products);

    useEffect(() => {
        getCategory();
        getProducts(20);
    }, [getCategory, getProducts]);

    return (
        <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-6"> 
            <div className="mt-10 overflow-x-auto">
            <h1 className="text-3xl font-semibold text-yellow-700 mb-6 text-center">ข้อมูลรายการอาหาร</h1>
                <h2 className="text-xl font-semibold text-yellow-600 mb-4 text-center ">ตารางรายการอาหาร</h2>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="p-3 text-sm">No.</th>
                                <th className="p-3 text-sm">รูปเมนู</th>
                                <th className="p-3 text-sm">ชื่อเมนู</th>
                                <th className="p-3 text-sm">รายละเอียด</th>
                                <th className="p-3 text-sm">ประเภทอาหาร</th>
                                <th className="p-3 text-sm">ราคา</th>
                                <th className="p-3 text-sm">จำนวน</th>
                                <th className="p-3 text-sm">จำนวนที่ขาย</th>
                                <th className="p-3 text-sm">วันที่อัปเดต</th>
                                <th className="p-3 text-sm">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products?.map((product, index) => {
                                const category = categories.find(category => category.id === product.categoryId);
                                return (
                                    <tr key={index} className="border-t">
                                        <td className="p-3 text-sm">{index + 1}</td>
                                        <td className="p-3 hover:scale-125">
                                            {product.images.length > 0 ? (
                                                <img
                                                    className="w-24 h-24 max-w-full max-h-24 object-cover rounded-lg shadow-md"
                                                    src={product.images[0].url}
                                                    alt="product"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center shadow-sm">
                                                    No Image
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-3 text-sm">{product.title}</td>
                                        <td className="p-3 text-sm">{product.description}</td>
                                        <td className="p-3 text-sm">{category ? category.name : 'ไม่มีข้อมูล'}</td>
                                        <td className="p-3 text-sm">{numberFormat(product.price)}</td>
                                        <td className="p-3 text-sm">{product.quantity}</td>
                                        <td className="p-3 text-sm">{product.sold}</td>
                                        <td className="p-3 text-sm">{dateFormat(product.updatedAt)}</td>
                                        <td className="p-3 text-center">
                                            <Link to={`/employee/product/${product.id}`} className="flex items-center gap-1 text-white bg-green-500 px-2 rounded-md shadow-md hover:text-yellow-500">
                                                <FaEdit /> แก้ไข
                                            </Link>
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

export default FormProductEmp;
