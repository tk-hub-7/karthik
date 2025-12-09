import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const Transfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        from_base: '',
        to_base: '',
        equipment_type: '',
        status: '',
        start_date: '',
        end_date: '',
    });

    const [formData, setFormData] = useState({
        from_base: '',
        to_base: '',
        equipment_type: '',
        quantity: '',
        status: 'pending',
        transfer_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchBases();
        fetchEquipmentTypes();
        fetchTransfers();
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

    const fetchTransfers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await api.get(`/transfers/?${params}`);
            setTransfers(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching transfers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transfers/', formData);
            setShowModal(false);
            setFormData({
                from_base: '',
                to_base: '',
                equipment_type: '',
                quantity: '',
                status: 'pending',
                transfer_date: new Date().toISOString().split('T')[0],
            });
            fetchTransfers();
        } catch (error) {
            console.error('Error creating transfer:', error);
            alert('Failed to create transfer');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'badge-warning',
            in_transit: 'badge-info',
            completed: 'badge-success',
            cancelled: 'badge-danger',
        };
        return badges[status] || 'badge-info';
    };

    return (
        <div className="flex h-screen bg-dark-950">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Transfers</h1>
                            <p className="text-gray-400 mt-1">Manage asset transfers between bases</p>
                        </div>
                        <Button onClick={() => setShowModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Transfer
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="card p-6 mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="w-5 h-5 text-primary-500" />
                            <h3 className="text-lg font-semibold text-white">Filters</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            <div>
                                <label className="label">From Base</label>
                                <select
                                    className="input"
                                    value={filters.from_base}
                                    onChange={(e) => setFilters({ ...filters, from_base: e.target.value })}
                                >
                                    <option value="">All Bases</option>
                                    {bases.map(base => (
                                        <option key={base.id} value={base.id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">To Base</label>
                                <select
                                    className="input"
                                    value={filters.to_base}
                                    onChange={(e) => setFilters({ ...filters, to_base: e.target.value })}
                                >
                                    <option value="">All Bases</option>
                                    {bases.map(base => (
                                        <option key={base.id} value={base.id}>{base.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Equipment</label>
                                <select
                                    className="input"
                                    value={filters.equipment_type}
                                    onChange={(e) => setFilters({ ...filters, equipment_type: e.target.value })}
                                >
                                    <option value="">All Equipment</option>
                                    {equipmentTypes.map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="label">Status</label>
                                <select
                                    className="input"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_transit">In Transit</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Start Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={filters.start_date}
                                    onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="label">End Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={filters.end_date}
                                    onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transfers Table */}
                    <div className="card">
                        <div className="table-container">
                            <table className="table">
                                <thead className="table-header">
                                    <tr>
                                        <th className="table-header-cell">Date</th>
                                        <th className="table-header-cell">From Base</th>
                                        <th className="table-header-cell">To Base</th>
                                        <th className="table-header-cell">Equipment</th>
                                        <th className="table-header-cell">Quantity</th>
                                        <th className="table-header-cell">Status</th>
                                        <th className="table-header-cell">Created By</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="7" className="table-cell text-center py-8">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : transfers.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="table-cell text-center py-8 text-gray-500">
                                                No transfers found
                                            </td>
                                        </tr>
                                    ) : (
                                        transfers.map((transfer) => (
                                            <tr key={transfer.id} className="hover:bg-dark-800 transition-colors">
                                                <td className="table-cell">
                                                    {new Date(transfer.transfer_date).toLocaleDateString()}
                                                </td>
                                                <td className="table-cell">{transfer.from_base_name}</td>
                                                <td className="table-cell">{transfer.to_base_name}</td>
                                                <td className="table-cell">{transfer.equipment_name}</td>
                                                <td className="table-cell">
                                                    <span className="badge badge-info">{transfer.quantity}</span>
                                                </td>
                                                <td className="table-cell">
                                                    <span className={`badge ${getStatusBadge(transfer.status)}`}>
                                                        {transfer.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="table-cell">{transfer.created_by_name}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Transfer Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="New Transfer"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="label">From Base</label>
                            <select
                                className="input"
                                value={formData.from_base}
                                onChange={(e) => setFormData({ ...formData, from_base: e.target.value })}
                                required
                            >
                                <option value="">Select Base</option>
                                {bases.map(base => (
                                    <option key={base.id} value={base.id}>{base.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">To Base</label>
                            <select
                                className="input"
                                value={formData.to_base}
                                onChange={(e) => setFormData({ ...formData, to_base: e.target.value })}
                                required
                            >
                                <option value="">Select Base</option>
                                {bases.map(base => (
                                    <option key={base.id} value={base.id}>{base.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Equipment Type</label>
                            <select
                                className="input"
                                value={formData.equipment_type}
                                onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                                required
                            >
                                <option value="">Select Equipment</option>
                                {equipmentTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.name}</option>
                                ))}
                            </select>
                        </div>

                        <FormInput
                            label="Quantity"
                            type="number"
                            step="0.01"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            required
                        />

                        <div>
                            <label className="label">Status</label>
                            <select
                                className="input"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                required
                            >
                                <option value="pending">Pending</option>
                                <option value="in_transit">In Transit</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <FormInput
                            label="Transfer Date"
                            type="date"
                            value={formData.transfer_date}
                            onChange={(e) => setFormData({ ...formData, transfer_date: e.target.value })}
                            required
                        />

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" variant="primary" className="flex-1">
                                Create Transfer
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Transfers;
