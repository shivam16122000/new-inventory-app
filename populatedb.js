#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true'
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');

var Item = require('./model/item');
var Category = require('./model/category');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var categories = [];
var items = [];

function categorycreate(name, description, cb) {
  categorydetail = { name: name, description: description };

  var category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('new category:' + category);
    categories.push(category);
    cb(null, category);
  });
}

function itemcreate(name, description, category, imdb, cb) {
  itemdetail = {
    name: name,
    description: description,
    category: category,
    imdb: imdb,
  };

  var item = new Item(itemdetail);
  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('new item:' + item);
    items.push(item);
    cb(null, item);
  });
}

function createCategory(cb) {
  async.series(
    [
      function (callback) {
        categorycreate(
          'Horror',
          'This films may incorporate incidents of physical violence and psychological terror',
          callback
        );
      },
      function (callback) {
        categorycreate(
          'Comedy',
          'These films are designed to make the audience laugh through amusement and most often work by exaggerating characteristics for humorous effect',
          callback
        );
      },
      function (callback) {
        categorycreate(
          'Action',
          'This films is closely associated with the thriller and adventure genres and they may also contain elements of drama and spy fiction',
          callback
        );
      },
      function (callback) {
        categorycreate(
          'Adventure',
          'This films whose plots feature elements of travel.',
          callback
        );
      },
    ],
    cb
  );
}

function createItem(cb) {
  async.series(
    [
      function (callback) {
        itemcreate(
          'Shazam!',
          'After being abandoned at a fair, Billy constantly searches for his mother. His life, however, takes a huge turn when he inherits the superpowers of a powerful wizard.',
          [categories[1]],
          7.0,
          callback
        );
      },
      function (callback) {
        itemcreate(
          'Annabelle',
          'John and Mia Form are attacked by a Satan worshipping couple, who uses their doll as a conduit to make their life miserable. This unleashes a string of paranormal events in the Forms residence.',
          [categories[0]],
          5.4,
          callback
        );
      },
      function (callback) {
        itemcreate(
          'Aquaman',
          'Half-human, half-Atlantean Arthur is born with the ability to communicate with marine creatures. He goes on a quest to retrieve the legendary Trident of Atlan and protect the water world.',
          [categories[2], categories[3]],
          6.9,
          callback
        );
      },
    ],
    cb
  );
}

async.series(
  [createCategory, createItem],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    } else {
      console.log('done');
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
