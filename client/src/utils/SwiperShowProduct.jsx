import React from "react";
import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

const SwiperShowProduct = ({ children }) => {
  return (
    <Swiper
      slidesPerView={5}
      spaceBetween={10}
      pagination={{ clickable: true }}
      navigation
      modules={[Pagination, Autoplay, Navigation]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      breakpoints={{
        320: { slidesPerView: 2, spaceBetween: 20 },
        640: { slidesPerView: 3, spaceBetween: 20 },
        768: { slidesPerView: 4, spaceBetween: 40 },
        1024: { slidesPerView: 5, spaceBetween: 50 },
        1280: { slidesPerView: 6, spaceBetween: 50 },
      }}
      className="mySwiper object-cover rounded-md"
    >
      {children}
    </Swiper>
  );
};

export default SwiperShowProduct;
