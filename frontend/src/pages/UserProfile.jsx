import { usePreferences } from '../context/PreferencesContext'
import { useAuth } from '../context/AuthContext'
import { useRef, useState } from 'react'
import api from '../api/axios';
import ResetPasswordModal from '../components/ResetPasswordModal';
import DynamicModal from '../components/DynamicModal';

export default function UserProfile() {
  const { preferences, updatePreferences } = usePreferences()
  const { user, logout, updateUser } = useAuth()
  const isId = preferences.language === 'id'

  const fileInputRef = useRef(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isDeletingImage, setIsDeletingImage] = useState(false)

  const [isEditingName, setIsEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [isUpdatingName, setIsUpdatingName] = useState(false)
  const [nameError, setNameError] = useState('')

  const [isResetModalOpen, setIsResetModalOpen] = useState(false)

  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingHistory, setIsDeletingHistory] = useState(false)

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: null,
    confirmText: '',
    cancelText: ''
  });

  const handleCloseModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      setIsUploadingImage(true)
      const { data } = await api.put('/auth/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      updateUser(data.user)
    } catch (err) {
      console.error(err.response?.data?.message || 'Gagal upload foto')
    } finally {
      setIsUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleDeleteImage = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: isId ? 'Hapus Foto Profil?' : 'Delete Profile Picture?',
      message: isId 
        ? 'Apakah Anda yakin ingin menghapus foto profil Anda?' 
        : 'Are you sure you want to delete your profile picture?',
      confirmText: isId ? 'Ya, Hapus' : 'Yes, Delete',
      cancelText: isId ? 'Batal' : 'Cancel',
      onConfirm: async () => {
        handleCloseModal();
        try {
          setIsDeletingImage(true);
          await api.delete('/auth/profile/image');
          updateUser({ ...user, profileImage: null });
        } catch (err) {
          setModalConfig({
            isOpen: true,
            type: 'error',
            title: isId ? 'Gagal' : 'Error',
            message: err.response?.data?.message || (isId ? 'Gagal menghapus foto.' : 'Failed to delete photo.'),
            onConfirm: null
          });
        } finally {
          setIsDeletingImage(false);
        }
      }
    });
  };

  const handleNameSubmit = async () => {
    if (!newName || newName.trim().length < 3) {
      setNameError(isId ? 'Nama minimal 3 karakter.' : 'Name must be at least 3 characters.');
      return;
    }

    try {
      setIsUpdatingName(true)
      setNameError('')
      const { data } = await api.put('/auth/profile/name', { 
        name: newName.trim() 
      })
      
      updateUser(data.user)
      setIsEditingName(false)
    } catch (err) {
      setNameError(
        err.response?.data?.message || 
        (isId ? 'Gagal mengubah nama' : 'Failed to update name')
      )
    } finally {
      setIsUpdatingName(false)
    }
  }

  const cancelEditName = () => {
    setIsEditingName(false)
    setNameError('')
    setNewName('')
  }

  const handleDeleteAccount = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: isId ? 'Hapus Akun?' : 'Delete Account?',
      message: isId
        ? 'Apakah Anda yakin ingin menghapus akun Anda? Tindakan ini tidak dapat diurungkan. Semua data Anda akan dihapus secara permanen.'
        : 'Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted.',
      confirmText: isId ? 'Ya, Hapus' : 'Yes, Delete',
      cancelText: isId ? 'Batal' : 'Cancel',
      onConfirm: () => {
        handleCloseModal();
        setDeletePassword('');
        setTimeout(() => setIsPasswordModalOpen(true), 150);
      }
    });
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) return;
    
    setIsPasswordModalOpen(false);
    setIsDeleting(true);
    try {
      await api.delete('/auth/account', { data: { password: deletePassword } });
      setModalConfig({
        isOpen: true,
        type: 'success',
        title: isId ? 'Berhasil' : 'Success',
        message: isId ? 'Akun Anda telah berhasil dihapus.' : 'Your account has been successfully deleted.',
        onConfirm: () => {
          handleCloseModal();
          logout();
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || (isId ? 'Gagal menghapus akun. Periksa kembali password Anda.' : 'Failed to delete account. Please check your password.');
      setModalConfig({
        isOpen: true,
        type: 'error',
        title: isId ? 'Gagal' : 'Error',
        message: errorMessage,
        onConfirm: null
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteHistory = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: isId ? 'Hapus Riwayat?' : 'Delete History?',
      message: isId
        ? 'Apakah Anda yakin ingin menghapus seluruh riwayat scan Anda? Tindakan ini tidak dapat diurungkan.'
        : 'Are you sure you want to delete all your scan history? This action cannot be undone.',
      confirmText: isId ? 'Ya, Hapus' : 'Yes, Delete',
      cancelText: isId ? 'Batal' : 'Cancel',
      onConfirm: async () => {
        handleCloseModal();
        setIsDeletingHistory(true);
        try {
          await api.delete('/api/classify/history');
          setModalConfig({
            isOpen: true,
            type: 'success',
            title: isId ? 'Berhasil' : 'Success',
            message: isId ? 'Seluruh riwayat scan berhasil dihapus.' : 'All scan history has been successfully deleted.',
            onConfirm: null
          });
        } catch (err) {
          const errorMessage = err.response?.data?.message || (isId ? 'Gagal menghapus riwayat.' : 'Failed to delete history.');
          setModalConfig({
            isOpen: true,
            type: 'error',
            title: isId ? 'Gagal' : 'Error',
            message: errorMessage,
            onConfirm: null
          });
        } finally {
          setIsDeletingHistory(false);
        }
      }
    });
  };

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
          {isId ? 'Akun & Pengaturan' : 'Account & Settings'}
        </h2>
        <p className="text-sm md:text-base text-slate-600 dark:text-gray-300">
          {isId ? 'Kelola Profil dan Pengaturan Anda' : 'Manage your Profile and Settings'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="col-span-1 p-8 rounded-3xl border flex flex-col items-center text-center shadow-sm transition-colors duration-300 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="relative mb-6 group">
            <img 
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=1E6436&color=fff&size=150`} 
              alt="Profile" 
              className="w-36 h-36 rounded-full object-cover border-4 shadow-md border-white dark:border-gray-700"
            />
            {user?.profileImage && (
              <button
                onClick={handleDeleteImage}
                disabled={isDeletingImage}
                className="absolute top-1 right-1 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors active:scale-95 disabled:cursor-not-allowed"
                title={isId ? 'Hapus Foto' : 'Delete Photo'}
              >
                {isDeletingImage ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                )}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="absolute bottom-1 right-1 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg hover:bg-emerald-700 transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUploadingImage
                ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
              }
            </button>
          </div>

          <div className="w-full mb-1 flex flex-col items-center min-h-10">
            {isEditingName ? (
              <div className="flex flex-col items-center w-full px-4">
                <div className="flex items-center gap-2 w-full max-w-50">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNameSubmit();
                      if (e.key === 'Escape') cancelEditName();
                    }}
                    autoFocus
                    className="w-full text-center text-lg font-bold px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder={isId ? 'Nama baru' : 'New name'}
                    disabled={isUpdatingName}
                  />
                </div>
                {nameError && (
                  <p className="text-red-500 text-xs mt-1">{nameError}</p>
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleNameSubmit}
                    disabled={isUpdatingName}
                    className="bg-emerald-600 text-white p-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {isUpdatingName ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    )}
                  </button>
                  <button
                    onClick={cancelEditName}
                    disabled={isUpdatingName}
                    className="bg-gray-200 text-gray-700 p-1.5 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h2 className="text-2xl font-bold dark:text-white">
                  {user?.name || 'Guest User'}
                </h2>
                <button
                  onClick={() => {
                    setNewName(user?.name || '')
                    setIsEditingName(true)
                  }}
                  className="text-gray-800 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-1 rounded-md group-hover:opacity-100"
                  title={isId ? 'Edit Nama' : 'Edit Name'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </div>
            )}
          </div>

          <p className="text-sm mb-8 mt-1 text-gray-500 dark:text-gray-400">{user?.email}</p>
          
          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={() => setIsResetModalOpen(true)} 
              className="w-full font-semibold px-4 py-3.5 rounded-xl transition-all shadow-sm active:scale-95 border bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              {isId ? 'Ubah Kata Sandi' : 'Change Password'}
            </button>
            <button className='text-red-500 font-semibold py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full' onClick={logout}>
              {isId ? 'Keluar' : 'Logout'}
            </button>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="p-8 rounded-3xl border shadow-sm transition-colors duration-300 bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="p-2">
                <svg className="w-6 h-6 text-black dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
              {isId ? 'Preferensi Aplikasi' : 'App Preferences'}
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-6 border-b border-gray-100 dark:border-gray-700 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{isId ? 'Tema Tampilan' : 'Theme'}</h4>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{isId ? 'Pilih tema untuk seluruh aplikasi' : 'Select theme for the entire app'}</p>
                </div>
                <select
                  className="px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition-colors min-w-37.5 font-medium bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={preferences.theme}
                  onChange={(e) => updatePreferences({ theme: e.target.value })}
                >
                  <option value="system">{isId ? 'Ikuti Sistem' : 'System Default'}</option>
                  <option value="light">{isId ? 'Terang' : 'Light'}</option>
                  <option value="dark">{isId ? 'Gelap' : 'Dark'}</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-6 border-b border-gray-100 dark:border-gray-700 gap-4">
                <div>
                  <h4 className="font-semibold text-lg">{isId ? 'Bahasa' : 'Language'}</h4>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{isId ? 'Pilih bahasa antarmuka' : 'Select interface language'}</p>
                </div>
                <select
                  className="px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-emerald-500 outline-none transition-colors min-w-37.5 font-medium bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={preferences.language}
                  onChange={(e) => updatePreferences({ language: e.target.value })}
                >
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div className="flex justify-between items-center pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="pr-4">
                  <h4 className="font-semibold text-lg">{isId ? 'Simpan Riwayat Scan' : 'Save Scan History'}</h4>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{isId ? 'Otomatis simpan hasil deteksi tanaman' : 'Automatically save scan results'}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={preferences.saveHistory}
                    onChange={(e) => updatePreferences({ saveHistory: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/50 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center pb-2">
                <div className="pr-4">
                  <h4 className="font-semibold text-lg">{isId ? 'Tampilkan Skor Kepercayaan' : 'Show Confidence Score'}</h4>
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">{isId ? 'Tampilkan tingkat akurasi pada hasil diagnosis' : 'Display accuracy percentage in diagnoses'}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={preferences.showConfidenceScore}
                    onChange={(e) => updatePreferences({ showConfidenceScore: e.target.checked })}
                  />
                  <div className="w-14 h-7 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300/50 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800/50">
            <h3 className="text-xl font-bold mb-6 text-red-800 dark:text-red-300 flex items-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              {isId ? 'Zona Berbahaya' : 'Danger Zone'}
            </h3>
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pb-6 border-b border-red-200 dark:border-red-800/50 gap-4">
                <div>
                  <h4 className="font-semibold text-lg text-red-900 dark:text-red-200">{isId ? 'Hapus Riwayat Scan' : 'Delete Scan History'}</h4>
                  <p className="text-sm mt-1 text-red-700 dark:text-red-300/80">{isId ? 'Hapus semua data riwayat deteksi tanaman secara permanen.' : 'Permanently delete all crop detection history data.'}</p>
                </div>
                <button
                  onClick={handleDeleteHistory}
                  disabled={isDeletingHistory}
                  className="font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 border bg-red-600 border-red-700 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {isDeletingHistory 
                    ? (isId ? 'Menghapus...' : 'Deleting...') 
                    : (isId ? 'Hapus Riwayat' : 'Delete History')}
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <h4 className="font-semibold text-lg text-red-900 dark:text-red-200">{isId ? 'Hapus Akun' : 'Delete Account'}</h4>
                  <p className="text-sm mt-1 text-red-700 dark:text-red-300/80">{isId ? 'Hapus akun dan semua data terkait secara permanen.' : 'Permanently delete your account and all associated data.'}</p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 border bg-red-600 border-red-700 text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
                >
                  {isDeleting 
                    ? (isId ? 'Menghapus...' : 'Deleting...') 
                    : (isId ? 'Hapus Akun' : 'Delete Account')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ResetPasswordModal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        userEmail={user?.email} 
        isId={isId} 
      />
      
      <DynamicModal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.onConfirm}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
      />

      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl border border-gray-100 dark:border-gray-700 animate-slide-up">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {isId ? 'Konfirmasi Kata Sandi' : 'Confirm Password'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {isId 
                ? 'Untuk konfirmasi penghapusan akun, masukkan kata sandi Anda:' 
                : 'To confirm account deletion, please enter your password:'}
            </p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-red-500 outline-none transition-colors mb-6 bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder={isId ? 'Kata sandi Anda' : 'Your password'}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmDeleteAccount();
                if (e.key === 'Escape') setIsPasswordModalOpen(false);
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium transition-colors"
              >
                {isId ? 'Batal' : 'Cancel'}
              </button>
              <button
                onClick={confirmDeleteAccount}
                disabled={!deletePassword || isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {isDeleting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                )}
                {isId ? 'Konfirmasi' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}