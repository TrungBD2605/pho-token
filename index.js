require('dotenv').config({path: '.env.mongo'});
var express = require("express");
var cors = require('cors')
var route = require("./src/routes/index");
var app = express();
app.use(cors())
var GenMetadataNFT = require("./src/helpers/genMetadaIsland")
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(express.static("./src/public"));
app.listen(process.env.PORT || 3001);
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, function(err){
	if(err) console.log("Mongodb connect error ");
	else {
		GenMetadataNFT.generateNFT();
		console.log("Mongodb connect successfully. ");
	}
});

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
route(app);