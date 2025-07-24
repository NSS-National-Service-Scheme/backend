import appConfig from './config.js';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: appConfig.cloudinary.cloud_name,
    api_key: appConfig.cloudinary.api_key,
    api_secret: appConfig.cloudinary.api_secret,
});

/**
 * @param {string} filePath - Path to the JPG file (e.g. "uploads/photo.jpg")
 * @returns {Promise<string>} - Secure URL of uploaded image
 */

export const uploadImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'image',
            folder: 'uploads', // Optional: Cloudinary folder
        });

        // Optional: remove local file after upload
        fs.unlinkSync(filePath);

        return result.secure_url;
    } catch (err) {
        console.error('Cloudinary upload failed:', err);
        throw  err;
    }
};


