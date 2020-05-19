import React from 'react';
import { Carousel } from 'antd';

function ImageSlider(props) {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <div key={index}>
            <img
              style={{ width: '100%', height: '350px' }}
              src={`https://gallery-x.herokuapp.com/${image}`}
              alt='productImage'
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
