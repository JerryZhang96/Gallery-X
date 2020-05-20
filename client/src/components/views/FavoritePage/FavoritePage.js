import React, { useEffect, useState } from 'react';
import { Typography, Popover, Button, message } from 'antd';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './favorite.css';

const { Title } = Typography;

function FavoritePage() {
  const user = useSelector((state) => state.user);

  const [Favorites, setFavorites] = useState([]);
  const [Loading, setLoading] = useState(true);
  let variable = { userFrom: localStorage.getItem('userId') };

  useEffect(() => {
    fetchFavoredProduct();
  }, []);

  const fetchFavoredProduct = () => {
    axios.post('/api/favorite/getFavoredProduct', variable).then((response) => {
      if (response.data.success) {
        setFavorites(response.data.favorites);
        setLoading(false);
      } else {
        alert('Failed to get favorite gallery');
      }
    });
  };

  const onClickDelete = (productId, userFrom) => {
    const variables = {
      productId: productId,
      userFrom: userFrom,
    };

    axios
      .post('/api/favorite/removeFromFavorite', variables)
      .then((response) => {
        if (response.data.success) {
          fetchFavoredProduct();
          message.success('Gallery has been removed!');
        } else {
          alert('Failed to Remove From Favorite');
        }
      });
  };

  const renderCards = Favorites.map((favorite, index) => {
    const content = (
      <div>
        {/* {console.log(favorite)} */}
        {favorite.productImage ? (
          <img
            style={{
              display: 'flex',
              width: '350px',
              height: '240px',
              overflowX: 'auto',
            }}
            src={`https://pern-stack-blog-files.s3.amazonaws.com/${favorite.productImage[0]}`}
          />
        ) : (
          'no image'
        )}
      </div>
    );

    return (
      <tr key={index}>
        <Popover content={content} title={`${favorite.productTitle}`}>
          <td>
            <a href={`/product/${favorite.productId}`}>
              {favorite.productTitle}
            </a>
          </td>
        </Popover>
        <td>
          <Button
            onClick={() => onClickDelete(favorite.productId, favorite.userFrom)}
          >
            Remove
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ width: '85%', margin: '3rem auto' }}>
      <Title level={2}> Favorite Photo Gallery By Me </Title>
      <hr />
      {user.userData && !user.userData.isAuth ? (
        <div
          style={{
            width: '100%',
            fontSize: '2rem',
            height: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <p>Please Log in first...</p>
          <a href='/login'>Go to Login page</a>
        </div>
      ) : (
        !Loading && (
          <table>
            <thead>
              <tr>
                <th>Photo Gallery Title</th>
                <th>Remove From Favourite(s)</th>
              </tr>
            </thead>
            <tbody>{renderCards}</tbody>
          </table>
        )
      )}
    </div>
  );
}

export default FavoritePage;
