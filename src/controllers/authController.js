require('dotenv').config({path: '.env.token'});

const jwtHelper = require("../helpers/jwt.helper");
var User = require("../models/User");
var Token = require("../models/Token");

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || "1h";
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "PRIVATE-KEY-TOKEN";
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "3650d";
const refreshTokenSecret = process.env.ACCESS_TOKEN_REFRESH_SECRET || "PRIVATE-KEY-TOKEN-REFRESH";

/**
 * controller login
 * @param {*} req 
 * @param {*} res 
 */
 let login = async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username })
      if(!user) return res.status(500).send({message: 'User not found'})
      const isMatchPassword = await user.comparePassword(req.body.password);
      if(!isMatchPassword) return res.status(500).send({message: 'Password is incorrect'})
      const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
      const refreshToken = await jwtHelper.generateToken(user, refreshTokenSecret, refreshTokenLife);
      const token = await Token.findOne({ userId: user._id });
      if(token){
        Token.findByIdAndUpdate(token._id,{token:refreshToken },function(err, token) {});
      }else{
        var token_  = new Token({
          userId:user._id,
          token:refreshToken
        })
        token_.save();
      }
      return res.status(200).json({
        accessToken,
        refreshToken,
        userId: user._id,
        username:user.username,
        address:user.address,
        isAdmin : user.isAdmin
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  /**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
let refreshToken = async (req, res) => {
    const refreshTokenFromClient = req.body.refreshToken;
    if (refreshTokenFromClient) {
      try {
        const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
        const user = decoded.data;
        const token_ = await Token.findOne({ userId: user._id });
        const userModel = await User.findById(user._id);

        if(!token_ || token_.token!==refreshTokenFromClient){
          return res.status(401).json({message: "Invalid request. Token is not in store"})
        }
        const accessToken = await jwtHelper.generateToken(user, accessTokenSecret, accessTokenLife);
        return res.status(200).json({
          accessToken,
          userId: userModel._id,
          username:userModel.username,
          address:userModel.address,
          isAdmin: user.isAdmin
        });
      } catch (error) {
        res.status(403).json({
          message: 'Invalid refresh token.',
        });
      }
    } else {
      // Không tìm thấy token trong request
      return res.status(403).send({
        message: 'No token provided.',
      });
    }
  };

module.exports = {
    login,
    refreshToken
}