const express = require('express');
const router = express.Router();
const islandController = require('../controllers/islandController');

// router.get('/listIsland',islandController.getListIsland)
// router.get('/listIsland/:page',islandController.getListIslandPaging)
router.get('/:id',islandController.getIslandById)

module.exports = router
