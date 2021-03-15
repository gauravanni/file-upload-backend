
const multer = require('multer');
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir('./public/assets/user_'+req.userData.id, { recursive: true }, (err) => {
            if (err) throw err;
            cb(null, './public/assets/user_'+req.userData.id)
        });
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' 
    || file.mimetype === 'image/png' 
    || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}


exports.upload = multer({
    storage: storage,
    fileFilter: fileFilter
});
