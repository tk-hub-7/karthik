import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Modal from '../components/Modal';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [bases, setBases] = useState([]);
    const [equipmentTypes, setEquipmentTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [filters, setFilters] = useState({
        base: '',
        equipment_type: '',
        start_date: '',
        end_date: '',
    });

    const [formData, setFormData] = useState({
        base: '',
        equipment_type: '',
        personnel_name: '',
        personnel_id: '',
        assigned_quantity: '',
        assignment_date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchBases();
        fetchEquipmentTypes();
        fetchAssignments();
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

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });

            const response = await api.get(`/assignments/?${params}`);
            setAssignments(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/assignments/', formData);
            setShowModal(false);
            setFormData({
                base: '',
                equipment_type: '',
                personnel_name: '',
                personnel_id: '',
                assigned_quantity: '',
                assignment_date: new Date().toISOString().split('T')[0],
            });
            fetchAssignments();
        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Failed to create assignment');
        }
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
                            <h1 className="text-3xl font-bold text-white">Assignments & Expenditures</h1>
                            <p className="text-gray-400 mt-1">Manage asset assignments to personnel</p>
                        </div>
                        <Button onClick={() => setShowModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            New Assignment
                        </Button>
                    </div>

                    {/* Filters */}
                    <div className="card p-6 mb-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <Filter className="w-5 h-5 text-primary-500" />
                            <h3 className="text-lg font-semibold text-white">Filters</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="label">Base</label>
                                <select
                                    className="input"
                                    value={filters.base}
                                    onChange={(e) => setFilters({ ...filters, base: e.target.value })}
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

                    {/* Assignments Table */}
                    <div className="card">
                        <div className="table-container">
                            <table className="table">
                                <thead className="table-header">
                                    <tr>
                                        <th className="table-header-cell">Date</th>
                                        <th className="table-header-cell">Base</th>
                                        <th className="table-header-cell">Equipment</th>
                                        <th className="table-header-cell">Personnel</th>
                                        <th className="table-header-cell">Personnel ID</th>
                                        <th className="table-header-cell">Assigned</th>
                                        <th className="table-header-cell">Returned</th>
                                        <th className="table-header-cell">Outstanding</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="8" className="table-cell text-center py-8">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : assignments.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="table-cell text-center py-8 text-gray-500">
                                                No assignments found
                                            </td>
                                        </tr>
                                    ) : (
                                        assignments.map((assignment) => (
                                            <tr key={assignment.id} className="hover:bg-dark-800 transition-colors">
                                                <td className="table-cell">
                                                    {new Date(assignment.assignment_date).toLocaleDateString()}
                                                </td>
                                                <td className="table-cell">{assignment.base_name}</td>
                                                <td className="table-cell">{assignment.equipment_name}</td>
                                                <td className="table-cell">{assignment.personnel_name}</td>
                                                <td className="table-cell">{assignment.personnel_id || '-'}</td>
                                                <td className="table-cell">
                                                    <span className="badge badge-info">{assignment.assigned_quantity}</span>
                                                </td>
                                                <td className="table-cell">
                                                    <span className="badge badge-success">{assignment.returned_quantity}</span>
                                                </td>
                                                <td className="table-cell">
                                                    <span className={`badge ${assignment.outstanding_quantity > 0 ? 'badge-warning' : 'badge-success'}`}>
                                                        {assignment.outstanding_quantity}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Assignment Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="New Assignment"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Base</label>
                            <select
                                className="input"
                                value={formData.base}
                                onChange={(e) => setFormData({ ...formData, base: e.target.value })}
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
                            label="Personnel Name"
                            type="text"
                            value={formData.personnel_name}
                            onChange={(e) => setFormData({ ...formData, personnel_name: e.target.value })}
                            required
                        />

                        <FormInput
                            label="Personnel ID"
                            type="text"
                            value={formData.personnel_id}
                            onChange={(e) => setFormData({ ...formData, personnel_id: e.target.value })}
                            placeholder="Optional"
                        />

                        <FormInput
                            label="Assigned Quantity"
                            type="number"
                            step="0.01"
                            value={formData.assigned_quantity}
                            onChange={(e) => setFormData({ ...formData, assigned_quantity: e.target.value })}
                            required
                        />

                        <FormInput
                            label="Assignment Date"
                            type="date"
                            value={formData.assignment_date}
                            onChange={(e) => setFormData({ ...formData, assignment_date: e.target.value })}
                            required
                        />

                        <div className="flex space-x-3 pt-4">
                            <Button type="submit" variant="primary" className="flex-1">
                                Create Assignment
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

export default Assignments;
