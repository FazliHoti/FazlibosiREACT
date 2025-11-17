import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';

export default function App() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        <SwiperSlide><img src="mhmt akf.jfif" class='img' />Slide 1</SwiperSlide>
        <SwiperSlide><img src="mhmt akf.jfif" class='img' />Slide 2</SwiperSlide>
        <SwiperSlide><img src="mhmt akf.jfif" class='img' />Slide 3</SwiperSlide>
        <SwiperSlide><img src="mhmt akf.jfif" class='img' />Slide 4</SwiperSlide>
        <SwiperSlide><img src="mhmt akf.jfif" class='img' />Slide 5</SwiperSlide>
      </Swiper>
      
    </>
  );
}
