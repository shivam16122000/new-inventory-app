let express = require('express');
let router = express.Router();

let categoryController = require('../controllers/categoryController');
let itemController = require('../controllers/itemController');

router.get('/', categoryController.category_list);
router.get('/category/create', categoryController.category_create);

router.get('/category/delete/:id',categoryController.category_delete);
router.get('/category/:id', categoryController.category_detail);
router.get('/item/update/:id',itemController.item_update);
router.get('/item/delete/:id',itemController.item_delete);
router.get('/item_list',itemController.item_list);
router.get('/item/create',itemController.item_create);
router.get('/item/:id', itemController.item_detail);




router.post('/category/create', categoryController.category_create_post);
router.post('/item/update/:id',itemController.item_update_post);
router.post('/item/create',itemController.item_create_post);
router.post('/category/delete/:id',categoryController.delete);
router.post('/item/delete/:id',itemController.delete);

module.exports = router;
