var express = require('express');
var router = express.Router();

const {register,login,genRefreshToken,fileUpload,listUsers,deleteUser}=require('../controller/user')
const checkAuth=require('../middleware/auth')
const uploadFile=require('../helper/fileUpload')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',register)
router.post('/login',login)
router.post('/refreshtoken',genRefreshToken)
router.post('/upload',checkAuth,uploadFile.upload.single('file'),fileUpload)
router.get('/users',checkAuth,listUsers)
router.post('/delete/:id',deleteUser)







module.exports = router;
