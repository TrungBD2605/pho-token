require('dotenv').config({path: '.env.bsc'});
var NFTMarket = require("../abi/NFTMarket.json")
var ERC721 = require("../abi/ERC721.json")
var NFTMarket = require("../abi/NFTMarket.json")
var axios = require("axios")
var Island = require("../models/Island");
var MarketItem = require("../models/MarketItem");
const { ethers } = require("ethers");

class EventMarket {
    init(){
        this.marketItemCreated();
        this.marketItemSold();
    }
    async getMetadata(item, provider){
        try {
            var metadata;
            if(item.nftContract.toLowerCase()!==process.env.bnbstart_SmartContractAddressNFTOwner.toLowerCase()){
                const ERC721Contract = new ethers.Contract(item.nftContract, ERC721.abi, provider);
                let tokenUri = await ERC721Contract.tokenURI(item.tokenId);
                const res = await axios(tokenUri);
                metadata = await res.data;
              }else{
                metadata =  await Island.findOne({ 'key': parseInt(item.tokenId) })
              }
            return metadata;
        } catch (error) {
            return {}
        }

    }
    async checkSoldOnChain(item, contract){
        try {
            var itemNFTSale = await contract.idToMarketItem(item.itemId);
            return itemNFTSale.sold;
        } catch (error) {
            return false;
        }

    }
    async marketItemCreated(){
        try {
            var that = this;    
            setInterval(async () => {
                try {
                    const provider = new ethers.providers.JsonRpcProvider(process.env.bnbstart_Testnet_Rpcurl);
                    const contract = new ethers.Contract(process.env.bnbstart_SmartContractAddressNFTMartKet, NFTMarket.abi, provider);
                    let marketItemCreated = await contract.filters.MarketItemCreated();
                    const endBlock = await provider.getBlockNumber();
                    let events = await contract.queryFilter(marketItemCreated, endBlock-10 , endBlock );
                    events.forEach(async event => {
                        try {
                         var sold = await that.checkSoldOnChain(event.args,contract);
                         if(sold)return;
                         var market = await MarketItem.findOne({ 'itemId': event.args.itemId })
                         if(!market){
                             let metadata = await that.getMetadata(event.args);
                             var newMarketItem = new MarketItem({
                                 itemId:event.args.itemId,
                                 nftContract:event.args.nftContract,
                                 tokenId:event.args.tokenId,
                                 seller:event.args.seller,
                                 owner:event.args.owner,
                                 price:event.args.price,
                                 sold:event.args.sold,
                                 currencySell:event.args.sold.currencySell,
                                 metadata : metadata,
                               })
                               newMarketItem.save();
                         }
                        } catch (error) {
                            
                        }

                    });
                    console.log(events);
                } catch (error) {
                    console.log(error)
                }

            }, 10000);

        } catch (error) {
            console.log(error)
        }

    }
    async marketItemSold(){
        setInterval(async () => {
            try {
                const provider = new ethers.providers.JsonRpcProvider(process.env.bnbstart_Testnet_Rpcurl);
                const contract = new ethers.Contract(process.env.bnbstart_SmartContractAddressNFTMartKet, NFTMarket.abi, provider);
                let marketItemSold = await contract.filters.MarketItemSold();
                const endBlock = await provider.getBlockNumber();
                let events = await contract.queryFilter(marketItemSold, endBlock-10 , endBlock );
                events.forEach(async event => {
                    try {
                     let marketItem = await MarketItem.findOneAndUpdate({itemId:parseInt(event.args.itemId)},{
                         sold:true,
                         owner:event.args.owner
                      })
                    } catch (error) {
                        console.log(error)
                    }

                });
                console.log(events);
            } catch (error) {
                
            }

        }, 10000);

    }
}
module.exports = new EventMarket();