const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middkeware/AuthMiddleware');


router.get('/getLikeByUser/:itemId',authMiddleware.isAuth,likeController.getLikeMarketItem)
router.post('/like',authMiddleware.isAuth,likeController.likeMarketItem)
router.post('/unlike',authMiddleware.isAuth,likeController.unlikeMarketItem)

module.exports = router
