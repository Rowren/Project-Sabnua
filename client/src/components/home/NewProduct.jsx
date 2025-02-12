import React, { useEffect, useState } from "react";
import { listProductBy } from "../../api/product";
import SwiperShowProduct from "../../utils/SwiperShowProduct";
import { SwiperSlide } from "swiper/react";
import ProductCardHome from "../../components/home/ProductCardHome";

const NewProduct = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await listProductBy("createdAt", "desc", 6);
      setData(res.data);
    } catch (err) {
      console.error("Error loading new products:", err);
    }
  };

  return (
    <div className="w-full py-10">
    <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
      เมนูใหม่
    </h2>
    {data.length > 0 ? (
      <SwiperShowProduct>
        {data.map((item) => (
          <SwiperSlide key={item.id}>
            <ProductCardHome product={item} />
          </SwiperSlide>
        ))}
      </SwiperShowProduct>
    ) : (
      <div className="flex justify-center items-center h-40 text-lg text-gray-600">
        กำลังโหลดสินค้า...
      </div>
    )}
  </div>
  );
};

export default NewProduct;
