const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/register',userController.register)
router.post('/updatePassword',userController.updatePassword)
router.get('/checkMaping',userController.checkMapping)

module.exports = router
