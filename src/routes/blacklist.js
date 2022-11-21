const express = require('express');
const router = express.Router();
const blackListController = require('../controllers/blacklistController');
const authMiddleware = require('../middkeware/AuthMiddleware');
const authAdmin = require('../middkeware/IsAdmin');


router.get('/get',blackListController.getBlackList)
router.post('/add',authMiddleware.isAuth,authAdmin.isAdmin,blackListController.addBlackList)
router.post('/remove',authMiddleware.isAuth,authAdmin.isAdmin,blackListController.removeBlackList)

module.exports = router
