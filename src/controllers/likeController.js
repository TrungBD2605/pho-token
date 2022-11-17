require('dotenv').config({path: '.env.bsc'});
var Like = require("../models/Like");
class LikeController {
    
    async getLikeMarketItem(req,res){
        try {
            function isNumeric(val) {
                return /^-?\d+$/.test(val);
            }
            if(isNumeric(req.params.itemId)){
                var decoded = req.jwtDecoded;
                const userDecode = decoded.data;
                var countLike = await Like.countDocuments({userId:userDecode._id,itemId: req.params.itemId});
                if(countLike){
                    res.json({result:true});
                }else{
                    res.json({result:false});
                }
                    
                
            }else{
                res.json({result:false});
            }
            
        } catch (error) {
            res.status(404).json({result:false});
        }

    }
    async likeMarketItem(req,res){
        try {
            if(!req.body.itemId){
                res.json({result:false, data:"Wrong parameters!"});
            }else{
                var decoded = req.jwtDecoded;
                const userDecode = decoded.data;
                var oldLike = await Like.findOne({userId:userDecode._id,itemId:req.body.itemId})
                if(oldLike) return res.json({result:oldLike});
                var newLike = new Like({
                    userId:userDecode._id,
                    itemId:req.body.itemId
                })
                var like = await newLike.save();
                res.json({result:like});
            }
        } catch (error) {
            res.status(404).json({});
        }
    }
    async unlikeMarketItem(req,res){
        try {
            if(!req.body.itemId){
                res.json({result:false, data:"Wrong parameters!"});
            }else{
                var decoded = req.jwtDecoded;
                const userDecode = decoded.data;
                await Like.deleteOne({userId:userDecode._id,itemId:req.body.itemId})
                res.json({result:true});
            }
        } catch (error) {
            res.status(404).json({result:false});
        }
    }
}
module.exports = new LikeController();