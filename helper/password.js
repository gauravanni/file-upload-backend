const bcrypt = require('bcrypt');

exports.pwdCompare = (pwd,dbPwd)=>{
    return new Promise(async (reslove, reject) => {
        try{
            bcrypt.compare(pwd, dbPwd, async (err, result) => {
                if(result){
                    reslove(true)
                }else{
                    reslove(false)
                }
            })
        }
        catch(err){
            reject(err)
        }
    })
}


exports.hashUsrPwd = (pwd)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            bcrypt.hash(pwd, 10,(err, hash) => {
                if(err){
                    reject(err)
                }else{
                    resolve(hash)
                }
            })
        }
        catch(err){
            reject(err)
        }
    })
}