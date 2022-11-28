const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const metadataController = require('../controllers/metadataController');
const upload = require('../middkeware/uploadMiddleware');
const authMiddleware = require('../middkeware/AuthMiddleware');

router.post('/getNftByAddress',nftController.getListOwnerNFT.bind(nftController))
router.post('/upload/image',authMiddleware.isAuth,upload.single("image"),metadataController.uploadImageNFT.bind(metadataController))
router.get('/:id',metadataController.getMetadataById)

module.exports = router
