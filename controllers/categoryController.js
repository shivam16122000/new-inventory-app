let Category = require('../model/category');
let Item = require('../model/item');

var async = require('async');

const { body, validationResult } = require('express-validator');

//display list of all category
exports.category_list = function (req, res, next) {
  Category.find().exec(function (err, list_category) {
    if (err) {
      return next(err);
    }
    //succesfull,so render
    res.render('category', {
      
      category_list: list_category,
    });
  });
};

//display category detail of single item
exports.category_detail = function (req, res, next) {
  async.parallel(
    {
      category: function (callback) {
        Category.findById(req.params.id).exec(callback);
      },
      items: function (callback) {
        Item.find({ category: req.params.id }).exec(callback);
      },
    },
    function (err, result) {
      if (err) {
        return next(err);
      }

      res.render('category_detail', {
        category_detail: result.category,
        item_detail: result.items,
      });
    }
  );
};

exports.category_create = function (req, res, next) {
  res.render('category_form');
};

exports.category_create_post = function (req, res, next) {
 
  Category.findOne({ 'name': req.body.name,'description':req.body.description }).exec(function (err, result) {
    if (err) {
      return next(err);
    }
    if (result) {
      res.redirect(result.url);
    } else {
      let category = new Category({
        name: req.body.name,
        description: req.body.description,
      });
      category.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(category.url);
      });
    }
  });
};

exports.category_delete = function(req,res,next){
  async.parallel({
    category:function(callback){
      Category.findById(req.params.id).exec(callback);
    },
    items:function(callback){
      Item.find({category : req.params.id}).exec(callback);
    },
  },function(err,result){
    if(err){
      return next(err);
    }
    res.render('category_delete_form',{category:result.category,items:result.items});
  });
 
  
};

exports.delete = function(req,res,next){
  Category.findByIdAndRemove(req.params.id, function(err){
    if(err){
      return next(err);
    }
    res.redirect('/catalog');
  })
};
