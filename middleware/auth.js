const jwt = require('jsonwebtoken');
const  {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} =require('http-status-codes')

const {ACCESS_TOKEN_SECRET_KEY} = require('../config/jwtConfig.json');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token,ACCESS_TOKEN_SECRET_KEY,(err,decode)=>{
            if(err) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    status:false,
                    message: "Unauthorized User"
                });
            }
            req.userData = decode;
            next();
        })
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            status:false,
            message: "Unauthorized User"
        });
    }
};