import React from 'react';

export default function DynamicModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  onConfirm,
  confirmText,
  cancelText = 'Batal'
}) {
  if (!isOpen) return null;

  let icon = null;
  let confirmButtonClass = '';
  let titleClass = 'text-gray-900 dark:text-white';

  switch (type) {
    case 'success':
      confirmButtonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent';
      titleClass = 'text-emerald-600 dark:text-emerald-400';
      icon = (
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-5">
          <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
        </div>
      );
      confirmText = confirmText || 'OK';
      break;
    case 'error':
      confirmButtonClass = 'bg-red-600 hover:bg-red-700 text-white border-transparent';
      titleClass = 'text-red-600 dark:text-red-400';
      icon = (
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/50 mb-5">
          <svg className="h-7 w-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
      );
      confirmText = confirmText || 'Tutup';
      break;
    case 'confirm':
      confirmButtonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent';
      icon = (
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 dark:bg-blue-900/50 mb-5">
          <svg className="h-7 w-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      );
      confirmText = confirmText || 'Ya, Lanjutkan';
      break;
    case 'info':
    default:
      confirmButtonClass = 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent';
      icon = (
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 dark:bg-gray-700 mb-5">
           <svg className="h-7 w-7 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
      );
      confirmText = confirmText || 'Mengerti';
      break;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl w-full max-w-sm p-6 sm:p-8 transform transition-all text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
        <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${titleClass}`}>
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm sm:text-base leading-relaxed">
          {message}
        </p>
        
        <div className={`flex gap-3 justify-center ${type === 'confirm' ? 'flex-row' : 'flex-col w-full'}`}>
          {type === 'confirm' && (
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm active:scale-95">
              {cancelText}
            </button>
          )}
          <button onClick={() => { if (onConfirm) onConfirm(); else onClose(); }} className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all shadow-sm active:scale-95 border ${confirmButtonClass}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
