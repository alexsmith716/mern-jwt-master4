
const router = require('express').Router();

const AuthenticationController = require('./authentication.controller');

const passport = require('passport');
const passportService = require('./passport');
const requireSignin = passport.authenticate('local', { session: false });

console.log('>>> authentication.router.js <<< loaded');

// Layer path: '/'
router.post('/signin', requireSignin, AuthenticationController.signin);

router.post('/signup', AuthenticationController.signup);

module.exports = router;
