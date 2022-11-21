
/**
 * Middleware: Authorization user by Token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
let isAdmin = async(req, res, next)=>{
    try{
        var decoded = req.jwtDecoded;
        const userDecode = decoded.data;
        if(userDecode.isAdmin){
            next();
        }else{
            return res.status(403).json({
                message: 'Unauthorized.',
            });
        }
        }catch(error){
        return res.status(403).json({
            message: 'Unauthorized.',
        });
    }
}
 module.exports = {
    isAdmin
}