const express = require('express');
const router = express.Router();
const authetication = require('../middleware/auth');
const user = require('../controllers/user');

module.exports = (io) => {

router.post('/signup' , user.signup(io) );
router.post('/login' , user.login );
router.get('/profile' ,authetication.authenticate, user.getProfile);
router.get('/get-all-profile' ,authetication.authenticate, user.getAllProfiles);
router.put('/update-profile' , authetication.authenticate, user.updateProfile(io));

return router ;
}