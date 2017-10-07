
const jwt = require('jwt-simple');
const User = require('./user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.secret);
}

exports.signin = function(req, res, next) {
  console.log('>>> authentication.controller.js <<< signin');
  // User has already had their email and password auth'd
  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {

  console.log('>>> authentication.controller.js <<< signup');

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    console.log('>>> authentication.controller.js <<< !email || !password');
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with a given email exists
  User.findOne({ email: email }, function(err, existingUser) {

    if (err) { 
      console.log('>>> authentication.controller.js <<< err1');
      return next(err); 
    }

    // If a user with email does exist, return an error
    if (existingUser) {
      console.log('>>> authentication.controller.js <<< existingUser');
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err) {

      if (err) { 
        console.log('>>> authentication.controller.js <<< err2');
        return next(err); 
      }

      console.log('>>> authentication.controller.js <<< user.saved');
      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });

  });
}
