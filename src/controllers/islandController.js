var Island = require("../models/Island");

class IslandController {

    getIslandById(req,res){
        function isNumeric(val) {
            return /^-?\d+$/.test(val);
        }
        if(isNumeric(req.params.id)){
            Island.findOne({ 'key': req.params.id },(err, island) => {
                if(err){
                    res.json({result:false, msg:"err"});
                }else{
                    if(island){
                        res.json(island)
                    }else{
                        res.json({})
                    }
                }
            })
            
        }else{
            res.json({});
        }
    }
    // getListIslandPaging(req, res){

    //     function isNumeric(val) {
    //         return /^-?\d+$/.test(val);
    //     }
    //     var perPage = 10
    //     if(isNumeric(req.params.page)){
    //         Island.find().limit(perPage).skip(perPage*req.params.page).then((result)=>{
    //             return res.json(result);
    //         }).catch((err)=>{
    //             return res.json({});
    //         })
    //     }else{
    //         res.json({});
    //     }
        
    // }
    // getListIsland(req, res){
    //     Island.find().then((result)=>{
    //         return res.json(result);
    //     }).catch((err)=>{
    //         return res.json({});
    //     })
    // }
}
module.exports = new IslandController();