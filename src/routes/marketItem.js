const express = require('express');
const router = express.Router();
const marketItemController = require('../controllers/marketItemController');

router.get('/listMarket',marketItemController.getListMarketItem)
router.post('/listMarketPage',marketItemController.getListMarketItemPaging)
router.get('/:id',marketItemController.getMarketItemById)

module.exports = router
