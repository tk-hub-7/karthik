import { useNavigate } from 'react-router-dom';
import { LogOut, User, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="bg-dark-900 border-b border-dark-700 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        Welcome back, {user?.first_name || user?.username}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-dark-800 rounded-lg transition-all">
                        <Bell className="w-5 h-5" />
                    </button>

                    <div className="flex items-center space-x-3 px-4 py-2 bg-dark-800 rounded-lg">
                        <div className="p-2 bg-primary-600 rounded-full">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user?.username}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
