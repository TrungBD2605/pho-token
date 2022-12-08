require('dotenv').config({path: '.env.bsc'});
var BlackList = require("../models/BlackList");
var MarketItem = require("../models/MarketItem");

class BlackListController {
    
    async getBlackList(req,res){
        try {
            if(!this.isNumeric(req.body.limit)|| !this.isNumeric(req.body.offset)){
                return res.json({result:false, data:"Wrong parameters!"});
            }
            var sort = this.sortObject(req);
            var blackList = await BlackList.find();
            if(blackList || (this.isNumeric(req.body.limit) && this.isNumeric(req.body.offset))){
                var listItemId = blackList.map(item=>item.itemId)
                var data = await MarketItem.aggregate().lookup(
                    { from: 'likes', localField: 'itemId', foreignField: 'itemId', as: 'like' }
                ).lookup(
                    { from: 'marketitems',
                    let: { nftContract: "$nftContract", tokenId: "$tokenId"},
                    pipeline: [                   {
                        $match: {
                             $expr:{
                                  $and:[
                                       {$eq: ["$$nftContract","$nftContract"]},
                                       {$eq:["$$tokenId", "$tokenId" ]}
                                    ]
                             }
                        },
                   }
                ], as: 'history' }
                ).project({
                    itemId:"$itemId",
                    nftContract:"$nftContract",
                    tokenId:"$tokenId",
                    seller:"$seller",
                    owner:"$owner",
                    price:"$price",
                    sold:"$sold",
                    metadata:"$metadata",
                    currencySell:"$currencySell",
                    history:"$history",
                    categoryId:"$categoryId",
                    countLike:{$size:"$like"}
                }).match(
                    {
                        'itemId': { $in: listItemId
                        }
                    }
                ).sort(sort).limit(req.body.limit).skip(parseInt(req.body.offset));
            var countMarketItem = await MarketItem.countDocuments({'itemId': { $in: listItemId}})
            return res.json({
                data : data,
                total : countMarketItem
            });
                
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
    sortObject(req){
        var sort = {countLike:-1}
        if(req.body.sort){
            if(req.body.sort == "-price"){
                sort['price'] = -1
            }
            if(req.body.sort == "+price"){
                sort['price'] = 1
            }
            if(req.body.sort == "+like"){
                sort['countLike'] = 1
            }
            if(req.body.sort == "-like"){
                sort['countLike'] = -1
            }
            if(req.body.sort == "+created"){
                sort['itemId'] = 1
            }
            if(req.body.sort == "-created"){
                sort['itemId'] = -1
            }
        }
        return sort;
    }
    isNumeric(val) {
        return /^-?\d+$/.test(val);
    }
}
module.exports = new BlackListController();