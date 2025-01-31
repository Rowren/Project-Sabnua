import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const ContentCarousel = ({ slides }) => {
  return (
    <div className="w-full bg-gray-100"> 
      <Swiper
        pagination={{ clickable: true }}
        navigation
        autoplay={{ delay: 3000 }}
        modules={[Pagination, Navigation, Autoplay]}
        className="mySwiper"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="flex justify-center items-center h-full bg-gray-200 rounded-lg shadow-lg"> {/* กำหนดความสูง 500px */}
              <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover rounded-lg" // ใช้ object-cover เพื่อให้ภาพครอบคลุมพื้นที่
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ContentCarousel;
