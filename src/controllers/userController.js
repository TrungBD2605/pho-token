require('dotenv').config({path: '.env.bsc'});
var User = require("../models/User");
const { ethers } = require("ethers");

const Web3Utils = require('web3-utils');
const Web3 = require('web3');
class UserController {
    
    register(req,res){
        if(!req.body.username || !req.body.password || !req.body.signature){
            res.json({result:false, data:"Wrong parameters!"});
        }else{
            var web3 = new Web3(process.env.bnbstart_Testnet_Rpcurl);
            var hash = Web3Utils.sha3("register")
            var addressWallet = web3.eth.accounts.recover(hash,req.body.signature);
            var newUser= new User({
                username:req.body.username,
                password:req.body.password,
                address:addressWallet,
                isAdmin:false
            });
            newUser.save(function(err){
                if(err) res.json({result:false, data:"Save new user failed"})
                else res.json({result:true, userID:newUser._id});
            });

        }
    }
    updatePassword(req,res){
        if(!req.body.username || !req.body.password || !req.body.password  || !req.body.signature){
            res.json({result:false, data:"Wrong parameters!"});
        }else{
            var web3 = new Web3(process.env.bnbstart_Testnet_Rpcurl);
            var hash = Web3Utils.sha3("update")
            var addressWallet = web3.eth.accounts.recover(hash,req.body.signature);
            User.findOne({ username: req.body.username },function(err, user) {
                if(err){
                    res.json({result:false, data:"Update password failed!"});
                }else{
                    if(user.address == addressWallet){
                        User.findById(user._id,{
                            password: req.body.password
                        } ,function(err) {
                            if(err){
                                console.log(err);
                                res.json({result:false, data:"Update password failed!"});
                            }else{
                                console.log("Update password success.");
                                res.json({result:true, data:"Update password success!"});
                            }
                        });
                    }else{
                        res.json({result:false, data:"Wrong address wallet"});
                    }
                }
            });
            

        }
    }
    checkMapping(req,res){
        if(!req.query.address){
            res.json({result:false, data:"Wrong parameters!"});
        }else{
            User.findOne({ address: req.query.address },function(err, user) {
                if(err){
                    res.json({result:false, data:"Error"});
                }else{
                    if(user){
                        res.json({result:true, data: {username:user.username , address: user.address}});
                    }else{
                        res.json({result:false, data:"Wrong address wallet"});
                    }
                }
            });
        }
    }
}
module.exports = new UserController();