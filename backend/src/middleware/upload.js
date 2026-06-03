const multer = require('multer')
const multerS3 = require('multer-s3')
const { S3Client } = require('@aws-sdk/client-s3')
const path = require('path')

// S3 Client Init
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
})

// S3 Bucket Config
const upload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_S3_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const userId = req.user?.userId ?? 'unknown'
            const timestamp = Date.now()
            const ext = path.extname(file.originalname).toLowerCase()

            // Selain dari /auth/ akan masuk ke uploads
            const folder = req.baseUrl.includes('auth') ? 'profiles' : 'uploads'
            cb(null, `${folder}/${userId}_${timestamp}${ext}`)
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'), false)
        }
    },
    limits: {
        // Max: 5MB
        fileSize: 5 * 1024 * 1024,
    },
})
 
module.exports = { upload, s3 }