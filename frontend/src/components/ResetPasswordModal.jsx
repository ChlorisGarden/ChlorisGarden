import { useState } from 'react'
import api from '../api/axios'

export default function ResetPasswordModal({ isOpen, onClose, userEmail, isId }) {
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [emailStatus, setEmailStatus] = useState({ type: '', message: '' })

    if (!isOpen) return null

    const handleSendResetEmail = async () => {
        try {
        setIsSendingEmail(true)
        setEmailStatus({ type: '', message: '' })
        
        await api.post('/auth/forgot-password', { email: userEmail })
        
        setEmailStatus({ 
            type: 'success', 
            message: isId 
            ? 'Link reset password berhasil dikirim! Silakan periksa kotak masuk email Anda.' 
            : 'Password reset link sent successfully! Please check your email inbox.' 
        })
        } catch (err) {
        setEmailStatus({ 
            type: 'error', 
            message: err.response?.data?.message || (isId ? 'Gagal mengirim email reset password.' : 'Failed to send reset email.') 
        })
        } finally {
        setIsSendingEmail(false)
        }
    }

    const handleClose = () => {
        setEmailStatus({ type: '', message: '' })
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="w-full max-w-md p-6 rounded-3xl shadow-xl transition-colors duration-300 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 dark:text-white">
            {isId ? 'Konfirmasi Atur Ulang Sandi' : 'Confirm Password Reset'}
            </h3>
            
            {emailStatus.message ? (
            <div className={`p-4 rounded-xl mb-6 text-sm ${
                emailStatus.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400' 
                : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-400'
            }`}>
                {emailStatus.message}
            </div>
            ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                {isId 
                ? `Kami akan mengirimkan instruksi beserta tautan perubahan kata sandi ke email Anda: `
                : `We will send password reset instructions and a link to your email: `
                }
                <strong className="text-gray-900 dark:text-white">{userEmail}</strong>. 
                {isId ? ' Apakah Anda yakin ingin melanjutkan?' : ' Are you sure you want to proceed?'}
            </p>
            )}

            <div className="flex justify-end gap-3">
            {emailStatus.type === 'success' ? (
                <button
                onClick={handleClose}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all active:scale-95"
                >
                {isId ? 'Selesai' : 'Close'}
                </button>
            ) : (
                <>
                <button
                    onClick={handleClose}
                    disabled={isSendingEmail}
                    className="px-5 py-2.5 border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50"
                >
                    {isId ? 'Batal' : 'Cancel'}
                </button>
                <button
                    onClick={handleSendResetEmail}
                    disabled={isSendingEmail}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                    {isSendingEmail ? (
                    <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        {isId ? 'Mengirim...' : 'Sending...'}
                    </>
                    ) : (
                    isId ? 'Ya, Kirim Link' : 'Yes, Send Link'
                    )}
                </button>
                </>
            )}
            </div>
        </div>
        </div>
    )
}