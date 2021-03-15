const createError = require('http-errors')
const  {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} =require('http-status-codes')
const jwt=require('jsonwebtoken')
let refreshTokens = [];

const User = require('../models/').User;
const Image = require('../models/').Image;

const {hashUsrPwd,pwdCompare}=require('../helper/password')
const {ACCESS_TOKEN_SECRET_KEY,REFRESH_TOKEN_SECRET_KEY}=require('../config/jwtConfig.json')

exports.register=async(req,res)=>{
    try {
        const userExists=await User.findOne({
            email:req.body.email
        })
        // not allow duplicate user
        if(userExists){
            return res.status(406).json({
                status: false,
                message: "Duplicate email not acceptable"
            });
        }
        // hash password before saving to DB
        const hash = await hashUsrPwd(req.body.password);
        // save to the users table
        const user=await User.create({...req.body,password:hash})
        if(user){
            return res.status(201).json({
                status: true,
                message: "User register successfully"
            });
        }
    } catch (error) {
        return res.status(502).json({
            status: false,
            Message: error.message
        });
    }
}

exports.login=async(req,res)=>{
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        })
        if (user === null) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Wrong email or password"
            });
        }
        const result=await pwdCompare(req.body.password, user.dataValues.password)
        if(result){
            const accessToken = jwt.sign(user.dataValues,ACCESS_TOKEN_SECRET_KEY, { expiresIn: "1d" });
            const refreshToken = jwt.sign(user.dataValues,REFRESH_TOKEN_SECRET_KEY, { expiresIn: "7d" });
            refreshTokens.push(refreshToken);
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Login Success',
                accessToken,
                refreshToken
            });
        }
        else{
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Wrong email or password"
            });
        }
    } catch (error) {
        return res.status(502).json({
            status: false,
            Message: error.message
        });
    }
}

exports.fileUpload=async(req,res)=>{
    try {
        const image=await Image.create({
            image_path:req.file.path,
            user_id:req.userData.id
        })
        if(image){
            return res.status(StatusCodes.CREATED).json({
                status: true,
                message: "File Uploaded Successfully"
            });
        }
    } catch (error) {
        return res.status(502).json({
            status: false,
            Message: error.message
        });
    }
}

exports.listUsers=async(req,res)=>{
    try {
        // join User and Image table
        const users = await Image.findAll({
            where:{
                    user_id: req.userData.id,
            },
            include: [{
                    model:User
                }]
            });
        if(users.length>0){
            return res.status(StatusCodes.OK).json({
                status: true,
                message: 'Images fetched Successfully',
                result:users
            });
        }
        else {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                message: 'No Image Found',
                users
            });
        }
    } catch (error) {
        return res.status(502).json({
            status: false,
            Message: error.message
        });
    }
}

exports.deleteUser=async(req,res)=>{
    try {
        const id=req.params.id;
        const user=await User.findOne({
            where:{id},
            attributes:['id','name']
        })
        if(user){
            const userId=user.id
            const image=await Image.destroy({
                where:{user_id:userId}
            })
            const user=await User.destroy({
                where:{id:userId}
            })
            if(image || user){
                return res.status(StatusCodes.OK).json({
                    status: true,
                    message:'Record deleted Successfully',
                });
            }
            else{
                return res.status(StatusCodes.NOT_FOUND).json({
                    status: false,
                    message:'No Record Found',
                });
            }
        }
        return res.status(StatusCodes.NOT_FOUND).json({
            status: false,
            message:`No Record Found for this user`,
        });
        
    } catch (error) {
        return res.status(502).json({
            status: false,
            Message: error.message
        });
    }
}

exports.genRefreshToken=async(req,res)=>{
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken || !refreshTokens.includes(refreshToken)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "unauthorized"
            });
    }
    // If the refresh token is valid, create a new accessToken and return it.
    jwt.verify(refreshToken,REFRESH_TOKEN_SECRET_KEY, (err, user) => {
        if (!err) {
            const accessToken = jwt.sign({ username: user.name }, ACCESS_TOKEN_SECRET_KEY, {expiresIn: "20s"});
            return res.json({ success: true, accessToken });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                status: false,
                message: "Invalid refresh token"
            });
        }
    });
    } catch (error) {
        console.log('error',error)
    }
}

