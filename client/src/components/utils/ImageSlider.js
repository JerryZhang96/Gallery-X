import React from 'react';
import { Carousel } from 'antd';

function ImageSlider(props) {
  return (
    <div>
      <Carousel autoplay>
        {props.images.map((image, index) => (
          <div key={index}>
            <img
              style={{ width: '100%', height: '450px' }}
              src={`https://pern-stack-blog-files.s3.amazonaws.com/${image}`}
              alt='productImage'
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
