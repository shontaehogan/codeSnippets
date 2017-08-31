const express = require('express');
const routes = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet');
const flash = require('express-flash-messages');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const requireLogin = (req, res, next) => {
  console.log('req.user', req.user);
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);



routes.get('/list/add', (req, res) => {
    if (req.query.id) {
      Snippet.findById(req.query.id)
        // render form with this item
        .then(snippet => res.render('add', { user: request.user, snippets: snippets}));
    } else {
      res.render('add');
    }
});

routes.post('/snippets', (req, res) => {

  if (!req.body.id){
    req.body.id = new mongoose.mongo.ObjectID();
  }
  req.body.userID = req.user.id;
  Snippet.findByIdAndUpdate(req.body.id, req.body, { upsert: true })
    .then(() => res.redirect('/'))
    // catch validation errors
    .catch(err => {
      console.log(err);
      res.render('add', {
        errors: err.errors,
        snippet: req.body
      });
    });
});

routes.get('/delete', (req, res) => {
  Snippet.findById(req.query.id)
    .remove()
    .then(() => res.redirect('/snippetsList'));
});



module.exports = routes;
