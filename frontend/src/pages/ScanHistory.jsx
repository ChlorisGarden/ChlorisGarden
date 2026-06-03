import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { usePreferences } from '../context/PreferencesContext';
import DynamicModal from '../components/DynamicModal';

export default function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { preferences } = usePreferences();
  const isId = preferences?.language === 'id';
  const [isDeletingId, setIsDeletingId] = useState(null);
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
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/api/classify/history?sort=${sortOrder}`);
        setHistory(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load history. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [sortOrder]);

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
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
          setIsDeletingId(id);
          await api.delete(`/api/classify/history/${id}`);
          setHistory(prev => prev.filter(item => item.id !== id));
        } catch (err) {
          console.error('Failed to delete history:', err);
        } finally {
          setIsDeletingId(null);
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const filteredHistory = useMemo(() => {
    if (!searchTerm.trim()) return history;
    const lowercasedTerm = searchTerm.toLowerCase();
    return history.filter((item) => {
      const diseaseName = item.disease?.name?.toLowerCase() || '';
      const scientificName = item.disease?.scientificName?.toLowerCase() || '';
      return diseaseName.includes(lowercasedTerm) || scientificName.includes(lowercasedTerm);
    });
  }, [history, searchTerm]);

  return (
    <div className="flex flex-col w-full h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{isId ? 'Riwayat' : 'History'}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300">{isId ? 'Tinjau dan kelola diagnosis penyakit tanaman Anda' : 'Review and manage your plant diseases diagnoses'}</p>
        </div>
      </header>

      <main className="w-full flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-[#1E6436] dark:border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-lg border border-red-100 dark:border-red-800/50 flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p>{error}</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400 mb-4 text-lg">{isId ? 'Anda belum melakukan pemindaian apa pun.' : 'You haven\'t made any scans yet.'}</p>
            <Link to="/scan" className="bg-[#1E6436] dark:bg-emerald-600 text-white px-6 py-2.5 rounded-md hover:bg-green-800 dark:hover:bg-emerald-700 transition-colors font-medium">
              {isId ? 'Mulai pemindaian pertama Anda' : 'Start your first scan'}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder={isId ? "Cari nama penyakit atau ilmiah..." : "Search by disease or scientific name..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white border-gray-200 text-gray-800 focus:ring-2 focus:ring-[#1E6436] outline-none transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-emerald-500"
                />
              </div>
              
              <button
                onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border bg-white border-gray-200 text-gray-800 hover:bg-gray-50 focus:ring-2 focus:ring-[#1E6436] outline-none transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-emerald-500 cursor-pointer"
              >
                <svg className={`lucide lucide-arrow-down-wide-narrow-icon lucide-arrow-down-wide-narrow w-5 h-5 transition-transform duration-300 ${sortOrder === 'oldest' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/></svg>
                <span className="font-medium">
                  {sortOrder === 'newest' ? (isId ? 'Terbaru' : 'Newest') : (isId ? 'Terlama' : 'Oldest')}
                </span>
              </button>
            </div>
            
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12 rounded-xl dark:border-gray-700 shadow-sm">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {isId ? 'Tidak ada riwayat yang cocok dengan pencarian Anda.' : 'No history matches your search.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
                {filteredHistory.map((item) => (
              <Link 
                key={item.id} 
                to={`/history/${item.id}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col relative"
              >
                <div className="h-48 w-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.disease.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {preferences?.showConfidenceScore && (
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#1E6436] dark:text-emerald-400 shadow-sm">
                      {(item.confidenceScore * 100).toFixed(0)}% Match
                    </div>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    disabled={isDeletingId === item.id}
                    className="absolute top-3 left-3 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg shadow-sm transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title={isId ? 'Hapus' : 'Delete'}
                  >
                    {isDeletingId === item.id ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    )}
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded border border-transparent dark:border-gray-600">{item.disease.cropType}</span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">{formatDate(item.createdAt)}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1 leading-tight line-clamp-1 group-hover:text-[#1E6436] dark:group-hover:text-emerald-400 transition-colors" title={item.disease.name}>{item.disease.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3 line-clamp-1">{item.disease.scientificName}</p>
                </div>
              </Link>
            ))}
              </div>
            )}
          </div>
        )}
      </main>

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