import React, { useEffect, useState } from 'react';
import useSabnuaStore from '../../store/SabnuaStore';

const SearchCard = () => {
    const getProducts = useSabnuaStore((state) => state.getProducts);
    const actionSearchFilters = useSabnuaStore((state) => state.actionSearchFilters);
    const getCategory = useSabnuaStore((state) => state.getCategory);
    const categories = useSabnuaStore((state) => state.categories);

    const [text, setText] = useState('');
    const [catSelect, setCatSelect] = useState([]);

    useEffect(() => {
        getCategory();
    }, []);

    // Step 1: Search by Text and Category
    useEffect(() => {
        const delay = setTimeout(() => {
            if (text || catSelect.length > 0) {
                actionSearchFilters({ query: text, category: catSelect });
            } else {
                getProducts();
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [text, catSelect]);

    // Step 2: Search by Category
    const handleOnClick = (e) => {
        const inClick = e.target.value;
        const inState = [...catSelect];
        const findClick = inState.indexOf(inClick);

        // เพิ่มหมวดหมู่ถ้ายังไม่เคยเลือก, หรือเอาออกถ้าหมวดหมู่นั้นถูกเลือกอยู่แล้ว
        if (findClick === -1) {
            inState.push(inClick);
        } else {
            inState.splice(findClick, 1);
        }

        setCatSelect(inState); // อัปเดตหมวดหมู่ที่เลือก
        actionSearchFilters({ category: inState, query: text });
    };

    return (
        <div>
            <h1 className="text-xl font-semibold text-yellow-700 mb-4">ค้นหาเมนู</h1>
            <input
                onChange={(e) => setText(e.target.value)}
                className="border rounded-md w-full mb-4 px-4"
                type="text"
                placeholder="ค้นหาเมนูอาหาร"
            />
            <hr />

            <div>
                <h1 className="text-xl font-semibold text-yellow-700 mb-4">ประเภทอาหาร</h1>
                <div className="flex gap-2">
                    {Array.isArray(categories) &&
                        categories.map((cat, index) => (
                            <button
                                onClick={handleOnClick}
                                key={index}
                                className="px-4 py-2 border rounded-md bg-yellow-100 hover:bg-yellow-200"
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
