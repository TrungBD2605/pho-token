const mongoose = require("mongoose");

const marketItemSchema = new mongoose.Schema({
    itemId:Number,
    nftContract:String,
    tokenId:Number,
    seller:String,
    owner:String,
    price:Number,
    sold:Boolean,
    metadata:Object

})
module.exports = mongoose.model("MarketItem",marketItemSchema);