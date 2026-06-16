const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
    cloud_name: 'dxp2o8vya',
    api_key: '799359228264427',
    api_secret: 'wmgUEOiTrfuXn6-DiTGQ9hYNSw8'
});

const uploadToCloudinary = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: 'image' },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

module.exports = { uploadToCloudinary };
