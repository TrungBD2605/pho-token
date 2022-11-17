const config = require("../../config")
var Island = require("../models/Island");
var SynsMarketItemSale = require("../helpers/synsMarketItemSale")

class GenMetadataNFT {

  async generateNFT() {
    await Island.deleteMany();
    let dateTime = Date.now();
    var index = 1;
    var listMetadata = [];
    while (index <= 10000) {
        let newIsland = new Island(
            {   key:index,
                name: `#IsLand ${index}`,
                description: "Create by BNB Start",
                image: `${config.domain_photobuket}/${index}.png`,
                date: dateTime,
                attributes: [],
            }
        ) ;
        listMetadata.push(newIsland);
        index++
    }
    Island.insertMany(listMetadata,function(error, docs) {
            if(error)console.log(error)
            else {
              console.log("generate NFT success")
              SynsMarketItemSale.sync();

            };
    });
  }
}
module.exports = new GenMetadataNFT();