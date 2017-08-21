// ===========PACKAGES===========

const express = require('express');
const handlebars = require('express-handlebars');
const session = require('express-session');


const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('express-flash-messages');

const mongoose = require('mongoose');
const bluebird = require('bluebird');
mongoose.Promise = bluebird;

const User = require('./models/user');
const Snippet = require('./models/snippet');

const passport = require('passport');

const loginRoutes = require('./routes/login');
const snippetsRoutes = require('./routes/snippets');
const searchRoutes = require('./routes/search')

let url = 'mongodb://localhost:27017/codeSnippets';

// create express app
const app = express();


// =========BOILER PLATE===========

// for handlebars
app.engine('handlebars', handlebars());
app.set('views', './views');
app.set('view engine', 'handlebars');


// for express
app.use(express.static('public'));

//for bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// for express-session
app.use(session({
  //in the future this is not how to store passwords
  secret: 'password',
  resave: false, // doesn't save without changes
  saveUninitialized: true // creates a session
}));


// for express-validator
app.use(expressValidator());

//for passport
app.use(passport.initialize());

//for passport session
app.use(passport.session());

//for flash
app.use(flash());

console.log('test');
// ============= ENDPOINTS ===============

const requireLogin = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get('/', requireLogin, function(req, res) {
  // TODO: Find the active template
  Snippet.find({
      author: req.user.username
    })
    .then((snippets) => {
      res.render('home', {
        user: req.user,
        snippets: snippets
      })
    })
    .catch(err => res.send('Can not find snippets'));
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  let user = new User(req.body);
  user.provider = 'local';
  user.setPassword(req.body.password);

  user.save()
    // good
    .then(() => res.redirect('/'))
    // no good
    .catch(err => console.log(err));
});

app.use('/', loginRoutes);
app.use('/', snippetsRoutes);
app.use('/', searchRoutes);

//APP
mongoose.connect(url, (err, connection) => {
    if (!err) {
      console.log('connected to Mongo');
    });
};
// ============== LISTEN =================

// connect to mongo via mongoose
mongoose.connect('mongodb://localhost:27017/codeSnippets', {
  useMongoClient: true
})
then(() => app.listen(3000, function() {
console.log('Winning!')
});));
