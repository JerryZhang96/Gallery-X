import React, { useEffect, useState } from 'react';
// import moment from 'moment';
import { Descriptions } from 'antd';

function ProductInfo(props) {
  const [Product, setProduct] = useState({});

  useEffect(() => {
    setProduct(props.detail);
  }, [props.detail]);

  // console.log(props.detail);

  // const addToCartHandler = () => {
  //   props.addToCart(props.detail._id);
  // };

  return (
    <div>
      <Descriptions title='Gallery Info'>
        {/* <Descriptions.Item label='Time'>
          {moment.utc(Product.createadAt).fromNow()}
        </Descriptions.Item> */}
        {/* <Descriptions.Item label='Author'>{Product.writer}</Descriptions.Item> */}
        {/* <Descriptions.Item label='View'> {Product.views}</Descriptions.Item> */}
        <Descriptions.Item>{Product.description}</Descriptions.Item>
      </Descriptions>

      {/* <br />
      <br />
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          size='large'
          shape='round'
          type='danger'
          onClick={addToCartHandler}
        >
          Add to Cart
        </Button>
      </div> */}
    </div>
  );
}

export default ProductInfo;
