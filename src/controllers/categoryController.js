const {category} = require("../helpers/categoryData");
class categoryController {
    getCategory(req,res){
        res.json({category});
    }
}
module.exports = new categoryController();