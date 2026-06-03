import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { usePreferences } from '../context/PreferencesContext';

export default function EncyclopediaUser() {
  const [diseases, setDiseases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { preferences } = usePreferences();
  const isId = preferences.language === 'id';

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const res = await api.get('/api/diseases/', {
          params: { lang: preferences.language }
        });
        setDiseases(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load encyclopedia data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseases();
  }, [preferences.language]);

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800/50';
      case 'high': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/50';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const filteredDiseases = useMemo(() => {
    let result = diseases;

    if (severityFilter !== 'all') {
      result = result.filter(disease => disease.severity?.toLowerCase() === severityFilter.toLowerCase());
    }

    if (searchTerm.trim()) {
      const lowercasedTerm = searchTerm.toLowerCase();
      result = result.filter((disease) => {
        const diseaseName = disease.name?.toLowerCase() || '';
        const scientificName = disease.scientificName?.toLowerCase() || '';
        return diseaseName.includes(lowercasedTerm) || scientificName.includes(lowercasedTerm);
      });
    }
    return result;
  }, [diseases, searchTerm, severityFilter]);

  return (
    <div className="flex flex-col w-full h-full">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
            {isId ? "Ensiklopedia" : "Encyclopedia"}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300">
            {isId 
              ? "Database komprehensif tentang penyakit tanaman tomat" 
              : "Comprehensive database of tomato plant diseases"
            }
          </p>
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
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  placeholder={isId ? "Cari berdasarkan penyakit atau nama ilmiah..." : "Search by disease or scientific name..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white border-gray-200 text-gray-800 focus:ring-2 focus:ring-[#1E6436] outline-none transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-emerald-500"
                />
              </div>

              <div className="flex p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                {['all', 'low', 'medium', 'high'].map((severity) => (
                  <button
                    key={severity}
                    onClick={() => setSeverityFilter(severity)}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                      severityFilter === severity
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-600'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {severity}
                  </button>
                ))}
              </div>
            </div>

            {filteredDiseases.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {isId 
                    ? "Tidak ada entri ensiklopedia yang sesuai dengan pencarian Anda." 
                    : "No encyclopedia entries match your search."
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                {filteredDiseases.map((disease) => (
              <Link 
                key={disease.id} 
                to={`/encyclopedia-app/${disease.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-md">
                    {disease.cropType}
                  </span>
                  {disease.severity && (
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${getSeverityColor(disease.severity)}`}>
                      {disease.severity}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1 group-hover:text-[#1E6436] dark:group-hover:text-emerald-400 transition-colors line-clamp-2">{disease.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-4">{disease.scientificName || 'Unknown'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-6 flex-1 leading-relaxed">{disease.description}</p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[#1E6436] dark:text-emerald-500 text-sm font-semibold">
                  <span>{isId ? "Lihat Detail" : "View Details"}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </Link>
            ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}