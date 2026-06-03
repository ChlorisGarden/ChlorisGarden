const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { DeleteObjectCommand } = require('@aws-sdk/client-s3')
const prisma = require('../config/prisma')
const authenticate = require('../middleware/auth')
const { upload, s3 } = require('../middleware/upload')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

const router = express.Router()

// HELPER: Detele File
const deleteProfileImageFromS3 = async (imageUrl) => {
  try {
    const url = new URL(imageUrl)
    const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    }))
  } catch (error) {
    console.error('Gagal menghapus foto profil dari S3:', error)
  }
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Semua field wajib diisi' })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Format email tidak valid' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(409).json({ message: 'Email sudah terdaftar' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, profileImage: true, createdAt: true }
    })

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(201).json({ message: 'Registrasi berhasil', user, token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email atau password salah' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user

    return res.status(200).json({ message: 'Login berhasil', user: userWithoutPassword, token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// GET /auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, name: true, email: true, profileImage: true, createdAt: true }
    })
    return res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Terjadi kesalahan server' })
  }
})

// PUT /auth/profile/name
router.put('/profile/name', authenticate, async (req, res) => {
  try {
    const { name } = req.body
 
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Nama tidak boleh kosong.' })
    }
 
    if (name.trim().length < 3) {
      return res.status(400).json({ message: 'Nama minimal 3 karakter.' })
    }
 
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true, profileImage: true, createdAt: true },
    })
 
    return res.status(200).json({
      message: 'Nama berhasil diperbarui.',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error saat mengubah nama:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// DELETE /auth/account
// Deleting account will automatically delete all other related data 
router.delete('/account', authenticate, async (req, res) => {
  try {
    const { password } = req.body
 
    if (!password) {
      return res.status(400).json({ message: 'Password wajib diisi untuk konfirmasi.' })
    }
 
    // Fetch User Data
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { password: true, profileImage: true },
    })
 
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' })
    }
 
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Password tidak valid.' })
    }
 
    // Delete User Profile
    if (user.profileImage) {
      await deleteProfileImageFromS3(user.profileImage)
    }
 
    await prisma.user.delete({ where: { id: req.user.userId } })
 
    return res.status(200).json({ message: 'Akun berhasil dihapus.' })
  } catch (error) {
    console.error('Error saat menghapus akun:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// PUT /auth/change-password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password baru minimal 8 karakter.' })
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Konfirmasi password tidak cocok.' })
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'Password baru tidak boleh sama dengan password lama.' })
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } })
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan.' })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Password saat ini tidak valid.' })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: req.user.userId },
      data: { password: hashedNewPassword },
    })

    return res.status(200).json({ message: 'Password berhasil diubah.' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// PUT /auth/profile/image
router.put('/profile/image', authenticate, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Foto profil wajib diunggah.' })
  }

  const newImageUrl = req.file.location

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { profileImage: true },
    })

    if (existingUser?.profileImage) {
      await deleteProfileImageFromS3(existingUser.profileImage)
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { profileImage: newImageUrl },
      select: { id: true, name: true, email: true, profileImage: true, createdAt: true },
    })

    return res.status(200).json({
      message: 'Foto profil berhasil diperbarui.',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Error saat upload foto profil:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// DELETE /auth/profile/image
router.delete('/profile/image', authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { profileImage: true },
    })

    if (!user?.profileImage) {
      return res.status(404).json({ message: 'Tidak ada foto profil yang tersimpan.' })
    }

    await Promise.all([
      deleteProfileImageFromS3(user.profileImage),
      prisma.user.update({
        where: { id: req.user.userId },
        data: { profileImage: null },
      }),
    ])

    return res.status(200).json({ message: 'Foto profil berhasil dihapus.' })
  } catch (error) {
    console.error('Error saat menghapus foto profil:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email wajib diisi.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      return res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirimkan.' })
    }

    // Expired in 1 hour
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    })

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

    await transporter.sendMail({
      from: `"Plant Disease App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password',
      html: `
        <p>Halo ${user.name},</p>
        <p>Kami menerima permintaan reset password untuk akunmu.</p>
        <p>Klik link berikut untuk mereset password (berlaku 1 jam):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Jika kamu tidak merasa melakukan permintaan ini, abaikan email ini.</p>
      `,
    })

    return res.status(200).json({ message: 'Jika email terdaftar, link reset akan dikirimkan.' })
  } catch (error) {
    console.error('Error forgot password:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

// POST /auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body

    if (!token || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'Semua field wajib diisi.' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password minimal 8 karakter.' })
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'Konfirmasi password tidak cocok.' })
    }

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gt: new Date() },
      },
    })

    if (!user) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah expired.' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return res.status(200).json({ message: 'Password berhasil direset. Silakan login kembali.' })
  } catch (error) {
    console.error('Error reset password:', error)
    return res.status(500).json({ message: 'Terjadi kesalahan server.' })
  }
})

module.exports = router