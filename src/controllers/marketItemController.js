var MarketItem = require("../models/MarketItem");

class MarketItemController {

    async getMarketItemById(req,res){
        function isNumeric(val) {
            return /^-?\d+$/.test(val);
        }
        if(isNumeric(req.params.id)){
            try {
                var data = await MarketItem.aggregate().match({ itemId: parseInt(req.params.id) }).lookup(
                    { from: 'likes', localField: 'itemId', foreignField: 'itemId', as: 'like' }
                    ).lookup(
                        { from: 'marketitems', localField: 'tokenId', foreignField: 'tokenId', as: 'history' }
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
                    })
                return res.json(data)
            } catch (error) {
                res.json({})
            }
        }else{
            res.json({});
        }
    }
    async getListMarketItemPaging(req, res){
        if(!Number.isInteger(req.body.offset)|| !Number.isInteger(req.body.limit) ){
            return res.json({result:false, data:"Wrong parameters!"});
        }
        var matchObject = this.matchQuery(req);
        var sort = this.sortObject(req);
        if(this.isNumeric(req.body.limit) && this.isNumeric(req.body.offset)){
            try {
                var data = await MarketItem.aggregate().lookup(
                        { from: 'likes', localField: 'itemId', foreignField: 'itemId', as: 'like' }
                    ).lookup(
                        { from: 'marketitems', localField: 'tokenId', foreignField: 'tokenId', as: 'history' }
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
                    }).match(matchObject).sort(sort).limit(req.body.limit).skip(parseInt(req.body.offset));
                var countMarketItem = await MarketItem.countDocuments(matchObject)
                return res.json({
                    data : data,
                    total : countMarketItem
                });
            } catch (error) {
                console.log(error)
                return res.json({});
            }
        }else{
            res.json({});
        }
        
    }
    async getListMyNftPaging(req, res){
        if(!Number.isInteger(req.body.offset)|| !Number.isInteger(req.body.limit) || !req.body.address){
            return res.json({result:false, data:"Wrong parameters!"});
        }
        function isNumeric(val) {
            return /^-?\d+$/.test(val);
        }
        
        if(isNumeric(req.body.limit) && isNumeric(req.body.offset)){
            try {
                var dataAllMarket = await MarketItem.find();
                var data = await MarketItem.aggregate().match({ owner: {"$regex": new RegExp(req.body.address.toLowerCase(), "i")}, sold : true}).group(
                    { _id: {
                            "nftContract": "$nftContract",
                            "tokenId": "$tokenId",
                        },
                        itemId:{ "$max": "$itemId" },
                        nftContract:{"$last" : "$nftContract"},
                        tokenId:{"$last" : "$tokenId"},
                        seller:{"$last" : "$seller"},
                        owner:{"$last" : "$owner"},
                        price:{"$last" : "$price"},
                        sold:{"$last" : "$sold"},
                        categoryId:{"$last" : "$categoryId"},
                        currencySell:{"$last" : "$currencySell"},
                        metadata:{"$last" : "$metadata"},
                    }
                    ).lookup(
                    { from: 'likes', localField: 'itemId', foreignField: 'itemId', as: 'like' }
                    ).project({
                        itemId:"$itemId",
                        nftContract:"$nftContract",
                        tokenId:"$tokenId",
                        seller:"$seller",
                        owner:"$owner",
                        price:"$price",
                        sold:"$sold",
                        currencySell:"$currencySell",
                        metadata:"$metadata",
                        categoryId:"$categoryId",
                        countLike:{$size:"$like"}
                    }).limit(req.body.limit).skip(parseInt(req.body.offset));
                var newdata = data.filter((item)=>{
                    var dataFilter = dataAllMarket.filter(itemAllMarket=>{
                        return itemAllMarket.tokenId == item.tokenId && itemAllMarket.nftContract.toLowerCase() == item.nftContract.toLowerCase() && itemAllMarket.sold == false
                    })
                    return dataFilter.length < 1;
                })
                var countMarketItem = await MarketItem.aggregate().match({ owner: {"$regex": new RegExp(req.body.address.toLowerCase(), "i")}, sold : true}).group(
                    { _id: {
                            "nftContract": "$nftContract",
                            "tokenId": "$tokenId",
                        },
                        itemId:{ "$max": "$itemId" },
                        nftContract:{"$last" : "$nftContract"},
                        tokenId:{"$last" : "$tokenId"},
                        seller:{"$last" : "$seller"},
                        owner:{"$last" : "$owner"},
                        price:{"$last" : "$price"},
                        sold:{"$last" : "$sold"},
                        categoryId:{"$last" : "$categoryId"},
                        currencySell:{"$last" : "$currencySell"},
                        metadata:{"$last" : "$metadata"}
                    }
                    )
                var newDataCount = countMarketItem.filter((item)=>{
                    var dataFilter = dataAllMarket.filter(itemAllMarket=>{
                        return itemAllMarket.tokenId == item.tokenId && itemAllMarket.nftContract.toLowerCase() == item.nftContract.toLowerCase() && itemAllMarket.sold == false
                    })
                    return dataFilter.length < 1;
                })
                return res.json({
                    data : newdata,
                    total : newDataCount.length
                });
            } catch (error) {
                console.log(error)
                return res.json({});
            }
        }else{
            res.json({});
        }
        
    }
    async getListMyItemsCreated(req, res){
        if(!Number.isInteger(req.body.offset)|| !Number.isInteger(req.body.limit) || !req.body.address){
            return res.json({result:false, data:"Wrong parameters!"});
        }
        function isNumeric(val) {
            return /^-?\d+$/.test(val);
        }
        
        if(isNumeric(req.body.limit) && isNumeric(req.body.offset)){
            try {
                var data = await MarketItem.aggregate().match({ seller: {"$regex": new RegExp(req.body.address.toLowerCase(), "i")}, sold : false}).lookup(
                    { from: 'likes', localField: 'itemId', foreignField: 'itemId', as: 'like' }
                    ).project({
                        itemId:"$itemId",
                        nftContract:"$nftContract",
                        tokenId:"$tokenId",
                        seller:"$seller",
                        owner:"$owner",
                        price:"$price",
                        sold:"$sold",
                        currencySell:"$currencySell",
                        metadata:"$metadata",
                        categoryId:"$categoryId",
                        countLike:{$size:"$like"}
                    }).limit(req.body.limit).skip(parseInt(req.body.offset));
                var countMarketItem = await MarketItem.countDocuments({ seller: {"$regex": new RegExp(req.body.address.toLowerCase(), "i")}, sold : false})
                return res.json({
                    data : data,
                    total : countMarketItem
                });
            } catch (error) {
                console.log(error)
                return res.json({});
            }
        }else{
            res.json({});
        }
        
    }
    getListMarketItem(req, res){
        MarketItem.find().then((result)=>{
            return res.json(result);
        }).catch((err)=>{
            return res.json({});
        })
    }
    isNumeric(val) {
        return /^-?\d+$/.test(val);
    }
    matchQuery(req){
        var query = {}
        if(req.body.name){
            query['metadata.name'] = {$regex: req.body.name, $options: 'i'}
        }
        if(req.body.price_min){
            query['price'] = { $gte: req.body.price_min }
        }
        if(req.body.price_max){
            query['price'] = { $lte: req.body.price_max }
        }
        if(req.body.seller){
            query['seller'] =  {"$regex": new RegExp(req.body.seller.toLowerCase(), "i")}
        }
        if(req.body.owner){
            query['owner'] =  {"$regex": new RegExp(req.body.owner.toLowerCase(), "i")}
        }
        if(req.body.nftContract){
            query['nftContract'] =  {"$regex": new RegExp(req.body.nftContract.toLowerCase(), "i")}
        }
        if(typeof req.body.sold  !== 'undefined'){
            query['sold'] =  req.body.sold;
        }
        if(req.body.categoryId){
            query['categoryId'] =  req.body.categoryId
        }
        return query
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
}
module.exports = new MarketItemController();