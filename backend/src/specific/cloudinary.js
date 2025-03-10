import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});  
console.log(`cloudinary ${process.env.CLOUDINARY_CLOUD_NAME}`);



// Function to upload an image to Cloudinary
const uploadOnCloudinary = async (profilepath) => {
    if (!profilepath) return null;

    try {
        // Upload the image to Cloudinary
        const response = await cloudinary.uploader.upload(profilepath, {
            resource_type: 'auto',
        });

        // Remove the file from the local system after upload
        fs.unlinkSync(profilepath);

        return response;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        
        // Remove the local file if the upload fails
        if (fs.existsSync(profilepath)) {
            fs.unlinkSync(profilepath);
        }

        return null;
    }
};
export { uploadOnCloudinary };
