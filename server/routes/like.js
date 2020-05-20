const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');
const { auth } = require('../middleware/auth');

//=================================
//          Likes DisLikes
//=================================

router.post('/getLikes', async (req, res) => {
  let variable = {};
  if (req.body.productId) {
    variable = { productId: req.body.productId };
  } else {
    variable = { commentId: req.body.commentId };
  }

  await Like.find(variable).exec((err, likes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, likes });
  });
});

router.post('/getDislikes', async (req, res) => {
  let variable = {};
  if (req.body.productId) {
    variable = { productId: req.body.productId };
  } else {
    variable = { commentId: req.body.commentId };
  }

  await Dislike.find(variable).exec((err, dislikes) => {
    if (err) return res.status(400).send(err);
    res.status(200).json({ success: true, dislikes });
  });
});

router.post('/upLike', async (req, res) => {
  let variable = {};
  if (req.body.productId) {
    variable = { productId: req.body.productId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  const like = new Like(variable);
  //save the like information data in MongoDB
  await like.save((err, likeResult) => {
    if (err) return res.json({ success: false, err });
    //In case disLike Button is already clicked, we need to decrease the dislike by 1
    Dislike.findOneAndDelete(variable).exec((err, disLikeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

router.post('/unLike', async (req, res) => {
  let variable = {};
  if (req.body.productId) {
    variable = { productId: req.body.productId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  await Like.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/unDisLike', async (req, res) => {
  let variable = {};
  if (req.body.productId) {
    variable = { productId: req.body.productId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  await Dislike.findOneAndDelete(variable).exec((err, result) => {
    if (err) return res.status(400).json({ success: false, err });
    res.status(200).json({ success: true });
  });
});

router.post('/upDisLike', async (req, res) => {
  let variable = {};
  if (req.body.productId) {
    variable = { productId: req.body.productId, userId: req.body.userId };
  } else {
    variable = { commentId: req.body.commentId, userId: req.body.userId };
  }

  const disLike = new Dislike(variable);
  //save the like information data in MongoDB
  await disLike.save((err, dislikeResult) => {
    if (err) return res.json({ success: false, err });
    //In case Like Button is already clicked, we need to decrease the like by 1
    Like.findOneAndDelete(variable).exec((err, likeResult) => {
      if (err) return res.status(400).json({ success: false, err });
      res.status(200).json({ success: true });
    });
  });
});

module.exports = router;
