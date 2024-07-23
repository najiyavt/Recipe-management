const express = require('express');
const router = express.Router();
const authetication = require('../middleware/auth');
const review = require('../controllers/review');


    router.post('/add-review', authetication.authenticate , review.addReview );
    router.get('/get-review/:id' , review.getReview );

module.exports=router;