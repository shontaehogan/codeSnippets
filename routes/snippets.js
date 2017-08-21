const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet')
const mongoose = require('mongoose');

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);
//retrieves a form
routes.get('/snippets/add', (req, res) => {

  // Check if req.query.id exists.  If so, load that snippet from mongo
  // and then send that object to the form.
  if (req.query.id) {
    Snippet.findById(req.query.id)
      // render form with this item
      .then(snippet => res.render('add', {
        snippet: snippet
      }));
  } else {
    res.render('add');
  }
});

routes.post('/snippets', (req, res) => {
  if (!req.body._id) {
    req.body._id = new mongoose.mongo.ObjectID();
  }

  req.body.author = req.user.username;
  console.log(req.body);

  req.body.tags = req.body.tags.filter((item) => {
    return item !== ''
  });

  Snippet.findByIdAndUpdate(req.body._id, req.body, {
      upsert: true
    })
    .then(() => res.redirect('/'))
    // catch validation errors
    .catch(err => {
      console.log(err);
      res.render('snippets', {
        errors: err.errors,
        item: req.body
      });
    });
});

routes.get('/deleteSnippet', (req, res) => {
  Snippet.findById(req.query.id).remove()
    // then redirect to the homepage
    .then(() => res.redirect('/'));
});

module.exports = routes;
