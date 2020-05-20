const express = require('express');
const router = express.Router();
const { Favorite } = require('../models/Favorite');
const { auth } = require('../middleware/auth');

//=================================
//             Favorite
//=================================

router.post('/favoriteNumber', auth, async (req, res) => {
  //Find Favorite information inside Favorite Collection by Product ID

  await Favorite.find({ productId: req.body.productId }).exec(
    (err, favorite) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, favoriteNumber: favorite.length });
    }
  );
});

router.post('/favorited', auth, async (req, res) => {
  // Find Favorite Information inside Favorite Collection by product Id , userFrom
  await Favorite.find({
    productId: req.body.productId,
    userFrom: req.body.userFrom,
  }).exec((err, favorite) => {
    if (err) return res.status(400).send(err);

    //How can we know if I already favorite this product or not ?
    let result = false;
    if (favorite.length !== 0) {
      result = true;
    }

    res.status(200).json({ success: true, favorited: result });
  });
});

router.post('/addToFavorite', auth, async (req, res) => {
  console.log(req.body);

  const favorite = new Favorite(req.body);

  await favorite.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

router.post('/removeFromFavorite', auth, async (req, res) => {
  await Favorite.findOneAndDelete({
    productId: req.body.productId,
    userFrom: req.body.userFrom,
  }).exec((err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.post('/getFavoredProduct', auth, async (req, res) => {
  //Need to find all of the Users that I am subscribing to From Subscriber Collection
  await Favorite.find({ userFrom: req.body.userFrom }).exec(
    (err, favorites) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, favorites });
    }
  );
});

module.exports = router;
