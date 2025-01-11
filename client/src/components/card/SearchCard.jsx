import React, { useEffect, useState } from 'react';
import useSabnuaStore from '../../store/SabnuaStore';

const SearchCard = () => {
    const getProducts = useSabnuaStore((state) => state.getProducts);
    const actionSearchFilters = useSabnuaStore((state) => state.actionSearchFilters);
    const getCategory = useSabnuaStore((state) => state.getCategory);
    const categories = useSabnuaStore((state) => state.categories);

    const [text, setText] = useState('');
    const [catSelect, setCatSelect] = useState([]);

    // โหลดหมวดหมู่เมื่อคอมโพเนนต์ถูกโหลด
    useEffect(() => {
        getCategory(); // โหลดหมวดหมู่
    }, []);

    // ตั้งค่าให้เลือกหมวดหมู่ทั้งหมดเป็นค่าเริ่มต้นเมื่อหมวดหมู่ถูกโหลด
    useEffect(() => {
        if (categories.length > 0) {
            const allCategoryIds = categories.map((cat) => cat.id);
            setCatSelect(allCategoryIds); // ตั้งให้เลือกหมวดหมู่ทั้งหมด
        }
    }, [categories]);

    // Step 1: ค้นหาตามข้อความและหมวดหมู่
    useEffect(() => {
        const delay = setTimeout(() => {
            if (text || catSelect.length > 0) {
                actionSearchFilters({ query: text, category: catSelect });
            } else {
                getProducts(); // ถ้าไม่มีการค้นหาก็โหลดสินค้าทั้งหมด
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [text, catSelect]);

    // Step 2: ค้นหาตามหมวดหมู่ที่เลือก
    const handleOnClick = (e) => {
        const inClick = e.target.value;
        const inState = [inClick]; // เลือกหมวดหมู่เดียว

        setCatSelect(inState); // อัปเดตหมวดหมู่ที่เลือก
        setText(''); // รีเซ็ตข้อความค้นหา
        actionSearchFilters({ category: inState }); // ค้นหาตามหมวดหมู่ที่เลือก
    };

    // Step 3: เลือกทั้งหมด
    const handleSelectAll = () => {
        const allCategoryIds = categories.map((cat) => cat.id); // เลือกหมวดหมู่ทั้งหมด
        setCatSelect(allCategoryIds); // ตั้งให้เลือกหมวดหมู่ทั้งหมด
    };

    return (
        <div >
            <h1 className="text-2xl font-semibold text-yellow-700 mb-4">ค้นหาเมนู</h1>
            <input
                onChange={(e) => setText(e.target.value)} // เมื่อพิมพ์ในช่องค้นหา
                className="border rounded-md w-full mb-4 px-4 py-2 text-gray-700"
                type="text"
                placeholder="ค้นหาเมนูอาหาร"
                value={text} // ค่า text จะเก็บค่าจากช่องค้นหาตลอด
            />
            <hr className="my-4" />

            <div>
                <h1 className="text-xl font-semibold text-yellow-700 mb-4">ประเภทอาหาร</h1>

                {/* ปุ่มเลือกทั้งหมด */}
                <button
                    onClick={handleSelectAll}
                    className="mb-4 px-4 py-2 border rounded-md bg-yellow-500 text-white hover:bg-yellow-600 w-full sm:w-auto"
                >
                    เลือกทั้งหมด
                </button>

                {/* การจัดเรียงปุ่มประเภทอาหาร */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                    {Array.isArray(categories) &&
                        categories.map((cat, index) => (
                            <button
                                onClick={handleOnClick} // เรียกฟังก์ชันเมื่อกดปุ่มประเภท
                                key={index}
                                className={`px-4 py-2 border rounded-md ${catSelect.includes(cat.id) ? 'bg-yellow-500 text-white' : 'bg-yellow-100 hover:bg-yellow-200'} w-full`}
                                value={cat.id}
                            >
                                {cat.name}
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default SearchCard;
