import React from 'react';
import ContentCarousel from '../components/home/ContentCarousel';
import banner from '../assets/images/banner.png';
import banner1 from '../assets/images/banner1.png';
import banner2 from '../assets/images/banner2.png';
import BestSeller from '../components/home/BestSeller';
import NewProduct from '../components/home/NewProduct';

const Home = () => {
  const slides = [
    { image: banner },
    { image: banner1 },
    { image: banner2 },
  ];

  return (
    <div>
      <ContentCarousel slides={slides} />
      <BestSeller />
      <NewProduct />
      
    </div>
  );
};

export default Home;
