import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    ArrowLeftRight,
    UserCheck,
    Package
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'base_commander', 'logistics_officer'] },
        { path: '/purchases', icon: ShoppingCart, label: 'Purchases', roles: ['admin', 'base_commander', 'logistics_officer'] },
        { path: '/transfers', icon: ArrowLeftRight, label: 'Transfers', roles: ['admin', 'base_commander', 'logistics_officer'] },
        { path: '/assignments', icon: UserCheck, label: 'Assignments', roles: ['admin', 'base_commander'] },
    ];

    const filteredMenuItems = menuItems.filter(item =>
        item.roles.includes(user?.role?.role)
    );

    return (
        <div className="w-64 bg-dark-900 border-r border-dark-700 min-h-screen flex flex-col">
            <div className="p-6 border-b border-dark-700">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-600 rounded-lg">
                        <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Military AMS</h1>
                        <p className="text-xs text-gray-400">Asset Management</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-primary-600 text-white shadow-glow'
                                    : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-dark-700">
                <div className="px-4 py-3 bg-dark-800 rounded-lg">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Role</p>
                    <p className="text-sm font-medium text-white">{user?.role?.role_display}</p>
                    {user?.assigned_base && (
                        <>
                            <p className="text-xs text-gray-400 uppercase tracking-wide mt-2 mb-1">Base</p>
                            <p className="text-sm font-medium text-white">{user.assigned_base.name}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
