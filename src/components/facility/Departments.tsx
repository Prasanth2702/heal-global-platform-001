import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Button } from '../ui/button';

const Departments = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample departments data
  const departments = [
    { id: 1, name: 'General Medicine', icon: 'fa-stethoscope', patients: 45, doctors: 12, revenue: '$45.2K', color: 'primary', head: 'Dr. James Wilson' },
    { id: 2, name: 'Cardiology', icon: 'fa-heart', patients: 32, doctors: 8, revenue: '$52.8K', color: 'danger', head: 'Dr. Sarah Johnson' },
    { id: 3, name: 'Neurology', icon: 'fa-brain', patients: 28, doctors: 7, revenue: '$38.5K', color: 'info', head: 'Dr. Michael Chen' },
    { id: 4, name: 'Orthopedics', icon: 'fa-bone', patients: 35, doctors: 9, revenue: '$41.3K', color: 'warning', head: 'Dr. Emily Brown' },
    { id: 5, name: 'Pediatrics', icon: 'fa-child', patients: 42, doctors: 11, revenue: '$33.7K', color: 'success', head: 'Dr. David Lee' },
    { id: 6, name: 'Gynecology', icon: 'fa-female', patients: 38, doctors: 10, revenue: '$36.9K', color: 'danger', head: 'Dr. Lisa Anderson' },
    { id: 7, name: 'Surgery', icon: 'fa-cut', patients: 25, doctors: 15, revenue: '$67.2K', color: 'secondary', head: 'Dr. Robert Taylor' },
    { id: 8, name: 'Emergency', icon: 'fa-ambulance', patients: 56, doctors: 18, revenue: '$78.4K', color: 'danger', head: 'Dr. Maria Garcia' },
    { id: 9, name: 'ICU', icon: 'fa-hospital', patients: 18, doctors: 12, revenue: '$89.1K', color: 'dark', head: 'Dr. John Smith' },
    { id: 10, name: 'Radiology', icon: 'fa-x-ray', patients: 22, doctors: 6, revenue: '$28.6K', color: 'info', head: 'Dr. Patricia Brown' },
    { id: 11, name: 'Pathology', icon: 'fa-microscope', patients: 30, doctors: 5, revenue: '$25.3K', color: 'warning', head: 'Dr. William Davis' },
    { id: 12, name: 'Dermatology', icon: 'fa-allergies', patients: 27, doctors: 6, revenue: '$31.8K', color: 'success', head: 'Dr. Jennifer Miller' },
    { id: 13, name: 'ENT', icon: 'fa-ear-deaf', patients: 33, doctors: 7, revenue: '$29.4K', color: 'primary', head: 'Dr. Thomas Wilson' },
    { id: 14, name: 'Ophthalmology', icon: 'fa-eye', patients: 29, doctors: 6, revenue: '$34.2K', color: 'info', head: 'Dr. Susan Moore' },
    { id: 15, name: 'Psychiatry', icon: 'fa-smile', patients: 21, doctors: 5, revenue: '$27.5K', color: 'warning', head: 'Dr. Daniel White' },
    { id: 16, name: 'Physiotherapy', icon: 'fa-wheelchair', patients: 24, doctors: 8, revenue: '$22.9K', color: 'success', head: 'Dr. Nancy Harris' },
    { id: 17, name: 'Dental', icon: 'fa-tooth', patients: 41, doctors: 9, revenue: '$43.7K', color: 'primary', head: 'Dr. George Martin' },
    { id: 18, name: 'Ayurveda', icon: 'fa-leaf', patients: 19, doctors: 4, revenue: '$18.3K', color: 'success', head: 'Dr. Priya Patel' },
    { id: 19, name: 'Homeopathy', icon: 'fa-flask', patients: 16, doctors: 3, revenue: '$15.8K', color: 'info', head: 'Dr. Anita Sharma' },
    { id: 20, name: 'Dietetics', icon: 'fa-apple-alt', patients: 23, doctors: 4, revenue: '$20.1K', color: 'warning', head: 'Dr. Rachel Green' }
  ];

  // Filter departments based on search
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get stats
  const totalPatients = departments.reduce((sum, dept) => sum + dept.patients, 0);
  const totalDoctors = departments.reduce((sum, dept) => sum + dept.doctors, 0);
  const totalRevenue = departments.reduce((sum, dept) => sum + parseFloat(dept.revenue.replace('$', '')), 0);

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
  };

  const handleBack = () => {
    setSelectedDepartment(null);
  };

  // Main list view
  if (!selectedDepartment) {
    return (
          <DashboardLayout userType="facility">
      <div className="container-fluid px-4 py-4">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
     
              <div>
                <h2 className="mb-1">
                  <i className="fas fa-building me-2 text-primary"></i>
                  Hospital Departments
                </h2>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                    <li className="breadcrumb-item active">Departments</li>
                  </ol>
                </nav>
              </div>
              <div>
                <button className="btn btn-outline-primary me-2">
                  <i className="fas fa-download me-2"></i>
                  Export
                </button>
                <button className="btn btn-primary">
                  <i className="fas fa-plus me-2"></i>
                  Add Department
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 bg-gradient-primary text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="fas fa-building fa-2x"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">Total Departments</h6>
                    <h3 className="mb-0">{departments.length}</h3>
                    <small className="opacity-75">Active departments</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 bg-gradient-success text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="fas fa-users fa-2x"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">Total Patients</h6>
                    <h3 className="mb-0">{totalPatients}</h3>
                    <small className="opacity-75">+12% from last month</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 bg-gradient-info text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="fas fa-user-md fa-2x"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">Total Doctors</h6>
                    <h3 className="mb-0">{totalDoctors}</h3>
                    <small className="opacity-75">Specialists</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <div className="card border-0 bg-gradient-warning text-white">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="bg-white bg-opacity-25 rounded-circle p-3">
                      <i className="fas fa-dollar-sign fa-2x"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h6 className="mb-1">Total Revenue</h6>
                    <h3 className="mb-0">${totalRevenue.toFixed(1)}K</h3>
                    <small className="opacity-75">This month</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="fas fa-search text-muted"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-start-0" 
                        placeholder="Search departments or department head..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select className="form-select" value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                      <option value="all">All Departments</option>
                      <option value="clinical">Clinical</option>
                      <option value="surgical">Surgical</option>
                      <option value="diagnostic">Diagnostic</option>
                      <option value="support">Support</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <div className="d-flex gap-2">
                      <button className="btn btn-outline-secondary flex-fill">
                        <i className="fas fa-sort me-2"></i>
                        Sort
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-filter"></i>
                      </button>
                      <button className="btn btn-outline-secondary">
                        <i className="fas fa-th-large"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Departments Grid - Modern Card Design */}
        <div className="row g-4">
          {filteredDepartments.map((dept) => (
            <div key={dept.id} className="col-xl-3 col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm hover-lift">
                <div className={`card-header bg-${dept.color} bg-opacity-10 border-0 py-3`}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className={`bg-${dept.color} bg-opacity-25 rounded-circle p-3`}>
                      <i className={`fas ${dept.icon} fa-2x text-${dept.color}`}></i>
                    </div>
                    <span className={`badge bg-${dept.color} rounded-pill px-3 py-2`}>
                      {dept.patients} Patients
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title mb-1">{dept.name}</h5>
                  <p className="text-muted small mb-3">
                    <i className="fas fa-user-tie me-1"></i>
                    {dept.head}
                  </p>
                  
                  <div className="d-flex justify-content-between mb-3">
                    <div className="text-center">
                      <h6 className="mb-1">{dept.doctors}</h6>
                      <small className="text-muted">Doctors</small>
                    </div>
                    <div className="text-center">
                      <h6 className="mb-1">{dept.revenue}</h6>
                      <small className="text-muted">Revenue</small>
                    </div>
                    <div className="text-center">
                      <h6 className="mb-1">85%</h6>
                      <small className="text-muted">Occupancy</small>
                    </div>
                  </div>
                  
                  <div className="progress mb-3" style={{ height: '5px' }}>
                    <div className={`progress-bar bg-${dept.color}`} style={{ width: '85%' }}></div>
                  </div>
                  
                  <button 
                    className={`btn btn-outline-${dept.color} w-100`}
                    onClick={() => handleViewDepartment(dept)}
                  >
                    <i className="fas fa-eye me-2"></i>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </DashboardLayout>
    );
  }

  // Department Details View - Modern Dashboard Style
  return (
      <DashboardLayout userType="facility">

    <div className="container-fluid px-4 py-4">
      {/* Header with Navigation */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Button 
  variant="outline" 
  onClick={handleBack}
  className="me-3"
>
  <i className="fas fa-arrow-left me-2"></i>
  Back
</Button>
                  <div>
                    <h3 className="mb-1">
                      <span className={`badge bg-${selectedDepartment.color} me-2`}>Department</span>
                      {selectedDepartment.name}
                    </h3>
                    <div className="d-flex align-items-center text-muted">
                      <i className="fas fa-user-tie me-2"></i>
                      <span>Head: {selectedDepartment.head}</span>
                      <span className="mx-3">|</span>
                      <i className="fas fa-calendar me-2"></i>
                      <span>Est. 2010</span>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="fas fa-edit me-2"></i>
                    Edit
                  </button>
                  <button className="btn btn-primary">
                    <i className="fas fa-chart-line me-2"></i>
                    Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body py-3">
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <button className="btn btn-light">
                    <i className="fas fa-syringe me-2"></i>
                    New Appointment
                  </button>
                  <button className="btn btn-light">
                    <i className="fas fa-user-plus me-2"></i>
                    Add Patient
                  </button>
                  <button className="btn btn-light">
                    <i className="fas fa-user-md me-2"></i>
                    Assign Doctor
                  </button>
                </div>
                <div>
                  <button className="btn btn-success" data-bs-toggle="collapse" data-bs-target="#workDetails">
                    <i className="fas fa-chart-bar me-2"></i>
                    View Doctor Work Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Work Details */}
      <div className="collapse mb-4" id="workDetails">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="fas fa-chart-pie me-2 text-primary"></i>
              Doctor Work Statistics
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center">
                    <h3 className="text-primary mb-1">24</h3>
                    <small className="text-muted">Total Doctors</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center">
                    <h3 className="text-success mb-1">156</h3>
                    <small className="text-muted">Appointments</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center">
                    <h3 className="text-warning mb-1">12</h3>
                    <small className="text-muted">On Leave</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-light border-0">
                  <div className="card-body text-center">
                    <h3 className="text-info mb-1">4.8</h3>
                    <small className="text-muted">Avg Rating</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th>Patients</th>
                    <th>Completed</th>
                    <th>Pending</th>
                    <th>Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-user-circle fa-2x text-primary me-2"></i>
                        <div>Dr. Sarah Johnson</div>
                      </div>
                    </td>
                    <td>Cardiology</td>
                    <td>25</td>
                    <td><span className="badge bg-success">20</span></td>
                    <td><span className="badge bg-warning">5</span></td>
                    <td>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star-half-alt text-warning"></i>
                    </td>
                    <td><span className="badge bg-success">Available</span></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-user-circle fa-2x text-info me-2"></i>
                        <div>Dr. Michael Chen</div>
                      </div>
                    </td>
                    <td>Neurology</td>
                    <td>18</td>
                    <td><span className="badge bg-success">15</span></td>
                    <td><span className="badge bg-warning">3</span></td>
                    <td>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                      <i className="fas fa-star text-warning"></i>
                    </td>
                    <td><span className="badge bg-danger">Busy</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <i className="fas fa-chart-simple me-2"></i>
                    Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`}
                    onClick={() => setActiveTab('patients')}
                  >
                    <i className="fas fa-users me-2"></i>
                    Patients
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'doctors' ? 'active' : ''}`}
                    onClick={() => setActiveTab('doctors')}
                  >
                    <i className="fas fa-user-md me-2"></i>
                    Doctors
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
                    onClick={() => setActiveTab('appointments')}
                  >
                    <i className="fas fa-calendar me-2"></i>
                    Appointments
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="row">
                  <div className="col-md-8">
                    <h6 className="mb-3">Department Performance</h6>
                    <div className="bg-light p-4 rounded text-center">
                      <i className="fas fa-chart-line fa-4x text-muted mb-3"></i>
                      <p className="text-muted">Performance charts will be displayed here</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <h6 className="mb-3">Quick Stats</h6>
                    <div className="list-group">
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        Today's Appointments
                        <span className="badge bg-primary rounded-pill">24</span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        Available Beds
                        <span className="badge bg-success rounded-pill">12</span>
                      </div>
                      <div className="list-group-item d-flex justify-content-between align-items-center">
                        Emergency Cases
                        <span className="badge bg-danger rounded-pill">3</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Patients Tab */}
              {activeTab === 'patients' && (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <h6>Current Patients</h6>
                    <button className="btn btn-sm btn-primary">View All</button>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Admission Date</th>
                          <th>Room</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>John Doe</td>
                          <td>Dr. Sarah Johnson</td>
                          <td>2024-01-15</td>
                          <td>301A</td>
                          <td><span className="badge bg-success">Active</span></td>
                        </tr>
                        <tr>
                          <td>Emma Wilson</td>
                          <td>Dr. Michael Chen</td>
                          <td>2024-01-14</td>
                          <td>205B</td>
                          <td><span className="badge bg-warning">Observation</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Doctors Tab */}
              {activeTab === 'doctors' && (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <h6>Department Doctors</h6>
                    <button className="btn btn-sm btn-primary">Add Doctor</button>
                  </div>
                  <div className="row">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="col-md-6 mb-3">
                        <div className="card">
                          <div className="card-body">
                            <div className="d-flex">
                              <i className="fas fa-user-circle fa-3x text-primary me-3"></i>
                              <div>
                                <h6 className="mb-1">Dr. Sarah Johnson</h6>
                                <p className="small text-muted mb-1">Cardiology</p>
                                <div className="d-flex gap-3">
                                  <small><i className="fas fa-users me-1"></i>25 patients</small>
                                  <small><i className="fas fa-star text-warning me-1"></i>4.8</small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div>
                  <div className="d-flex justify-content-between mb-3">
                    <h6>Today's Appointments</h6>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-2">Schedule</button>
                      <button className="btn btn-sm btn-primary">New</button>
                    </div>
                  </div>
                  <div className="timeline">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="d-flex mb-3">
                        <div className="me-3">
                          <span className="badge bg-primary">09:00</span>
                        </div>
                        <div>
                          <p className="mb-0"><strong>John Doe</strong> with Dr. Sarah Johnson</p>
                          <small className="text-muted">Check-up</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Departments;