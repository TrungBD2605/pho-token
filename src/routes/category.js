const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// router.get('/listIsland',islandController.getListIsland)
// router.get('/listIsland/:page',islandController.getListIslandPaging)
router.get('/',categoryController.getCategory)

module.exports = router
