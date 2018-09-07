const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  console.log('got something')
  res.send({ userData: req.user, token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  console.log('you want to sign up', req.body)
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    user.save(function(err, savedUser) {
      if (err) { return next(err); }
      console.log('do i have the users data?', savedUser)
      // Repond to request indicating the user was created
      let newU = {
        makerId: savedUser._id,
        email: savedUser.email
      }
      res.json({ userData: newU, token: tokenForUser(user)});
    });
  });
}