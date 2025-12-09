import { useState, useEffect } from 'react';
import {
    TrendingUp,
    Package,
    UserCheck,
    AlertTriangle,
    ShoppingCart,
    ArrowLeftRight
} from 'lucide-react';
import api from '../api/axios';
import DataCard from '../components/DataCard';
import Modal from '../components/Modal';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [filters, setFilters] = useState({
        base_id: '',
        equipment_type_id: '',
        start_date: '',
        end_date: '',
    });

    const { user } = useAuth();

    useEffect(() => {
        fetchBases();
        fetchEquipmentTypes();
        fetchStats();
    }, [filters]);

    const fetchBases = async () => {
        try {
            const response = await api.get('/bases/');
            setBases(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching bases:', error);
        }
    };

    const fetchEquipmentTypes = async () => {
        try {
            const response = await api.get('/equipment-types/');
            setEquipmentTypes(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching equipment types:', error);
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await api.get(`/dashboard/stats/?${params}`);
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    if (loading && !stats) {
        return (
            <div className="flex h-screen bg-dark-950">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-dark-950">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Filters */}
                    <div className="card p-6 mb-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="label">Base</label>
                                <select
                                    className="input"
                                    value={filters.base_id}
                                    onChange={(e) => handleFilterChange('base_id', e.target.value)}
                                >
                                    <option value="">All Bases</option>
                                    {bases.map(base => (
                                        <option key={base.id} value={base.id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Equipment Type</label>
                                <select
                                    className="input"
                                    value={filters.equipment_type_id}
                                    onChange={(e) => handleFilterChange('equipment_type_id', e.target.value)}
                                >
                                    <option value="">All Equipment</option>
                                    {equipmentTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Start Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={filters.start_date}
                                    onChange={(e) => handleFilterChange('start_date', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="label">End Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={filters.end_date}
                                    onChange={(e) => handleFilterChange('end_date', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <DataCard
                            title="Opening Balance"
                            value={stats?.opening_balance?.toFixed(2) || '0'}
                            icon={Package}
                            color="info"
                        />
                        <DataCard
                            title="Closing Balance"
                            value={stats?.closing_balance?.toFixed(2) || '0'}
                            icon={Package}
                            color="success"
                        />
                        <DataCard
                            title="Net Movement"
                            value={stats?.net_movement?.toFixed(2) || '0'}
                            icon={TrendingUp}
                            color="primary"
                            onClick={() => setShowModal(true)}
                        />
                        <DataCard
                            title="Assigned Assets"
                            value={stats?.assigned_total?.toFixed(2) || '0'}
                            icon={UserCheck}
                            color="warning"
                        />
                        <DataCard
                            title="Expended Assets"
                            value={stats?.expended_total?.toFixed(2) || '0'}
                            icon={AlertTriangle}
                            color="danger"
                        />
                    </div>

                    {/* Recent Activity */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Asset Overview</h3>
                        <div className="text-gray-400">
                            <p className="mb-2">
                                Total inventory across {bases.length} base{bases.length !== 1 ? 's' : ''}
                            </p>
                            <p>
                                Tracking {equipmentTypes.length} equipment type{equipmentTypes.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Net Movement Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Net Movement Breakdown"
                size="lg"
            >
                <div className="space-y-6">
                    {/* Purchases */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <ShoppingCart className="w-5 h-5 text-green-500" />
                            <h4 className="text-lg font-semibold text-white">Purchases</h4>
                        </div>
                        {stats?.breakdown?.purchases?.length > 0 ? (
                            <div className="space-y-2">
                                {stats.breakdown.purchases.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                                        <span className="text-gray-300">{item.equipment_type__name}</span>
                                        <span className="text-green-400 font-semibold">+{item.total}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No purchases in this period</p>
                        )}
                    </div>

                    {/* Transfers In */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <ArrowLeftRight className="w-5 h-5 text-blue-500" />
                            <h4 className="text-lg font-semibold text-white">Transfers In</h4>
                        </div>
                        {stats?.breakdown?.transfers_in?.length > 0 ? (
                            <div className="space-y-2">
                                {stats.breakdown.transfers_in.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                                        <span className="text-gray-300">{item.equipment_type__name}</span>
                                        <span className="text-blue-400 font-semibold">+{item.total}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No incoming transfers in this period</p>
                        )}
                    </div>

                    {/* Transfers Out */}
                    <div>
                        <div className="flex items-center space-x-2 mb-3">
                            <ArrowLeftRight className="w-5 h-5 text-red-500" />
                            <h4 className="text-lg font-semibold text-white">Transfers Out</h4>
                        </div>
                        {stats?.breakdown?.transfers_out?.length > 0 ? (
                            <div className="space-y-2">
                                {stats.breakdown.transfers_out.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-dark-800 rounded-lg">
                                        <span className="text-gray-300">{item.equipment_type__name}</span>
                                        <span className="text-red-400 font-semibold">-{item.total}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No outgoing transfers in this period</p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
