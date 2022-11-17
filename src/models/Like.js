const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    userId:String,
    itemId:Number
})
module.exports = mongoose.model("Like",likeSchema);