const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = mongoose.Schema({
  userFrom: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: String,
  },
  productTitle: {
    type: String,
  },
  productImage: {
    type: Array,
    default: [],
  },
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite };
