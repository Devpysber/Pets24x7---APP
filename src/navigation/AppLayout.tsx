import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { BottomTabs } from './BottomTabs';
import { MapPin, Bell, LogIn } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { LoginModal } from '../components/LoginModal';
import { generateLogo } from '../services/gemini';

export const AppLayout: React.FC = () => {
  const { location: userLocation, user, notifications } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const isDetailView = location.pathname.startsWith('/service/');

  useEffect(() => {
    const fetchLogo = async () => {
      // Check cache first
      const cachedLogo = localStorage.getItem('app_logo_url');
      if (cachedLogo) {
        setLogoUrl(cachedLogo);
        return;
      }

      try {
        const url = await generateLogo('Pets24x7');
        if (url) {
          setLogoUrl(url);
          localStorage.setItem('app_logo_url', url);
        }
      } catch (error) {
        console.error('Error generating logo:', error);
        // Fallback is already handled by the UI (logoUrl being null)
      }
    };
    fetchLogo();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="mx-auto max-w-md bg-white min-h-screen shadow-xl relative">
        {!isDetailView && (
          <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl px-4 py-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {logoUrl ? (
                  <div className="h-10 w-10 rounded-xl overflow-hidden bg-indigo-50 border border-indigo-100 shadow-sm">
                    <img 
                      src={logoUrl} 
                      alt="Pets24x7 Logo" 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                    P24
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Your Location</span>
                  <div className="flex items-center gap-1 text-indigo-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-bold">{userLocation}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-full bg-gray-50 border border-black/5 hover:bg-gray-100 transition-colors"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[8px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
                {user ? (
                  <button 
                    onClick={() => navigate('/profile')}
                    className="h-9 w-9 rounded-full bg-gray-100 border border-black/5 overflow-hidden"
                  >
                    <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsLoginOpen(true)}
                    className="h-9 px-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    <LogIn className="h-3 w-3" />
                    LOGIN
                  </button>
                )}
              </div>
            </div>
          </header>
        )}
        <main className="p-0">
          <Outlet />
        </main>
        {!isDetailView && <BottomTabs />}
        
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </div>
    </div>
  );
};
