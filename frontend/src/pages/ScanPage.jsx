import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { usePreferences } from '../context/PreferencesContext';

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const { preferences } = usePreferences()
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const isId = preferences.language === 'id';
  const streamRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
      setError('');
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setScanResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setError('');
    } catch (err) {
      setError('Gagal mengakses kamera. Pastikan Anda telah memberikan izin kamera.');
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null; 
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
          setScanResult(null);
          setError('');
          
          stopCamera();
          setActiveTab('upload');
        }
      }, 'image/jpeg', 0.9);
    }
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const handleScan = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('image', selectedFile);
    
    formData.append('saveHistory', preferences.saveHistory); 
    
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setScanResult(res.data);
    } catch (err) {
      setError(isId ? (err.response?.data?.message || 'Gagal memindai gambar. Silakan coba lagi.') : (err.response?.data?.message || 'Failed to scan image. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{isId ? 'Analisis Tanaman' : 'Scan Crop'}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-gray-300">{isId ? 'Unggah atau ambil gambar tanaman untuk mendeteksi penyakit tomat secara instan' : 'Upload or capture a crop to detect tomato disease instantly'}</p>
        </div>
      </header>

      <main className="flex flex-col items-center w-full">
        <nav className="flex w-full max-w-full rounded-md mb-6">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 text-center rounded-l-md transition-colors ${activeTab === 'upload' ? 'bg-[#1E6436] text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
          >
            Upload Image
          </button>
          <button 
            onClick={() => setActiveTab('camera')}
            className={`flex-1 py-2 rounded-r-md text-center transition-colors ${activeTab === 'camera' ? 'bg-[#1E6436] text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
          >
            Capture
          </button>
        </nav>

        <div className="w-full max-w-full mx-auto bg-white dark:bg-gray-800 dark:border-gray-600 border-2 border-dashed border-emerald-200 hover:border-emerald-300 dark:hover:border-gray-500 rounded-3xl flex flex-col items-center justify-center p-10 min-h-100 shadow-lg shadow-emerald-900/5 transition-all duration-300 group">
          {activeTab === 'upload' ? (
            <div className="flex flex-col items-center text-center w-full">
              {!previewUrl ? (
                <div className="flex flex-col items-center animate-fade-in text-center max-w-sm">
                  <div className="bg-emerald-50 dark:bg-gray-700 dark:border-gray-600 p-6 rounded-full mb-5 shadow-sm border border-emerald-100 transition-transform duration-300">
                    <svg className="w-12 h-12 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2"> {isId ? 'Upload Gambar Anda di sini' : 'Upload your image here'}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{isId ? 'Format yang didukung: JPG, PNG, WEBP (Maks 5 Mb)' : 'Supported Formats: JPG, PNG, WEBP (Max 5 Mb)'}</p>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png, image/webp" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-emerald-700 text-white font-medium px-8 py-3 rounded-xl hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-700/20 active:scale-95 transition-all duration-200 w-full md:w-auto"
                  >
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row md:gap-10 items-center justify-around w-full transition-all animate-fade-in">
                  <div className="relative mb-8 md:mb-0 w-full md:w-72 h-72 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-inner group/image">
                    <img 
                      src={previewUrl} 
                      alt="Crop preview" 
                      className="w-full h-full rounded-2xl object-cover shadow-sm transition-transform duration-500 hover:scale-[1.02]" 
                    />
                    {!isLoading && !scanResult && (
                      <button 
                        onClick={clearSelection}
                        className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 hover:scale-110 shadow-lg transition-all z-10"
                        title={isId ? "Hapus gambar" : "Remove Image"}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center w-full max-w-md">
                    {error && (
                      <div className="text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-600 rounded-xl px-5 py-3 mb-5 text-sm w-full animate-shake flex items-center gap-2">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        {isId ? error : error}
                      </div>
                    )}
                    
                    {scanResult?.result ? (
                      <div className="w-full bg-white dark:bg-gray-800 dark:border-gray-600 border border-gray-100 rounded-2xl p-6 shadow-xl shadow-emerald-900/5 flex flex-col gap-6 animate-slide-up">
                        
                        <div className="flex justify-between items-center pb-4 border-b border-gray-50">
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {isId ? 'Analisis Selesai' : 'Analysis Complete'}
                          </div>
                          {scanResult.result.disease?.cropType && (
                            <span className="text-xs font-bold tracking-wide px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg uppercase border border-emerald-100">
                              {scanResult.result.disease.cropType}
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">
                            {isId ? 'Hasil Analisis' : 'Analysis Results'}
                          </p>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
                            {scanResult.result.disease?.name || 'Unknown'}
                          </h3>
                          {scanResult.result.disease?.scientificName && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1.5">
                              {scanResult.result.disease.scientificName}
                            </p>
                          )}
                        </div>

                        {preferences.showConfidenceScore && scanResult.result.confidenceScore && (
                          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-gray-500">Confidence Level</span>
                              <span className="text-sm font-bold text-emerald-600">
                                {Math.round(scanResult.result.confidenceScore * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-linear-to-r from-emerald-400 to-emerald-600 h-2 rounded-full transition-all duration-1000 ease-out" 
                                style={{ width: `${Math.round(scanResult.result.confidenceScore * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        <div className="mt-2 flex gap-3">
                          <button 
                            onClick={() => scanResult.result?.classificationId && navigate(`/history/${scanResult.result.classificationId}`)}
                            className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all text-sm"
                          >
                            {isId ? 'Lihat Detail' : 'View Details'}
                          </button>
                          <button 
                            onClick={clearSelection}
                            className="flex-1 bg-emerald-700 text-white font-semibold px-4 py-3 rounded-xl hover:bg-emerald-800 transition-all text-sm shadow-md shadow-emerald-700/20 active:scale-95"
                          >
                            {isId ? 'Pindai Lainnya' : 'Scan Another'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={handleScan}
                        disabled={isLoading}
                        className="w-full bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-700/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                            </svg>
                            Scan Now
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center w-full max-w-lg animate-fade-in">
              
              {error && (
                <div className="text-red-600 bg-red-50 p-3 rounded-lg mb-4 text-sm w-full">
                  {error}
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-800 w-full rounded-2xl flex flex-col items-center justify-center mb-6 border border-gray-200 dark:border-gray-600 overflow-hidden relative">
                
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-auto max-h-96 object-cover ${!isCameraActive ? 'hidden' : 'block'}`}
                />
                
                <canvas ref={canvasRef} className="hidden" />

                {!isCameraActive && !error && (
                  <div className="flex flex-col items-center gap-4 py-24 animate-pulse">
                    <svg className="animate-spin h-10 w-10 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-500 font-medium text-sm">{isId ? 'Memulai kamera...' : 'Starting camera...'}</span>
                  </div>
                )}
                
                {!isCameraActive && error && (
                  <div className="flex flex-col items-center gap-3 py-24">
                    <svg className="w-12 h-12 text-gray-300 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-400 dark:text-gray-500 font-medium text-sm">{isId ? 'Gagal mengakses kamera' : 'Failed to access camera'}</span>
                  </div>
                )}
              </div>

              {isCameraActive ? (
                <button 
                  onClick={capturePhoto}
                  className="bg-emerald-700 text-white font-medium px-8 py-4 rounded-xl hover:bg-emerald-800 transition-all shadow-md hover:shadow-emerald-700/20 active:scale-95 w-full flex items-center justify-center gap-2 text-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {isId ? 'Ambil Foto' : 'Capture Photo'}
                </button>
              ) : error ? (
                <button 
                  onClick={startCamera}
                  className="bg-gray-600 text-white font-medium px-8 py-3 rounded-xl hover:bg-gray-700 transition-all shadow-md active:scale-95 w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {isId ? 'Coba Lagi' : 'Try Again'}
                </button>
              ) : null}
            </div>
          )}
        </div>

        <div className="w-full max-w-full mt-10 border border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#1E6436] dark:text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isId ? 'Tips untuk Hasil Analisis Yang Lebih Baik' : 'Tips for Better Scanning Results'}</h2>
          </div>
          <ul className="list-disc px-6 md:px-14 list-inside text-slate-700 dark:text-gray-300 space-y-2">
            <li> {isId ? 'Pastikan tanaman terang dan terlihat jelas dalam gambar.' : 'Ensure the crop is well-lit and clearly visible in the image.'}</li>
            <li>{isId ? 'Hindari foto yang buram atau resolusi rendah untuk analisis yang lebih akurat.' : 'Avoid blurry or low-resolution photos for more accurate analysis.'}</li>
            <li>{isId ? 'Coba tangkap area yang terkena tanaman untuk deteksi penyakit yang lebih baik.' : 'Try to capture the affected area of the plant for better disease detection.'}</li>
            <li>{isId ? 'Gunakan latar belakang polos untuk membantu model fokus pada tanaman.' : 'Use a plain background to help the model focus on the crop.'}</li>
            <li>{isId ? 'Untuk pemindaian kamera langsung, pegang perangkat Anda dengan stabil dan izinkan kamera untuk fokus sebelum mengambil gambar.' : 'For live camera scans, hold your device steady and allow the camera to focus before capturing.'}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}