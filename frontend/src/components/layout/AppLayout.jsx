import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import MainContent from '../mainContent/MainContent';
import { useOnboarding } from '../../hooks/onboarding';
import OnboardingModal from '../onboarding/OnboardingModal';

export default function AppLayout() {
    const getInitialExpanded = () => window.innerWidth >= 1024;

    const [isExpanded, setIsExpanded] = useState(getInitialExpanded);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { showWelcome, finishWelcome } = useOnboarding({
        setIsExpanded,
        setIsMobileOpen
    });

    useEffect(() => {
        const onResize = () => {
        if (window.innerWidth >= 1024) {
            setIsExpanded(true);
            setIsMobileOpen(false);
        } else if (window.innerWidth >= 768) {
            setIsExpanded(false);
            setIsMobileOpen(false);
        } else {
            setIsMobileOpen(false);
        }
        };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const handleMobileClose = () => setIsMobileOpen(false);

    return (
        <div className="flex h-screen w-full bg-[#E4E4E4] dark:bg-gray-900 font-sans overflow-hidden">
            {showWelcome && <OnboardingModal onFinish={finishWelcome} />}

            {/*Mobile overlay backdrop*/}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 md:hidden"
                    onClick={handleMobileClose}
                />
            )}

            <div className={`fixed z-30 h-full md:static md:z-auto md:h-auto transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            >
                <Sidebar
                    isExpanded={isExpanded}
                    setIsExpanded={setIsExpanded}
                    onNavigate={handleMobileClose}
                />
            </div>

            {/*Main area*/}
            <div className="flex flex-col flex-1 min-w-0">
                {/* Mobile top bar */}
                <div className="flex items-center gap-3 px-4 py-3 bg-[#E4E4E4] dark:bg-gray-900 md:hidden">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="text-slate-500 hover:text-slate-800 transition-colors p-1 rounded-md"
                        aria-label="Open menu"
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <span className="font-semibold text-[#19793F] dark:text-[#ffffff] whitespace-nowrap flex-1 overflow-hidden">Chloris Garden</span>
                </div>

                <MainContent>
                    <Outlet />
                </MainContent>
            </div>
        </div>
    );
}