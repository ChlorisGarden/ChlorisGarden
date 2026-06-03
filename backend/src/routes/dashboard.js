const express = require('express')
const prisma = require('../config/prisma')
const authenticate = require('../middleware/auth')
const { GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const { s3 } = require('../middleware/upload')

const router = express.Router()

// HELPER: generate presigned URL
const getPresignedImageUrl = async (imageUrl) => {
  try {
    const url = new URL(imageUrl)
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    })
    return await getSignedUrl(s3, command, { expiresIn: 3600 })
  } catch (error) {
    console.error('Error saat membuat presigned URL:', error.message)
    return null
  }
}

// HELPER: agregasi tren scan per bulan (6 bulan terakhir)
const buildMonthlyTrend = (classifications) => {
  const now = new Date()

  const monthMap = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthMap[key] = { month: key, count: 0 }
  }

  for (const item of classifications) {
    const d = new Date(item.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (monthMap[key]) {
      monthMap[key].count++
    }
  }

  return Object.values(monthMap)
}

// HELPER: agregasi distribusi severity
const buildSeverityDistribution = (classifications) => {
  const severityMap = { low: 0, medium: 0, high: 0, healthy: 0 }

  for (const item of classifications) {
    if (!item.disease) {
      severityMap.healthy++
      continue
    }

    if (item.disease.slug === 'tomato-healthy') {
      severityMap.healthy++
      continue
    }

    const sev = item.disease.severity?.toLowerCase()
    console.log('[severity debug]', { slug: item.disease.slug, sev })

    if (sev && sev in severityMap) {
      severityMap[sev]++
    } else {
      // Fallback jika severity tidak dikenal
      console.warn('[severity unknown]', sev)
    }
  }

  return Object.entries(severityMap).map(([severity, count]) => ({ severity, count }))
}


// GET /api/dashboard
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const [
      totalScans,
      scansThisMonth,
      healthyCount,
      recentHistory,
      lastScan,
      scansForTrend,
      scansForSeverity,
    ] = await Promise.all([

      // Total classification
      prisma.classification.count({
        where: { userId },
      }),

      // Classification bulan ini
      prisma.classification.count({
        where: { userId, createdAt: { gte: startOfMonth } },
      }),

      // Classification sehat
      prisma.classification.count({
        where: { userId, disease: { slug: 'tomato-healthy' } },
      }),

      // 5 classification terbaru
      prisma.classification.findMany({
        where: { userId },
        include: {
          disease: { select: { name: true, slug: true, cropType: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Classification terakhir
      prisma.classification.findFirst({
        where: { userId },
        include: {
          disease: { select: { name: true, slug: true, cropType: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Scan 6 bulan terakhir
      prisma.classification.findMany({
        where: {
          userId,
          createdAt: { gte: sixMonthsAgo },
        },
        select: { createdAt: true },
      }),

      // Semua scan beserta severity dari disease
      prisma.classification.findMany({
        where: { userId },
        select: {
          disease: {
            select: { slug: true, severity: true },
          },
        },
      }),
    ])

    // Presigned URL untuk lastScan
    if (lastScan?.imageUrl) {
      lastScan.imageUrl = await getPresignedImageUrl(lastScan.imageUrl)
    }

    // Presigned URL untuk recentHistory
    const recentHistoryWithUrls = await Promise.all(
      recentHistory.map(async (item) => {
        if (item.imageUrl) {
          return { ...item, imageUrl: await getPresignedImageUrl(item.imageUrl) }
        }
        return item
      })
    )

    // Persentase sehat
    const healthyPercentage = totalScans > 0
      ? Math.round((healthyCount / totalScans) * 100)
      : 0

    // Agregasi chart
    const monthlyTrend = buildMonthlyTrend(scansForTrend)
    const severityDistribution = buildSeverityDistribution(scansForSeverity)

    return res.status(200).json({
      data: {
        totalScans,
        scansThisMonth,
        healthyPercentage,
        lastScan,
        recentHistory: recentHistoryWithUrls,
        charts: {
          monthlyTrend,
          severityDistribution
        },
      },
    })
  } catch (error) {
    console.error('Error saat mengambil data dashboard:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

module.exports = router