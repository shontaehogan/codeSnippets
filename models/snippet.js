const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// get a reference to Schema
const Schema = mongoose.Schema;

// create a schema for a snippet
const snippetSchema = new Schema({
  id: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  language: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: true,
    default: []
  },
  author: {
    type: String,
    required: true
  }
});

// create a model for a Snippet
const Snippet = mongoose.model('Snippet', snippetSchema);

module.exports = Snippet;
