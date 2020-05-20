const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Comment } = require('../models/Comment');
const { auth } = require('../middleware/auth');

//=================================
//             Comment
//=================================

router.post('/saveComment', async (req, res) => {
  const comment = new Comment(req.body);

  await comment.save((err, comment) => {
    if (err) return res.json({ success: false, err });

    Comment.find({ _id: comment._id })
      .populate('writer')
      .exec((err, result) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true, result });
      });
  });
});

router.post('/getComments', async (req, res) => {
  await Comment.find({ postId: req.body.productId })
    .populate('writer')
    .exec((err, comments) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, comments });
    });
});
module.exports = router;
