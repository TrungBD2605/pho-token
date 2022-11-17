const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
    userId:String,
    token:String
})
module.exports = mongoose.model("Token",TokenSchema);