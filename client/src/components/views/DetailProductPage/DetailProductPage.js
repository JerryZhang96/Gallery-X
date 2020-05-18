import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import Axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import Comments from './Sections/Comments';
import LikeDislike from './Sections/LikeDislike';
import Favorite from './Sections/Favorite';

function DetailProductPage(props) {
  const productId = props.match.params.productId;
  const [Product, setProduct] = useState([]);
  const [CommentLists, setCommentLists] = useState([]);

  const productVariable = {
    productId: productId,
  };

  useEffect(() => {
    Axios.get(`/api/product/products_by_id?id=${productId}&type=single`).then(
      (response) => {
        setProduct(response.data[0]);
        // console.log(response.data);
      }
    );

    Axios.post('/api/comment/getComments', productVariable).then((response) => {
      if (response.data.success) {
        setCommentLists(response.data.comments);
      } else {
        alert('Failed to get comment info');
      }
    });
  }, []);

  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment));
  };

  return (
    <div className='postPage' style={{ width: '100%', padding: '3rem 4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>{Product.title}</h1>
      </div>

      <br />

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          <ProductImage detail={Product} />
        </Col>
        <Col lg={12} xs={24}>
          <ProductInfo detail={Product} />
        </Col>
        <Col lg={12} xs={24}>
          <LikeDislike
            product
            productId={productId}
            userId={localStorage.getItem('userId')}
          />
          <Favorite
            userFrom={localStorage.getItem('userId')}
            productId={productId}
            detail={Product}
          />
        </Col>
        <Col lg={12} xs={24}>
          <Comments
            CommentLists={CommentLists}
            postId={Product._id}
            refreshFunction={updateComment}
          />
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
