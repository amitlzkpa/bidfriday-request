require('dotenv').config();
const mongoose = require('mongoose');


const BoardPairSchema = new mongoose.Schema({
  requestBoard: {
    type: String,
    index: true
  },
  bidsBoard: {
    type: String,
    index: true,
  },
});


module.exports = mongoose.model('BoardPair', BoardPairSchema);