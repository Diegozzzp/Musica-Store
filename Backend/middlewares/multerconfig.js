const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',   
        'image/png',    
        'image/webp',   
        'image/gif',    
        'image/svg+xml' 
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); 
    } else {
        cb(new Error('Tipo de archivo no soportado'), false); 
    }
};

const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter 
});

module.exports = upload;