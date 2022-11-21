const mongoose = require("mongoose");

const marketItemSchema = new mongoose.Schema({
    itemId:{type: Number, index:{unique:true}},
    categoryId:Number,
    nftContract:String,
    tokenId:Number,
    seller:String,
    owner:String,
    price:Number,
    sold:Boolean,
    currencySell:Number,
    metadata:Object

})
module.exports = mongoose.model("MarketItem",marketItemSchema);