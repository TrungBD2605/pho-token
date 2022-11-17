require('dotenv').config({path: '.env.bsc'});
var ERC721Customer = require("../abi/ERC721CUSTOMER.json")
var Metadata = require("../models/Metadata");
const { ethers } = require("ethers");

class EventNFT {
    init(){
        this.nftCreated();
    }

    async nftCreated(){
        try {
        setInterval(async () => {
                try {
                    
                    const provider = new ethers.providers.JsonRpcProvider(process.env.bnbstart_Testnet_Rpcurl);
                    const contract = new ethers.Contract(process.env.bnbstart_SmartContractAddressNFTCustomer, ERC721Customer.abi, provider);
                    let mintNftEvent = await contract.filters.MintNFT();
                    const endBlock = await provider.getBlockNumber();
                    let events = await contract.queryFilter(mintNftEvent, endBlock-10 , endBlock );
                    events.forEach(async event => {
                        try {
                         var metadata = await Metadata.findOne({ 'key': parseInt( event.args.tokenId )})
                         if(!metadata){
                             var newMetadata = new Metadata({
                                 key:event.args.tokenId,
                                 name:event.args.name,
                                 image:event.args.image,
                                 description:event.args.description,
                                 date:event.args.date,
                               })
                               newMetadata.save();
                         }
                        } catch (error) {
                            
                        }

                    });
                    console.log(events);
                } catch (error) {
                  console.log(error);
                }
            }, 10000);

        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = new EventNFT();