import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import Axios from 'axios';

function Favorite(props) {
  const [FavoriteNumber, setFavoriteNumber] = useState(0);
  const [Favorited, setFavorited] = useState(false);

  const variables = {
    userFrom: props.userFrom,
    productId: props.productId,
    productTitle: props.detail.title,
    productImage: props.detail.images,
  };

  const onClickFavorite = () => {
    if (!Favorited) {
      Axios.post('/api/favorite/addToFavorite', variables).then((response) => {
        if (response.data.success) {
          // console.log(response.data);
          setFavorited(true);
          setFavoriteNumber(FavoriteNumber + 1);
          message.success('Added To Favorite!');
        } else {
          alert('Failed to add to favorite');
        }
      });
    } else {
      Axios.post('/api/favorite/removeFromFavorite', variables).then(
        (response) => {
          if (response.data.success) {
            // console.log(response.data);
            setFavorited(false);
            setFavoriteNumber(FavoriteNumber - 1);
            message.success('Removed From Favorite!');
          } else {
            alert('Failed to remove from favorite ');
          }
        }
      );
    }
  };

  useEffect(() => {
    Axios.post('/api/favorite/favoriteNumber', variables).then((response) => {
      if (response.data.success) {
        setFavoriteNumber(response.data.favoriteNumber);
      } else {
        alert('Failed to get favorite Number');
      }
    });

    Axios.post('/api/favorite/favorited', variables).then((response) => {
      if (response.data.success) {
        setFavorited(response.data.favorited);
      } else {
        alert('Failed to get favorite info');
      }
    });
  }, []);

  return (
    <div style={{ marginTop: '8px', cursor: 'auto' }}>
      <Button onClick={onClickFavorite}>
        {Favorited ? 'Remove from Favorite' : 'Add to Favorite'}
      </Button>
    </div>
  );
}

export default Favorite;
