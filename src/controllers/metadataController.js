require('dotenv').config({path: '.env.bsc'});
var Metadata = require("../models/Metadata");
const Resize = require('../helpers/resize');
const path = require('path');
const fs = require('fs');
var ERC721Customer = require("../abi/ERC721CUSTOMER.json")
var User = require("../models/User");
const { ethers } = require("ethers");
var Metadata = require("../models/Metadata");

class MetadataController {

    getMetadataById(req,res){
        function isNumeric(val) {
            return /^-?\d+$/.test(val);
        }
        if(isNumeric(req.params.id)){
            Metadata.findOne({ 'key': req.params.id },(err, metadata) => {
                if(err){
                    res.json({result:false, msg:"err"});
                }else{
                    if(metadata){
                        res.json(metadata)
                    }else{
                        res.json({})
                    }
                }
            })
            
        }else{
            res.json({});
        }
    }
   async uploadImageNFT(req,res){
    try {
        if (!req.body.id || !this.isNumeric(req.body.id)) throw "Miss ID NFT";
        if (!req.file) throw 'Please provide an image';
        // folder upload
        const imagePath = path.join(path.resolve(__dirname,'..'), '/public/images');
        if(fs.existsSync(path.join(imagePath,`/${req.body.id}.png`))) throw "NFT already exist"
        var decoded = req.jwtDecoded;
        const userDecode = decoded.data;
        const provider = new ethers.providers.JsonRpcProvider(process.env.bnbstart_Testnet_Rpcurl);
        const contract = new ethers.Contract(process.env.bnbstart_SmartContractAddressNFTCustomer, ERC721Customer.abi, provider);
        var ownerNFT = await contract.ownerOf(parseInt(req.body.id));
        var user = await User.findById(userDecode._id)
        if(user.address !== ownerNFT) throw "Only owner NFT can upload image NFT"
        // call class Resize
        const fileUpload = new Resize(imagePath);
        const filename = await fileUpload.save(req.file.buffer, req.body.id);
        await Metadata.findOneAndUpdate({ key: parseInt(req.body.id) },{image : `${process.env.domain}images/${req.body.id}.png`})
        return res.status(200).json({ name: filename });
    } catch (error) {
        res.status(400).json({error: error});
    }
    }

    isNumeric(val) {
        return /^-?\d+$/.test(val);
    }
    
}
module.exports = new MetadataController();