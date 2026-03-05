import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  Bed, 
  Users, 
  Phone, 
  Mail, 
  MapPin,
  Filter,
  ChevronDown,
  Activity,
  CheckCircle,
  XCircle
} from 'lucide-react';

// TypeScript interfaces
interface Department {
  id: number;
  name: string;
  description: string;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  headDoctor: string;
  contactNumber: string;
  email: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface FormData {
  name: string;
  description: string;
  totalBeds: number;
  headDoctor: string;
  contactNumber: string;
  email: string;
  location: string;
  status: 'active' | 'inactive' | 'maintenance';
}

const BedDepartments: React.FC = () => {
  // State management
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: 'General Ward',
      description: 'General patient accommodation with basic facilities',
      totalBeds: 50,
      occupiedBeds: 42,
      availableBeds: 8,
      headDoctor: 'Dr. Sarah Johnson',
      contactNumber: '+1 (555) 123-4567',
      email: 'general.ward@hospital.com',
      location: 'Building A, 1st Floor',
      status: 'active'
    },
    {
      id: 2,
      name: 'Intensive Care Unit',
      description: 'Critical care for seriously ill patients',
      totalBeds: 20,
      occupiedBeds: 18,
      availableBeds: 2,
      headDoctor: 'Dr. Michael Chen',
      contactNumber: '+1 (555) 234-5678',
      email: 'icu@hospital.com',
      location: 'Building B, 3rd Floor',
      status: 'active'
    },
    {
      id: 3,
      name: 'Pediatrics',
      description: 'Specialized care for children',
      totalBeds: 35,
      occupiedBeds: 28,
      availableBeds: 7,
      headDoctor: 'Dr. Emily Rodriguez',
      contactNumber: '+1 (555) 345-6789',
      email: 'pediatrics@hospital.com',
      location: 'Building C, 2nd Floor',
      status: 'active'
    },
    {
      id: 4,
      name: 'Orthopedics',
      description: 'Bone and joint care department',
      totalBeds: 40,
      occupiedBeds: 32,
      availableBeds: 8,
      headDoctor: 'Dr. Robert Kim',
      contactNumber: '+1 (555) 456-7890',
      email: 'orthopedics@hospital.com',
      location: 'Building D, 4th Floor',
      status: 'maintenance'
    },
    {
      id: 5,
      name: 'Cardiology',
      description: 'Heart and cardiovascular care',
      totalBeds: 25,
      occupiedBeds: 20,
      availableBeds: 5,
      headDoctor: 'Dr. James Wilson',
      contactNumber: '+1 (555) 567-8901',
      email: 'cardiology@hospital.com',
      location: 'Building E, 5th Floor',
      status: 'active'
    },
    {
      id: 6,
      name: 'Maternity Ward',
      description: 'Care for expecting mothers and newborns',
      totalBeds: 30,
      occupiedBeds: 22,
      availableBeds: 8,
      headDoctor: 'Dr. Lisa Thompson',
      contactNumber: '+1 (555) 678-9012',
      email: 'maternity@hospital.com',
      location: 'Building F, 2nd Floor',
      status: 'inactive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    totalBeds: 0,
    headDoctor: '',
    contactNumber: '',
    email: '',
    location: '',
    status: 'active'
  });

  // Filter departments based on search and status
  const filteredDepartments = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dept.headDoctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || dept.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalBeds' ? parseInt(value) || 0 : value
    }));
  };

  // Open modal for adding new department
  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      totalBeds: 0,
      headDoctor: '',
      contactNumber: '',
      email: '',
      location: '',
      status: 'active'
    });
    setShowModal(true);
  };

  // Open modal for editing existing department
  const handleEdit = (dept: Department) => {
    setEditingId(dept.id);
    setFormData({
      name: dept.name,
      description: dept.description,
      totalBeds: dept.totalBeds,
      headDoctor: dept.headDoctor,
      contactNumber: dept.contactNumber,
      email: dept.email,
      location: dept.location,
      status: dept.status
    });
    setShowModal(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      // Update existing department
      setDepartments(prev => prev.map(dept => 
        dept.id === editingId 
          ? { 
              ...dept, 
              ...formData,
              availableBeds: formData.totalBeds - dept.occupiedBeds
            } 
          : dept
      ));
    } else {
      // Add new department
      const newDept: Department = {
        id: departments.length + 1,
        ...formData,
        occupiedBeds: 0,
        availableBeds: formData.totalBeds
      };
      setDepartments(prev => [...prev, newDept]);
    }
    
    setShowModal(false);
  };

  // Handle department deletion
  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(prev => prev.filter(dept => dept.id !== id));
    }
  };

  // Calculate statistics
  const stats = {
    totalDepartments: departments.length,
    totalBeds: departments.reduce((sum, dept) => sum + dept.totalBeds, 0),
    occupiedBeds: departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0),
    availableBeds: departments.reduce((sum, dept) => sum + dept.availableBeds, 0)
  };

  // Get status badge color
  const getStatusBadge = (status: Department['status']) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-success', text: 'text-white', label: 'Active' };
      case 'inactive':
        return { bg: 'bg-secondary', text: 'text-white', label: 'Inactive' };
      case 'maintenance':
        return { bg: 'bg-warning', text: 'text-dark', label: 'Maintenance' };
      default:
        return { bg: 'bg-light', text: 'text-dark', label: 'Unknown' };
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-primary">
            <Bed className="me-2" size={28} />
            Bed Department Management
          </h1>
          <p className="text-muted">Manage hospital bed departments and availability</p>
        </div>
        <button 
          className="btn btn-primary d-flex align-items-center"
          onClick={handleAddNew}
        >
          <Plus size={20} className="me-2" />
          Add New Department
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-primary border-4 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-primary text-uppercase mb-1">Total Departments</h6>
                  <h2 className="fw-bold">{stats.totalDepartments}</h2>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <Bed className="text-primary" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-info border-4 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-info text-uppercase mb-1">Total Beds</h6>
                  <h2 className="fw-bold">{stats.totalBeds}</h2>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <Activity className="text-info" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-success border-4 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-success text-uppercase mb-1">Available Beds</h6>
                  <h2 className="fw-bold">{stats.availableBeds}</h2>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <CheckCircle className="text-success" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-start border-warning border-4 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-warning text-uppercase mb-1">Occupied Beds</h6>
                  <h2 className="fw-bold">{stats.occupiedBeds}</h2>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <Users className="text-warning" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search departments, descriptions, or doctors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <Filter size={20} />
                </span>
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departments Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Department List</h5>
          <span className="badge bg-primary">
            {filteredDepartments.length} departments found
          </span>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Department</th>
                  <th>Beds Status</th>
                  <th>Head Doctor</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDepartments.map(dept => {
                  const occupancyRate = (dept.occupiedBeds / dept.totalBeds) * 100;
                  const statusBadge = getStatusBadge(dept.status);
                  
                  return (
                    <tr key={dept.id}>
                      <td>
                        <div>
                          <strong className="d-block">{dept.name}</strong>
                          <small className="text-muted">{dept.description}</small>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="d-flex justify-content-between mb-1">
                            <small>Occupancy: {occupancyRate.toFixed(1)}%</small>
                            <small>{dept.availableBeds} available</small>
                          </div>
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className={`progress-bar ${occupancyRate > 80 ? 'bg-danger' : occupancyRate > 60 ? 'bg-warning' : 'bg-success'}`}
                              role="progressbar"
                              style={{ width: `${occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Users size={16} className="me-2 text-primary" />
                          {dept.headDoctor}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <Phone size={14} className="me-2 text-muted" />
                            <small>{dept.contactNumber}</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <Mail size={14} className="me-2 text-muted" />
                            <small>{dept.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <MapPin size={16} className="me-2 text-muted" />
                          {dept.location}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary d-flex align-items-center"
                            onClick={() => handleEdit(dept)}
                          >
                            <Pencil size={14} className="me-1" />
                            Edit
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger d-flex align-items-center"
                            onClick={() => handleDelete(dept.id)}
                          >
                            <Trash2 size={14} className="me-1" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingId ? 'Edit Department' : 'Add New Department'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Department Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Head Doctor *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="headDoctor"
                        value={formData.headDoctor}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={2}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Total Beds *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="totalBeds"
                        value={formData.totalBeds}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Contact Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Location *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status *</label>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Department' : 'Add Department'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BedDepartments;