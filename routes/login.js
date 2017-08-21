// PACKAGES
const express = require('express');
const routes = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');



//BOILERPLATE

// for passport
passport.use(new LocalStrategy(function(username, password, done) {
  User.authenticate(username, password)
    // success!
    .then(user => {
      if (user) {
        done(null, user);
      } else {
        done(null, null, {
          message: 'There was no user with this email and password.'
        });
      }
    })
    // there was a problem
    .catch(err => done(err));
}));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

// LOGIN

// local login form
routes.get('/login', (req, res) => {
  res.render('login', {
    failed: req.query.failed
  });
});

// endpoint for local login sumbit
routes.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?failed=true',
  failureFlash: true
}));

// log out
routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = routes;
