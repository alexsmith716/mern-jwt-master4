
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('./user');

// Create local strategy
const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  
  console.log('>>> passport.js <<< localLogin');
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false

  User.findOne({ email: email }, function(err, user) {

    if (err) { 
      console.log('>>> passport.js <<< err1: ', err);
      return done(err); 
    }

    if (!user) {
      console.log('>>> passport.js <<< !user');
      return done(null, false);
    }

    // compare passwords - is `password` equal to user.password?
    user.comparePassword(password, function(err, isMatch) {

      if (err) { 
        console.log('>>> passport.js <<< err2: ', err);
        return done(err); 
      }

      if (!isMatch) {
        console.log('>>> passport.js <<< !isMatch');
        return done(null, false);
      }

      console.log('>>> passport.js <<< user');
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {

    if (err) { 
      console.log('>>> passport.js <<< err3: ', err);
      return done(err, false); 
    }

    if (user) {
      console.log('>>> passport.js <<< user: ', user);
      done(null, user);

    } else {
      console.log('>>> passport.js <<< err3: ');
      done(null, false);

    }
  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
