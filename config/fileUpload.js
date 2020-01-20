const multer = require('multer');
function createFileName(file, name) {
    let i = file.originalname.lastIndexOf('.');
    let ext = i ? file.originalname.substr(i + 1) : 'jpeg';
    name = name.replace(new RegExp(" ", 'g'), "");
    var d = new Date();
    var date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "_" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
    let filename = name + date + '.' + ext;
    return filename
}

const restaurantStorageConfig = multer.diskStorage({

    destination: (req, file, cb) =>{
        cb(null, "media/Restaurant/");
    },


    filename: (req, file, cb) =>{
        let name = req.body.name;

        console.log(file.originalname);

        filename = createFileName(file, name)

        req.body.image = 'media/Restaurant/' + filename;
        cb(null, filename);
    }
});


exports.upload = function (fieldName) {
    return multer({storage:restaurantStorageConfig}).single(fieldName);
};

