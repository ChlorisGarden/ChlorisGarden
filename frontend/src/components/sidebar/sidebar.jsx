import { Home, ScanLine, History, BookOpen, UserCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogoIcon } from '../Logo';
import { usePreferences } from '../../context/PreferencesContext';

const menuItems = [
    { id: 'dashboard', label: { en: 'Dashboard', id: 'Dasbor' }, path: '/dashboard', icon: Home, shortcut: 1 },
    { id: 'scan', label: { en: 'Scan', id: 'Pindai' }, path: '/scan', icon: ScanLine, shortcut: 2 },
    { id: 'history', label: { en: 'Scan History', id: 'Riwayat' }, path: '/history', icon: History, shortcut: 3 },
    { id: 'encyclopedia', label: { en: 'Encyclopedia', id: 'Ensiklopedia' }, path: '/encyclopedia-app', icon: BookOpen, shortcut: 4 },
    { id: 'account', label: { en: 'Account & Settings', id: 'Akun & Pengaturan' }, path: '/profile', icon: UserCircle, shortcut: 5 },
];

function useShortcut(menuItems, navigate) {
    useEffect(() => {
        const handler = (e) => {
            if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
            const num = parseInt(e.key);
            if (num >= 1 && num <= menuItems.length) {
                navigate(menuItems[num - 1].path);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [menuItems, navigate]);
}

export default function Sidebar({ isExpanded, setIsExpanded, onNavigate }) {
    const { preferences } = usePreferences();
    const isId = preferences.language === 'id';
    const location = useLocation();
    const navigate = useNavigate();

    useShortcut(menuItems, navigate);

    const handleNavigate = (path) => {
        navigate(path);
        onNavigate?.();
    };

    return (
        <aside
            style={{
                width: isExpanded ? 256 : 80,
                transition: 'width 300ms cubic-bezier(0.4,0,0.2,1)',
            }}
            className="relative flex flex-col h-full pt-6 pb-4 shrink-0 overflow-hidden bg-[#E4E4E4] dark:bg-gray-900"
        >
            <div id='sidebar-logo' className="relative flex items-center mb-8 px-4" style={{ height: 40 }}>
                <div
                    className="absolute inset-0 items-center justify-center hidden md:flex"
                    style={{
                        opacity: isExpanded ? 0 : 1,
                        pointerEvents: isExpanded ? 'none' : 'auto',
                        transition: 'opacity 200ms ease',
                    }}
                >
                <button id="sidebar-toggle"
                    onClick={() => setIsExpanded(true)}
                    className="text-slate-500 dark:text-white hover:text-slate-800 dark:hover:text-gray-300 transition-colors p-1 rounded-md"
                    title="Expand sidebar"
                >
                    <PanelLeftOpen size={22} />
                </button>
                </div>

                <div
                    className="absolute inset-0 flex items-center px-4 gap-2"
                    style={{
                        opacity: isExpanded ? 1 : 0,
                        pointerEvents: isExpanded ? 'auto' : 'none',
                        transition: 'opacity 200ms ease',
                }}
                >
                <div className="shrink-0 dark:bg-gray-800 text-white p-1 rounded-md">
                    <LogoIcon />
                </div>
                <span className="font-semibold text-xl text-slate-800 dark:text-[#ffffff] whitespace-nowrap flex-1 overflow-hidden">
                    Chloris Garden
                </span>
                <button
                    onClick={() => setIsExpanded(false)}
                    className="shrink-0 text-slate-500 dark:text-white hover:text-slate-800 dark:hover:text-gray-300 transition-colors p-1 rounded-md hidden md:block"
                    title="Collapse sidebar"
                >
                    <PanelLeftClose size={22} />
                </button>
                </div>
            </div>

            <nav id="sidebar-nav" className="flex flex-col gap-1 px-3">
                {menuItems.map(({ id, label, path, icon: Icon, shortcut }) => {
                    const active = location.pathname.startsWith(path);
                    const currentLabel = label[isId ? 'id' : 'en'];
                    return (
                        <button
                            key={id}
                            id={id}
                            onClick={() => handleNavigate(path)}
                            title={!isExpanded ? `${currentLabel} (${shortcut})` : ''}
                            className={`flex items-center gap-2 w-full rounded-2xl transition-colors duration-200 overflow-hidden ${
                                active
                                ? 'bg-white shadow text-slate-800 dark:bg-black dark:text-white'
                                : 'text-slate-600 dark:text-white hover:bg-black/5 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-gray-300'
                            }`}
                            style={{
                                padding: '10px 12px',
                                justifyContent: isExpanded ? 'flex-start' : 'center',
                            }}
                        >
                        <Icon size={22} className="shrink-0" />
                        <span
                            className="flex items-center justify-between overflow-hidden"
                            style={{
                            maxWidth: isExpanded ? 200 : 0,
                            opacity: isExpanded ? 1 : 0,
                            marginLeft: isExpanded ? 12 : 0,
                            transition:
                                'max-width 300ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease, margin-left 300ms ease',
                            }}
                        >
                            <span className="whitespace-nowrap text-sm font-medium">{currentLabel}</span>
                            <kbd
                                className="ml-2 text-xs font-medium text-slate-51200 dark:text-gray-200 bg-slate-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-md whitespace-nowrap"
                                style={{ lineHeight: 1.4 }}
                            >
                                {shortcut}
                            </kbd>
                        </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}