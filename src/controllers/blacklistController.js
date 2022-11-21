require('dotenv').config({path: '.env.bsc'});
var BlackList = require("../models/BlackList");
class BlackListController {
    
    async getBlackList(req,res){
        try {
            var blackList = await BlackList.find();
            if(countLike){
                res.json({result:blackList});
            }else{
                res.json({result:[]});
            }     
            
        } catch (error) {
            res.status(404).json({result:false});
        }

    }
    async addBlackList(req,res){
        try {
            if(!req.body.itemId){
                res.json({result:false, data:"Wrong parameters!"});
            }else{
                var oldBlackListItem = await BlackList.findOne({itemId:req.body.itemId})
                if(oldBlackListItem) return res.json({result:oldBlackListItem});
                var newBlackListItem = new BlackList({
                    itemId:req.body.itemId
                })
                var item = await newBlackListItem.save();
                res.json({result:item});
            }
        } catch (error) {
            res.status(404).json({});
        }
    }
    async removeBlackList(req,res){
        try {
            if(!req.body.itemId){
                res.json({result:false, data:"Wrong parameters!"});
            }else{
                await BlackList.deleteOne({itemId:req.body.itemId})
                res.json({result:true});
            }
        } catch (error) {
            res.status(404).json({result:false});
        }
    }
}
module.exports = new BlackListController();