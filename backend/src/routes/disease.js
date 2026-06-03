const express = require('express')
const prisma = require('../config/prisma')
 
const router = express.Router()

// GET /api/diseases
router.get('/', async (req, res) => {
    const lang = req.query.lang || 'en';
    try {
        const { keyword, crop_type } = req.query
        const where = {
            language: lang,
            ...(keyword
                ? {
                    OR: [
                        { name: { contains: keyword, mode: 'insensitive' } },
                        { scientificName: { contains: keyword, mode: 'insensitive' } },
                    ],
                }
                : {}),
            ...(crop_type ? { cropType: crop_type } : {}),
        };
    
        const diseases = await prisma.disease.findMany({
            where,
            select: {
                language: true,
                id: true,
                name: true,
                slug: true,
                cropType: true,
                severity: true,
                scientificName: true,
                description: true,
                imageUrl: true,
            },
            orderBy: { name: 'asc' },
        })
    
        return res.status(200).json({
            data: diseases,
            meta: {
                total: diseases.length,
                keyword: keyword ?? null,
                crop_type: crop_type ?? null,
                language: lang,
            },
        })
    } catch (error) {
        console.error('Error saat mengambil daftar penyakit:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan server.' })
    }
})

// GET /api/diseases/:slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params
        const lang = req.query.lang || 'en'
        const disease = await prisma.disease.findFirst({
            where: { 
                slug: slug,
                language: lang 
            },
            select: {
                language: true,
                id: true,
                name: true,
                slug: true,
                cropType: true,
                severity: true,
                scientificName: true,
                description: true,
                symptoms: true,
                treatment: true,
                preventiveMeasures: true,
                rootCauses: true,
                imageUrl: true,
                createdAt: true,
                _count: { select: { classifications: true } },
            },
        });
    
        if (!disease) {
            return res.status(404).json({ message: 'Penyakit tidak ditemukan.' })
        }
    
        const { _count, ...diseaseData } = disease
    
        return res.status(200).json({
            data: {
                ...diseaseData,
                totalDetections: _count.classifications,
            },
        })
    } catch (error) {
        console.error('Error saat mengambil detail penyakit:', error)
        return res.status(500).json({ message: 'Terjadi kesalahan server.' })
    }
})

module.exports = router