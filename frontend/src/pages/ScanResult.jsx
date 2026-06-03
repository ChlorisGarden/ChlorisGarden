import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { usePreferences } from '../context/PreferencesContext';
import DynamicModal from '../components/DynamicModal';

export default function ScanHistoryDetail() {
  const { id } = useParams();
  const [historyDetail, setHistoryDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Menggunakan konteks preferensi untuk opsi tampilan confidence score
  const { preferences } = usePreferences();
  const isId = preferences?.language === 'id';
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
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

  useEffect(() => {
    const fetchHistoryDetail = async () => {
      try {
        const res = await api.get(`/api/classify/history/${id}`);
        setHistoryDetail(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history details.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchHistoryDetail();
    }
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': 
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50 rounded-lg text-[11px] font-bold uppercase tracking-wider">Low Severity</span>;
      case 'medium': 
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50 rounded-lg text-[11px] font-bold uppercase tracking-wider">Medium Severity</span>;
      case 'high': 
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50 rounded-lg text-[11px] font-bold uppercase tracking-wider">High Severity</span>;
      default: 
        return null;
    }
  };

  const handleDelete = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      title: isId ? 'Hapus Riwayat?' : 'Delete History?',
      message: isId 
        ? 'Apakah Anda yakin ingin menghapus riwayat pemindaian ini?' 
        : 'Are you sure you want to delete this scan history?',
      confirmText: isId ? 'Ya, Hapus' : 'Yes, Delete',
      cancelText: isId ? 'Batal' : 'Cancel',
      onConfirm: async () => {
        handleCloseModal();
        try {
          setIsDeleting(true);
          await api.delete(`/api/classify/history/${id}`);
          navigate('/history');
        } catch (err) {
          console.error('Failed to delete history:', err);
          setIsDeleting(false);
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 w-full h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-[#1E6436] dark:border-emerald-500"></div>
      </div>
    );
  }

  if (error || !historyDetail) {
    return (
      <div className="w-full">
        <Link to="/history" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to History
        </Link>
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-xl border border-red-100 dark:border-red-800/50 flex items-center gap-3">
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p>{error || 'History detail not found'}</p>
        </div>
      </div>
    );
  }

  const { disease } = historyDetail;

  return (
    <div className="flex flex-col w-full pb-10">
      <div className="flex justify-between items-center mb-6">
        <Link to="/history" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-400 transition-colors w-fit px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back
        </Link>
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:text-white hover:bg-red-600 dark:hover:bg-red-500 transition-colors w-fit px-4 py-2 border border-red-200 dark:border-red-800/50 rounded-lg bg-red-50 dark:bg-red-900/20 shadow-sm disabled:opacity-50"
        >
          {isDeleting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          )}
          {isId ? 'Hapus' : 'Delete'}
        </button>
      </div>

      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg text-[11px] font-bold uppercase tracking-wider border border-gray-200 dark:border-gray-600">
              {disease.cropType}
            </span>
            {getSeverityBadge(disease.severity)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-[#222222] dark:text-white">{disease.name}</h1>
          {disease.scientificName && (
            <p className="text-xl text-slate-500 dark:text-gray-400 italic font-serif">{disease.scientificName}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm inline-block">
            Scanned on {formatDate(historyDetail.createdAt)}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-square border border-gray-200 dark:border-gray-700 shadow-sm relative group">
            <img 
              src={historyDetail.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
              alt={disease.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          {preferences?.showConfidenceScore && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Confidence Level</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(historyDetail.confidenceScore * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-linear-to-r from-emerald-400 to-emerald-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.round(historyDetail.confidenceScore * 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">AI analysis accuracy score</p>
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2 flex flex-col gap-6">
          <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1E6436] dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Description
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">{disease.description}</p>
          </section>

          {disease.rootCauses && (
            <section className="bg-orange-50 dark:bg-orange-900/20 p-6 md:p-8 rounded-2xl border border-orange-100 dark:border-orange-800/50 shadow-sm">
              <h2 className="text-xl font-bold text-orange-800 dark:text-orange-400 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Root Causes
              </h2>
              <p className="text-orange-700 dark:text-orange-300 leading-relaxed text-[15px]">{disease.rootCauses}</p>
            </section>
          )}

          {['symptoms', 'treatment', 'preventiveMeasures'].map((key) => {
            if (!disease[key] || disease[key].length === 0) return null;
            
            const sectionConfig = {
              symptoms: { title: 'Symptoms', color: 'text-red-500 dark:text-red-400', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />, pointColor: 'bg-red-400 dark:bg-red-500' },
              treatment: { title: 'Treatment Options', color: 'text-[#1E6436] dark:text-emerald-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />, pointColor: 'text-[#1E6436] dark:text-emerald-500', isCheck: true },
              preventiveMeasures: { title: 'Preventive Measures', color: 'text-blue-500 dark:text-blue-400', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, pointColor: 'bg-blue-400 dark:bg-blue-500' }
            };
            const conf = sectionConfig[key];

            return (
              <section key={key} className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className={`text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2`}>
                  <svg className={`w-6 h-6 ${conf.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{conf.icon}</svg>
                  {conf.title}
                </h2>
                <ul className="space-y-4">
                  {disease[key].map((item, idx) => (
                    <li key={idx} className="flex gap-4 text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                      {conf.isCheck ? (
                        <svg className={`w-5 h-5 shrink-0 mt-0.5 ${conf.pointColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <div className={`mt-2 shrink-0 w-2 h-2 rounded-full ${conf.pointColor}`}></div>
                      )}
                      <span className="leading-relaxed text-[15px]">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>

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
    </div>
  );
}
