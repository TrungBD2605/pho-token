require('dotenv').config({path: '.env.token'});

const jwtHelper = require("../helpers/jwt.helper");
const debug = console.log.bind(console);

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || "PRIVATE-KEY-TOKEN"

/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let isAuth = async(req, res, next)=>{
    try{
        const tokenFromClient = req.header('Authorization').replace('Bearer ', '') || req.body.token || req.query.token || req.headers["x-access-token"];
        if(tokenFromClient){
    
                const decoded = await jwtHelper.verifyToken(tokenFromClient, process.env.ACCESS_TOKEN_SECRET);
                // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
                req.jwtDecoded = decoded;
                // Cho phép req đi tiếp sang controller.
                next();
    
        }else{
                // Không tìm thấy token trong request
            return res.status(403).send({
                message: 'No token provided.',
            });
        }
        }catch(error){
        // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
        debug("Error while verify token:", error);
        return res.status(401).json({
            message: 'Unauthorized.',
        });
    }
}
 module.exports = {
     isAuth
}