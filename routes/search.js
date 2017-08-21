const express = require('express');
const routes = express.Router();
const Snippet = require('../models/snippet');
const Users = require('../models/users');

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);

routes.get('/search', (req, res) => {
  // If req.query.mySnippets is set, look through mongo to find any snippets
  // whose titles match
  let search = req.query.mySnippets;

  Snippet.find({
      author: req.user.username,
      $or: [{
        'language': search
      }, {
        tags: search
      }]
    })
    .then(snippets => res.render('search', {
      snippets: snippets
    }))
    .catch(err => res.send('Can not find snippet.'));
});

module.exports = routes;
