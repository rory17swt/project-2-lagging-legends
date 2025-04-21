import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from "multer-storage-cloudinary"
import multer from 'multer'

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDNINARY_API_KEY,
    api_secret: process.env.CLOUDNINARY_API_SECRET
})

// Storage object - How and where our files are stored
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'lagging_legends_uploads',
        format: 'png',
        public_id: (req, file) => {
            return Date.now() + '-' + file.originalname
        },
    },
})

// Parser function - takes the image and provides a req.file key
const parser = multer({ storage: storage})

export default parser