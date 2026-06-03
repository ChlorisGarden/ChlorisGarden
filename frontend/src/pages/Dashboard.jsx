import { useAuth } from '../context/AuthContext'
import { usePreferences } from '../context/PreferencesContext'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler
)

const formatMonth = (key, isId) => {
  const [year, month] = key.split('-')
  const date = new Date(year, parseInt(month) - 1, 1)
  return date.toLocaleDateString(isId ? 'id-ID' : 'en-US', {
    month: 'short', year: '2-digit',
  })
}

// Line Chart Component
function MonthlyTrendChart({ data, isId }) {
  const isDark = document.documentElement.classList.contains('dark')
  const gridColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'
  const labelColor = isDark ? '#9ca3af' : '#64748b'

  const chartData = {
    labels: data.map(d => formatMonth(d.month, isId)),
    datasets: [{
      label: isId ? 'Jumlah Scan' : 'Total Scans',
      data: data.map(d => d.count),
      fill: true,
      tension: 0.4,
      borderColor: '#1E6436',
      backgroundColor: 'rgba(30,100,54,0.12)',
      pointBackgroundColor: '#1E6436',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#fff',
        titleColor: isDark ? '#f3f4f6' : '#111827',
        bodyColor: isDark ? '#9ca3af' : '#64748b',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: ctx => ` ${ctx.parsed.y} ${isId ? 'scan' : 'scans'}`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: labelColor, font: { size: 12 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: {
          color: labelColor,
          font: { size: 12 },
          stepSize: 1,
          precision: 0,
        },
      },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
        {isId ? 'Tren Scan per Bulan' : 'Monthly Scan Trend'}
      </h2>
      <p className="text-sm text-slate-400 dark:text-gray-500 mb-5">
        {isId ? '6 bulan terakhir' : 'Last 6 months'}
      </p>
      <div className="relative h-56 w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}

// Pie Chart Component
function SeverityDistributionChart({ data, isId }) {
  const SEVERITY_CONFIG = {
    healthy: {
      label: isId ? 'Sehat'   : 'Healthy',
      color: '#10b981',
    },
    low: {
      label: isId ? 'Rendah'  : 'Low',
      color: '#facc15',
    },
    medium: {
      label: isId ? 'Sedang'  : 'Medium',
      color: '#f97316',
    },
    high: {
      label: isId ? 'Tinggi'  : 'High',
      color: '#ef4444',
    },
  }

  const filtered = data.filter(d => Number(d.count) > 0)
  const total    = filtered.reduce((s, d) => s + Number(d.count), 0)

  const chartData = {
    labels: filtered.map(d => SEVERITY_CONFIG[d.severity?.toLowerCase()]?.label ?? d.severity),
    datasets: [{
      data: filtered.map(d => Number(d.count)),
      backgroundColor: filtered.map(d => SEVERITY_CONFIG[d.severity?.toLowerCase()]?.color ?? '#94a3b8'),
      borderWidth: 2,
      borderColor: 'transparent',
      hoverOffset: 8,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b',
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const pct = total > 0 ? ((ctx.parsed / total) * 100).toFixed(1) : 0
            return ` ${ctx.label}: ${ctx.parsed} (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
        {isId ? 'Distribusi Keparahan' : 'Severity Distribution'}
      </h2>
      <p className="text-sm text-slate-400 dark:text-gray-500 mb-5">
        {isId ? 'Berdasarkan semua scan' : 'Based on all scans'}
      </p>
      <div className="relative h-56 w-full">
        <Pie data={chartData} options={options} />
      </div>
    </div>
  )
}

// Main Dashboard
export default function Dashboard() {
  const { preferences } = usePreferences()
  const isId = preferences.language === 'id'
  const { user } = useAuth()
  const navigate = useNavigate()

  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading]         = useState(true)
  const [error, setError]                 = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/api/dashboard')
        setDashboardData(response.data.data)
      } catch (err) {
        console.error('Error fetching dashboard:', err)
        setError(isId ? 'Gagal memuat data dashboard.' : 'Failed to load dashboard data.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [isId])

  return (
    <div>
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-2 text-gray-900 dark:text-gray-200">
            {isId ? 'Dasbor' : 'Dashboard'}
          </h2>
          <p className="text-sm md:text-base slate-600 dark:text-gray-300">
            {isId ? 'Ringkasan aktivitas pemindaian Anda' : 'Summary of your scan activity'}
          </p>
        </div>
        <div className="text-right">
          <p className="md:text-xl text-slate-500">
            Hello, <span className="font-bold text-gray-900 dark:text-gray-200">{user?.name}</span>
          </p>
          <button
            onClick={() => navigate('/scan')}
            className="mt-4 bg-[#1E6436] text-white px-4 py-2 rounded text-sm hover:bg-green-800 transition-colors"
          >
            + {isId ? 'Scan' : 'Scan'}
          </button>
        </div>
      </header>

      <main>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1E6436]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : dashboardData && (
          <div className="space-y-8 animate-fade-in">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 px-4 py-6 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-slate-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-2">
                  {isId ? 'Total Scan' : 'Total Scans'}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{dashboardData.totalScans}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-6 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h3 className="text-slate-500 dark:text-gray-400 text-xs md:text-sm font-medium mb-2">
                  {isId ? 'Scan Bulan Ini' : 'Scans This Month'}
                </h3>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{dashboardData.scansThisMonth}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-6 md:p-6 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 shadow-sm">
                <h3 className="text-emerald-700 dark:text-emerald-400 text-xs md:text-sm font-medium mb-2">
                  {isId ? 'Tanaman Sehat' : 'Healthy Crops'}
                </h3>
                <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-500">
                  {dashboardData.healthyPercentage}%
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 px-4 py-6 md:p-6 rounded-2xl border border-red-100 dark:border-red-800/50 shadow-sm">
                <h3 className="text-red-700 dark:text-red-400 text-xs md:text-sm font-medium mb-2">
                  {isId ? 'Tanaman Sakit' : 'Diseased Crops'}
                </h3>
                <p className="text-4xl font-bold text-red-600 dark:text-red-500">
                  {dashboardData.totalScans > 0 
                    ? Math.round(100 - Number(dashboardData.healthyPercentage)) 
                    : 0}%
                </p>
              </div>
            </div>

            {dashboardData.charts && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dashboardData.charts.monthlyTrend?.length > 0 && (
                  <MonthlyTrendChart
                    data={dashboardData.charts.monthlyTrend}
                    isId={isId}
                  />
                )}
                {dashboardData.charts.severityDistribution && dashboardData.charts.severityDistribution.length > 0 && (
                  <SeverityDistributionChart
                    data={dashboardData.charts.severityDistribution}
                    isId={isId}
                  />
                )}
              </div>
            )}

            {dashboardData.lastScan && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  {isId ? 'Hasil Deteksi Terakhir' : 'Last Detection Result'}
                </h2>
                <div className="flex gap-5 items-center">
                  <img
                    src={dashboardData.lastScan.imageUrl || 'https://placehold.co/400x400?text=No+Image'}
                    alt="Last scan"
                    className="w-24 h-24 object-cover rounded-xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                  />
                  <div>
                    <p className="font-bold text-xl text-gray-900 dark:text-white">
                      {dashboardData.lastScan.disease?.name || (isId ? 'Tidak Teridentifikasi' : 'Unidentified')}
                    </p>
                    <p className="text-slate-500 dark:text-gray-400 capitalize mt-1">
                      {isId ? 'Tanaman: ' : 'Crop: '}{dashboardData.lastScan.disease?.cropType}
                    </p>
                    {preferences.showConfidenceScore && (
                      <div className="inline-flex items-center gap-1.5 mt-3 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md">
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                          {isId ? 'Akurasi: ' : 'Accuracy: '}
                          {(dashboardData.lastScan.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {dashboardData.recentHistory?.length > 0 && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isId ? 'Riwayat Deteksi Terbaru' : 'Recent Detection History'}
                  </h2>
                  <button
                    onClick={() => navigate('/history')}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    {isId ? 'Lihat Semua' : 'View All'}
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {dashboardData.recentHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/history/${item.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-gray-50 dark:border-gray-700 hover:border-emerald-100 dark:hover:border-emerald-900/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all cursor-pointer group"
                    >
                      <img
                        src={item.imageUrl || 'https://placehold.co/400x400?text=No+Image'}
                        alt={item.disease?.name || 'Scan result'}
                        className="w-14 h-14 object-cover rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {item.disease?.name || (isId ? 'Tidak Teridentifikasi' : 'Unidentified')}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] md:text-xs text-slate-500 dark:text-gray-400">
                          <span className="capitalize">{item.disease?.cropType}</span>
                          <span>•</span>
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(isId ? 'id-ID' : 'en-US', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      {preferences.showConfidenceScore && (
                        <div className="pl-4">
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-500">
                            {(item.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      )}
                      <div className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors ml-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}