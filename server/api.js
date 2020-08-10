require('dotenv').config();
const router = require('express').Router();

const BoardPair = require('./models/BoardPair');


router.get('/test', async (req, res) => {
  return res.send('Bidfriday backend test route');
});



router.post('/sync-boardpairs', async (req, res) => {
  let pairs = req.body;
  let r;
  let ret = [];
  for (let pair of pairs) {
    r = await BoardPair.findOne({ requestBoard: pair.requestBoard })
    if (!r) {
      r = new BoardPair({ requestBoard: pair.requestBoard });
    }
    if (r.bidsBoard !== pair.bidsBoard) {
      r.bidsBoard = pair.bidsBoard;
      await r.save();
    }
    ret.push(r);
  }
  return res.send(ret);
});



module.exports = router;