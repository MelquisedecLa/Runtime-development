const express = require('express');
const router = express.Router();

const { 
    guessNumber, 
    resetGame 
} = require('../controller/controller');

router.post('/guess', guessNumber);
router.post('/reset', resetGame);

module.exports = router;