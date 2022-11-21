const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema({
    itemId:Number
})
module.exports = mongoose.model("BlackList",blackListSchema);