const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const findOrCreate = require('mongoose-findorcreate');

// reference to Schema
const Schema = mongoose.Schema;

// create user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  providerId: {
    type: String
  },
  passwordHash: {
    type: String
  }
});

// userSchema.plugin(findOrCreate);
userSchema.methods.setPassword = function(password) {
  this.passwordHash = bcrypt.hashSync(password, 8);
};

// authenticate individual users passwordHash
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// authenticate a user (static method)
userSchema.statics.authenticate = function(username, password) {
  return (
    User.findOne({
      username: username
    })
    // validate the user's password
    .then(user => {
      if (user && user.validatePassword(password)) {
        return user;
      } else {
        return null;
      }
    })
  );
};

// create user model
const User = mongoose.model('User', userSchema);

module.exports = User;
