require('dotenv').config({path: '.env.bsc'});

var ERC721Customer = require("../abi/ERC721CUSTOMER.json")
var Metadata = require("../models/Metadata");
const { ethers } = require("ethers");

class nftController {

    async getListOwnerNFT(req, res){
        console.log(this);
        try {
            if(!Number.isInteger(req.body.offset)|| !Number.isInteger(req.body.limit)|| !req.body.address){
                return res.json({result:false, data:"Wrong parameters!"});
            }
            const provider = new ethers.providers.JsonRpcProvider(process.env.bnbstart_Testnet_Rpcurl);
            const contract = new ethers.Contract(process.env.bnbstart_SmartContractAddressNFTCustomer, ERC721Customer.abi, provider);
            var countNFTByAddress = await contract.balanceOf(req.body.address);
            if(this.isNumeric(parseInt(countNFTByAddress)) && parseInt(countNFTByAddress)>0){
                var arrayIndexNFT = [...Array(parseInt(countNFTByAddress)).keys()]
                var listIdNFTByAddress = [];
                await Promise.all(arrayIndexNFT.map(async(item) => {
                    var idNFT = await contract.tokenOfOwnerByIndex(req.body.address,item);
                    listIdNFTByAddress.push(parseInt(idNFT));
                }));
                var data = await Metadata.find({key:{"$in" : listIdNFTByAddress}}).limit(req.body.limit).skip(parseInt(req.body.offset));
                var countNft = await Metadata.countDocuments({key:{"$in" : listIdNFTByAddress}})
                return res.json({
                    data : data,
                    total : countNft
                });

            }else{
                throw "countNFTByAddress is not number";
            }
        } catch (error) {
            res.json([]);
        }
 
    }
    isNumeric(val) {
        return /^-?\d+$/.test(val);
    }
}
module.exports = new nftController()