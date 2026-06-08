import React from 'react';
import { Home, BookOpen, Trophy, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: '首页', path: '/' },
        { icon: BookOpen, label: '打卡', path: '/checkin' },
        { icon: Trophy, label: '排行', path: '/rankings' },
        { icon: User, label: '我的', path: '/profile' },
    ];

    return (
        <div className="bg-gray-50">
            <main className="max-w-md mx-auto bg-white shadow-2xl overflow-hidden relative pb-20">
                {children}
            </main>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="max-w-md mx-auto flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink 
                                key={item.path} 
                                to={item.path}
                                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-current opacity-20 stroke-[2.5px]' : ''}`} />
                                <span className="text-[10px] font-medium mt-1">{item.label}</span>
                                {isActive && <div className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-full"></div>}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default Layout;
