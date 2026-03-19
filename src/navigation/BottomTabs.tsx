import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, PlusCircle, Users, User } from 'lucide-react';
import { cn } from '../utils/theme';

const TABS = [
  { name: 'Home', icon: Home, path: '/' },
  { name: 'Explore', icon: Search, path: '/explore' },
  { name: 'Lost & Found', icon: PlusCircle, path: '/lost-found' },
  { name: 'Community', icon: Users, path: '/community' },
  { name: 'Profile', icon: User, path: '/profile' },
];

export const BottomTabs: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/5 bg-white/80 backdrop-blur-xl pb-safe">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
        {TABS.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive ? 'text-indigo-600' : 'text-gray-400'
              )
            }
          >
            <tab.icon className="h-6 w-6" />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
