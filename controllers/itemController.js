let Category = require('../model/category');
let Item = require('../model/item');

var async = require('async');

const { body, validationResult } = require('express-validator');

//Display Item Details

exports.item_detail = function (req, res, next) {
  Item.findById(req.params.id)
    .populate('category')
    .exec(function (err, result) {
      if (err) {
        return next(err);
      }
      res.render('item_detail', { item_detail: result });
    });
};

exports.item_list = function(req,res,next){
  Item.find()
  .populate('category')
  .exec(function(err,results){
    if(err){
      return next(err);
    }
    res.render('item_list',{item_list:results});
  })
}

exports.item_create = function(req,res,next){
  Category.find()
  .exec(function(err,result){
    if(err){
      return next(err);
    }
    res.render('item_form',{category:result});
  });
  
}

exports.item_create_post = [
  (req,res,next)=>{
    if(!(req.body.category instanceof Array)){
      if(typeof req.body.category ==='undefined')
      req.body.category = [];
      else
      req.body.category = new Array(req.body.category);
  }
  next();

  },
  //validate and sanitize field
  body('name','name must not be empty.').trim().isLength({min:1}).escape(),
  body('description','description must not be empty.').trim().isLength({min:1}).escape(),
  body('category.*').escape(),

  (req,res,next)=>{
    const errors = validationResult(req);

    let item=new Item({
      name:req.body.name,
      description:req.body.description,
      img_url:req.body.img_url,
      category:req.body.category,
      imdb:req.body.imdb,
  
    });

    if(!errors.isEmpty()){
      Category.find().exec(
        function(err,result){
          if(err){
            return next(err);
          }
          for(let i=0;i<result.length;i++){
            if(item.category.indexOf(result[i]._id)>-1){
              result[i].checked='true';
            }
          }
          res.render('item_form',{itemname:item.name,itemimdb:item.imdb,itemurl:item.img_url,itemdescription:item.description,category:result,errors:errors.array()});
        }
      );
      return;
    }else{
      item.save(function(err){
        if(err){
          return next(err);
        }
        res.redirect(item.url);
      });
    }
  }
];


exports.item_delete = function(req,res,next){
  Item.findById(req.params.id).exec(
    function(err,result){
      if(err){
        return next(err);
      }
      res.render('item_delete',{item:result});
    }
  );
  
};

exports.delete = function(req,res,next){
  Item.findByIdAndRemove(req.params.id,function(err){
    if(err){
      return next(err);
    }
    res.redirect('/catalog/item_list');
  })
}

exports.item_update = function(req,res,next){
  Category.find().exec(
    function(err,result){
      if(err){
        return next(err);
      }
      Item.findById(req.params.id).exec(function(err,item){
        if(err){
          return next(err);
        }
        for(let i=0;i<result.length;i++){
          for(let j=0;j<item.category.length;j++){
            if(result[i]._id.toString()===item.category[j].toString()){
              result[i].checked='true';
            }
          }
        }
        res.render('item_form',{category:result,itemname:item.name,itemurl:item.img_url,itemimdb:item.imdb,itemdescription:item.description});

      });
    }
  );
};

exports.item_update_post = [
  (req,res,next)=>{
    if(!(req.body.category instanceof Array)){
      if(typeof req.body.category ==='undefined')
      req.body.category = [];
      else
      req.body.category = new Array(req.body.category);
  }
  next();


  },
  body('name','name must not be empty.').trim().isLength({min:1}).escape(),
  body('description','description must not be empty.').trim().isLength({min:1}).escape(),
  body('category.*').escape(),

  (req,res,next)=>{
    const errors = validationResult(req);

    let item = new Item({
      name:req.body.name,
      description:req.body.description,
      category:req.body.category,
      img_url:req.body.img_url,
      imdb:req.body.imdb,
      _id:req.params.id
  
    });

    if(!errors.isEmpty()){
      Category.find().exec(
        function(err,result){
          if(err){
            return next(err);
          }
          for(let i=0;i<result.length;i++){
            if(item.category.indexOf(result[i]._id)>-1){
              result[i].checked='true';
            }
          }
          res.render('item_form',{itemname:item.name,itemimdb:item.imdb,itemurl:item.img_url,itemdescription:item.description,category:result,errors:errors.array()});
        }
      );
      return;
    }else{
      Item.findByIdAndUpdate(req.params.id,item,{},function(err,theitem){
        if(err){
          return next(err);
        }
        res.redirect(theitem.url);
      });
    }
  }

  
];
