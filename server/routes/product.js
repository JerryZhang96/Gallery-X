const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const config = require('../config/key');
const { Product } = require('../models/Product');
const { auth } = require('../middleware/auth');

// var storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   },
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     if (ext !== '.jpg' || ext !== '.png') {
//       return cb(res.status(400).end('only jpg, png are allowed'), false);
//     }
//     cb(null, true);
//   },
// });

// var upload = multer({ storage: storage }).single('file');

//=================================
//             Product
//=================================

// router.post('/uploadImage', auth, (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.json({ success: false, err });
//     }
//     return res.json({
//       success: true,
//       image: res.req.file.path,
//       fileName: res.req.file.filename,
//     });
//   });
// });

// PROFILE IMAGE STORING STARTS
const s3 = new aws.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  Bucket: config.AWS_STORAGE_BUCKET_NAME,
});

// Single Upload
const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: config.AWS_STORAGE_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single('file');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb({ msg: 'Images Only' });
  }
}

// Upload post image
router.post('/uploadImage', auth, (req, res) => {
  uploadImage(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    } else {
      // If Success
      const imageName = req.file.key;
      const imageLocation = req.file.location;
      // Save the file name into database into profile model
      res.json({
        success: true,
        image: imageName,
        location: imageLocation,
      });
    }
  });
});

router.post('/uploadProduct', auth, (req, res) => {
  const product = new Product(req.body);

  product.save((err, product) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true, product });
  });
});

router.post('/getProducts', (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);

  let findArgs = {};
  let term = req.body.searchTerm;

  for (let key in req.body.filters) {
    // console.log(key);
    if (req.body.filters[key].length > 0) {
      // if (key === 'price') {
      //   findArgs[key] = {
      //     $gte: req.body.filters[key][0],
      //     $lte: req.body.filters[key][1],
      //   };
      // } else {}
      findArgs[key] = req.body.filters[key];
    }
  }

  // console.log(findArgs);

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  } else {
    Product.find(findArgs)
      .populate('writer')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec((err, products) => {
        if (err) return res.status(400).json({ success: false, err });
        res
          .status(200)
          .json({ success: true, products, postSize: products.length });
      });
  }
});

router.get('/products_by_id', (req, res) => {
  let type = req.query.type;
  let productIds = req.query.id;

  // console.log('req.query.id', req.query.id);

  if (type === 'array') {
    let ids = req.query.id.split(',');
    productIds = [];
    productIds = ids.map((item) => {
      return item;
    });
  }

  console.log('productIds', productIds);

  //we need to find the product information that belong to product Id
  Product.find({ _id: { $in: productIds } })
    .populate('writer')
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
