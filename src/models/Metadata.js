const mongoose = require("mongoose");

const metadataSchema = new mongoose.Schema({
    key:Number,
    name:String,
    image:String,
    description:String,
    date:Number,
})
module.exports = mongoose.model("Metadata",metadataSchema);