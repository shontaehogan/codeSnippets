const express = require('express');
const routes = express.Router();
const Snippet = require('../models/snippet');
const bodyParser = require('body-parser');

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

routes.use(requireLogin);

routes.get('/search', (req, res) => {

  let search = req.query.snippetsresults;

  Snippet.find({
      author: req.user.name,
      $or: [{
          'language': search
        },
        {
          'tags': search
        }, {
          'title': search
        },
        {
          'notes': search
        }, {
          'author': search
        }
      ]
    })

    .then(snippets => res.render('search', {
      snippets: snippets
    }))

    .catch(err => res.send('Snippet no found'));

});

module.exports = routes;
