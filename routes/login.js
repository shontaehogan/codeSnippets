const express = require('express');
const routes = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//boilerplate
passport.use(
  new LocalStrategy(function(email, password, done) {
    console.log('LocalStrategy', email, password);
    User.authenticate(email, password)
      // success!!
      .then(user => {
        if (user) {
          done(null, user);
        } else {
          done(null, null, { message: 'There was no user with this email and password.' });
        }
      })
      // there was a problem
      .catch(err => done(err));
  })
);

// store the user's id in the session
passport.serializeUser((user, done) => {
  console.log('serializeUser');
  done(null, user.id);
});

// get the user from the session based on the id
passport.deserializeUser((id, done) => {
  console.log('deserializeUser');
  User.findById(id).then(user => done(null, user));
});

// local login form
routes.get('/login', (req, res) => {
  //console.log('errors:', res.locals.getMessages());
  res.render('login', { failed: req.query.failed });
});

routes.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?failed=true',
    failureRedirect: '/register?failed=true',
    failureFlash: true
  })
);

// log out!!!!!
routes.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = routes;
