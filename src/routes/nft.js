const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const metadataController = require('../controllers/metadataController');

router.post('/getNftByAddress',nftController.getListOwnerNFT.bind(nftController))
router.get('/:id',metadataController.getMetadataById)

module.exports = router
