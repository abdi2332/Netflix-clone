import React from 'react';
import './Popular.css';

const CustomPrevArrow = (props) => {
    const { onClick } = props;
  return (
    <div className='prev-arrow' onClick={onClick}>
      <button class="_slider-nav-btn_1225r_109 _left_1225r_124"><svg width="2.6em" height="4.7em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
    </div>
  );
};

const CustomNextArrow = (props) => {
    const { onClick } = props;
  return (
    <div className='next-arrow' onClick={onClick}>
    <button class="_slider-nav-btn_1225r_109 _right_1225r_127"><svg width="2.6em" height="4.7em" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
        <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
    </div>
  );
};

export { CustomPrevArrow, CustomNextArrow };
