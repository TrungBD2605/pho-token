const express = require('express');
const router = express.Router();
const marketItemController = require('../controllers/marketItemController');

router.get('/listMarketItem',marketItemController.getListMarketItem)
router.post('/listMarketItemPage',marketItemController.getListMarketItemPaging.bind(marketItemController))
router.post('/mynft',marketItemController.getListMyNftPaging)
router.post('/itemcreated',marketItemController.getListMyItemsCreated)
router.get('/:id',marketItemController.getMarketItemById)

module.exports = router
