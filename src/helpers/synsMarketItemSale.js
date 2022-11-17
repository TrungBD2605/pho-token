
require('dotenv').config({path: '.env.bsc'});

var NFTMarket = require("../abi/NFTMarket.json")
var ERC721 = require("../abi/ERC721.json")
var SmartContractABI = NFTMarket.abi;
var MarketItem = require("../models/MarketItem");
var Island = require("../models/Island");
var EventMarket = require("../events/eventMarket");
var EventNFT = require("../events/eventNftCustomer");
const { ethers } = require("ethers");


var axios = require("axios")
class SynsMarketItemSale {

  async sync() {
      try {
        await MarketItem.deleteMany();
        const provider = new ethers.providers.JsonRpcProvider(process.env.bnbstart_Testnet_Rpcurl);
        const contract = new ethers.Contract(process.env.bnbstart_SmartContractAddressNFTMartKet, SmartContractABI, provider);
        let listItemNFTSale = await contract.fechAllItems();
        var listItem = []
        await Promise.all(listItemNFTSale.map(async(item) => {
          try {
            let metadata = {}
            if(item.nftContract.toLowerCase()!==process.env.bnbstart_SmartContractAddressNFTOwner.toLowerCase()){
              var ERC721Contract = new ethers.Contract(item.nftContract, ERC721.abi, provider);
              let tokenUri = await ERC721Contract.tokenURI(item.tokenId);
              const res = await axios(tokenUri);
              metadata = await res.data;
            }else{
              metadata =  await Island.findOne({ 'key': parseInt( item.tokenId )})
            }
            listItem.push(new MarketItem({
              itemId:item.itemId,
              nftContract:item.nftContract,
              tokenId:item.tokenId,
              seller:item.seller,
              owner:item.owner,
              price:item.price,
              sold:item.sold,
              metadata : metadata,
            }))
          } catch (error) {
            console.log(error);
          }
        }));

      MarketItem.insertMany(listItem,function(error, docs) {
        if(error)console.log(error)
        else {
          console.log("Sync Market NFT")
          EventMarket.init();
          EventNFT.init();
        };
      });
      } catch (error) {
        console.log(error)
      }


  }
}
module.exports = new SynsMarketItemSale();