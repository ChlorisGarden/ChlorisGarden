const express = require('express')
const { DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const prisma = require('../config/prisma')
const authenticate = require('../middleware/auth')
const { upload, s3 } = require('../middleware/upload')
const axios = require('axios')

const router = express.Router()

// HELPER: Delete S3 File
const deleteFromS3 = async (imageUrl) => {
    try {
        const url = new URL(imageUrl)
        const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname

        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        }))
    } catch (error) {
        console.error('Failed to deleting file from S3:', error)
    }
}

const LABEL_TO_SLUG = {
    'bacterial_spot': 'tomato-bacterial-spot',
    'early_blight':   'tomato-early-blight',
    'healthy':        'tomato-healthy',
    'late_blight':    'tomato-late-blight',
}

// HELPER: generate presigned S3 URL
async function generatePresignedUrl(imageUrl) {
    const url = new URL(imageUrl)
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
    
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
    })
    
    // URL Expired in 60 sec
    return getSignedUrl(s3, command, { expiresIn: 60 })
}

// HELPER: generate presigned URL
const getPresignedImageUrl = async (imageUrl) => {
    try {
        const url = new URL(imageUrl)
        const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
        })
        return getSignedUrl(s3, command, { expiresIn: 3600 })
    } catch {
        return null
    }
}
 
async function classifyImage(imageUrl) {
    const presignedUrl = await generatePresignedUrl(imageUrl)
    
    const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        { imageUrl: presignedUrl },
        { timeout: 30000 }
    )
    
    const label = response.data.label
    const slug = LABEL_TO_SLUG[label]
    
    if (!slug) {
        throw new Error(`Label tidak dikenali dari model AI: ${label}`)
    }
    
    return {
        slug,
        confidenceScore: response.data.confidenceScore,
    }
}

// POST /api/classify
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Gambar wajib diunggah.' })
    }

    const imageUrl = req.file.location
    
    const saveHistory = req.body.saveHistory !== 'false'

    try {
        const { slug, confidenceScore } = await classifyImage(imageUrl)

        const disease = await prisma.disease.findFirst({ where: { slug } })
        if (!disease) {
            await deleteFromS3(imageUrl)
            return res.status(500).json({ message: 'Penyakit tidak ditemukan di database.' })
        }

        let classificationId = null;
        let finalImageUrl = null;

        if (saveHistory) {
            const classification = await prisma.classification.create({
                data: {
                    userId: req.user.userId,
                    diseaseId: disease.id,
                    imageUrl,
                    confidenceScore,
                },
            })
            classificationId = classification.id
            finalImageUrl = await getPresignedImageUrl(imageUrl)
        } else {
            await deleteFromS3(imageUrl)
        }

        return res.status(201).json({
            message: 'Klasifikasi berhasil',
            result: {
                classificationId: classificationId,
                disease: {
                    name: disease.name,
                    slug: disease.slug,
                    scientificName: disease.scientificName,
                    severity: disease.severity,
                    description: disease.description,
                    symptoms: disease.symptoms,
                    treatment: disease.treatment,
                    preventiveMeasures: disease.preventiveMeasures,
                    rootCauses: disease.rootCauses,
                },
                confidenceScore,
                imageUrl: finalImageUrl,
                classifiedAt: new Date(),
            },
        })
    } catch (error) {
        await deleteFromS3(imageUrl)
        console.error('Error saat klasifikasi:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan saat memproses gambar.' })
    }
})

// GET /api/classify/history
router.get('/history', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10, keyword, crop_type, sort = 'newest' } = req.query
        const skip = (parseInt(page) - 1) * parseInt(limit)
    
        const orderBy = sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' }
    
        const diseaseFilter = {
            ...(keyword
                ? {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive' } },
                        { scientificName: { contains: keyword, mode: 'insensitive' } },
                    ],
                }
                : {}),
            ...(crop_type ? { cropType: crop_type } : {}),
        }
    
        const where = {
            userId: req.user.userId,
            ...(Object.keys(diseaseFilter).length > 0 ? { disease: diseaseFilter } : {}),
        }
    
        const [history, total] = await Promise.all([
            prisma.classification.findMany({
                where,
                include: {
                    disease: {
                        select: { name: true, slug: true, cropType: true, scientificName: true },
                    },
                },
                orderBy,
                skip,
                take: parseInt(limit),
            }),
            prisma.classification.count({ where }),
        ])
        
        const historyWithUrls = await Promise.all(
            history.map(async (item) => ({
                ...item,
                imageUrl: await getPresignedImageUrl(item.imageUrl),
            }))
        )

        return res.status(200).json({
            data: historyWithUrls,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages: Math.ceil(total / parseInt(limit)),
            },
            meta: {
                keyword: keyword ?? null,
                crop_type: crop_type ?? null,
                sort,
            },
        })
    } catch (error) {
        console.error('Error saat mengambil riwayat:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan server.' })
    }
})

// GET /api/classify/history/:id
router.get('/history/:id', authenticate, async (req, res) => {
    try {
        const classification = await prisma.classification.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.userId,
            },
            include: { disease: true },
        })

        if (!classification) {
            return res.status(404).json({ message: 'Data klasifikasi tidak ditemukan.' })
        }

        return res.status(200).json({ data: { ...classification, imageUrl: await getPresignedImageUrl(classification.imageUrl) } })
    } catch (error) {
        console.error('Error saat mengambil detail klasifikasi:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan server.' })
    }
})

// DELETE /api/classify/history/:id
router.delete('/history/:id', authenticate, async (req, res) => {
    try {
        const classification = await prisma.classification.findFirst({
            where: {
                id: parseInt(req.params.id),
                userId: req.user.userId,
            },
        })

        if (!classification) {
            return res.status(404).json({ message: 'Data klasifikasi tidak ditemukan.' })
        }

        await Promise.all([
            deleteFromS3(classification.imageUrl),
            prisma.classification.delete({ where: { id: classification.id } }),
        ])

        return res.status(200).json({ message: 'Riwayat klasifikasi berhasil dihapus.' })
    } catch (error) {
        console.error('Error saat menghapus klasifikasi:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan server.' })
    }
})

// DELETE /api/classify/history
router.delete('/history', authenticate, async (req, res) => {
    try {
        const allHistory = await prisma.classification.findMany({
            where: { userId: req.user.userId },
            select: { id: true, imageUrl: true },
        })
    
        if (allHistory.length === 0) {
            return res.status(404).json({ message: 'Tidak ada riwayat klasifikasi.' })
        }
    
        await Promise.all(allHistory.map((item) => deleteFromS3(item.imageUrl)))
    
        await prisma.classification.deleteMany({
            where: { userId: req.user.userId },
        })
    
        return res.status(200).json({
            message: `${allHistory.length} riwayat klasifikasi berhasil dihapus.`,
        })
    } catch (error) {
        console.error('Error saat menghapus semua riwayat:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan server.' })
    }
})

module.exports = router