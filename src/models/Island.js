const mongoose = require("mongoose");

const islandSchema = new mongoose.Schema({
    key:Number,
    name:String,
    image:String,
    description:String,
    date:Number,
    attributes:Array

})
module.exports = mongoose.model("Island",islandSchema);