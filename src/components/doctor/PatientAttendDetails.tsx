import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Modal, Form, InputGroup, Nav, Tab } from 'react-bootstrap';
import { 
  User, 
  Phone, 
  Search,
  Filter,
  Eye,
  History,
  Calendar,
  HeartCrack,
  SearchCheck,
  FilterIcon,
  AlignEndVertical,
  Vegan,
  TableCellsMerge,
  NotebookTabs,
  AlignEndVerticalIcon
} from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { supabase } from '@/integrations/supabase/client';

const PatientAttendDetails = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('attended');

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Get doctor's medical professional record
      const { data: doctorData, error: doctorError } = await supabase
        .from("medical_professionals")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (doctorError || !doctorData) {
        console.error("Error fetching doctor data:", doctorError);
        setLoading(false);
        return;
      }

      // Fetch all appointments with patient details
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from("appointments")
        .select(`
          *,
          patients:patient_id (*)
        `)
        .eq("doctor_id", doctorData.id)
        .order("appointment_date", { ascending: false });

      if (appointmentsError) {
        console.error("Error fetching appointments:", appointmentsError);
        setPatients([]);
      } else if (appointmentsData) {
        // Transform and group by patient
        const patientMap = new Map();
        
        appointmentsData.forEach(app => {
          if (app.patients) {
            const patientId = app.patient_id;
            
            if (!patientMap.has(patientId)) {
              patientMap.set(patientId, {
                ...app.patients,
                appointments: [],
                lastVisit: app.appointment_date,
                totalVisits: 0,
                attendedCount: 0,
                upcomingCount: 0,
                cancelledCount: 0
              });
            }
            
            const patient = patientMap.get(patientId);
            patient.appointments.push({
              id: app.id,
              date: app.appointment_date,
              type: app.type,
              status: app.status,
              reason: app.reason,
              notes: app.notes
            });
            
            // Update counts
            patient.totalVisits++;
            if (app.status === 'completed') patient.attendedCount++;
            else if (app.status === 'scheduled') patient.upcomingCount++;
            else if (app.status === 'cancelled') patient.cancelledCount++;
            
            // Update last visit if more recent
            if (new Date(app.appointment_date) > new Date(patient.lastVisit)) {
              patient.lastVisit = app.appointment_date;
            }
          }
        });

        setPatients(Array.from(patientMap.values()));
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      scheduled: 'primary',
      cancelled: 'danger',
      pending: 'warning'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm);
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'attended') return matchesSearch && patient.attendedCount > 0;
    if (filterStatus === 'upcoming') return matchesSearch && patient.upcomingCount > 0;
    if (filterStatus === 'new') return matchesSearch && patient.totalVisits === 1;
    
    return matchesSearch;
  });

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-0">
            <User className="me-2 text-primary" />
            Patient Attendance Details
          </h2>
          <p className="text-muted">View and manage patient visit history</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-primary text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Total Patients</h6>
                  <h3 className="mb-0">{patients.length}</h3>
                </div>
                <User size={30} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-success text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Attended Today</h6>
                  <h3 className="mb-0">
                    {patients.filter(p => {
                      const today = new Date().toDateString();
                      return p.appointments?.some(a => 
                        new Date(a.date).toDateString() === today && 
                        a.status === 'completed'
                      );
                    }).length}
                  </h3>
                </div>
                <Calendar size={30} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-info text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Upcoming</h6>
                  <h3 className="mb-0">
                    {patients.reduce((acc, p) => acc + p.upcomingCount, 0)}
                  </h3>
                </div>
                <HeartCrack size={30} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm border-0 bg-warning text-white">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">New Patients</h6>
                  <h3 className="mb-0">
                    {patients.filter(p => p.totalVisits === 1).length}
                  </h3>
                </div>
                <User size={30} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <SearchCheck />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search patients by name, email or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={3}>
          <InputGroup>
            <InputGroup.Text>
              <FilterIcon />
            </InputGroup.Text>
            <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Patients</option>
              <option value="attended">Attended</option>
              <option value="upcoming">Upcoming</option>
              <option value="new">New Patients</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Patients Table */}
      <Card className="shadow-sm">
        <Card.Body>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="attended">Attended Patients</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="upcoming">Upcoming Appointments</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="all">All Patients</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="attended">
                <PatientTable 
                  patients={filteredPatients.filter(p => p.attendedCount > 0)}
                  loading={loading}
                  onView={handleViewPatient}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="upcoming">
                <PatientTable 
                  patients={filteredPatients.filter(p => p.upcomingCount > 0)}
                  loading={loading}
                  onView={handleViewPatient}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="all">
                <PatientTable 
                  patients={filteredPatients}
                  loading={loading}
                  onView={handleViewPatient}
                  getStatusBadge={getStatusBadge}
                  formatDate={formatDate}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Patient Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <User className="me-2 text-primary" />
            Patient Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPatient && (
            <>
              <Row className="mb-4">
                <Col md={4} className="text-center">
                  <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                    <User size={50} className="text-primary" />
                  </div>
                  <h4>{selectedPatient.first_name} {selectedPatient.last_name}</h4>
                  <p className="text-muted">Patient ID: {selectedPatient.id}</p>
                </Col>
                <Col md={8}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <AlignEndVertical className="me-2 text-primary" />
                          <small className="text-muted d-block">Email</small>
                          <strong>{selectedPatient.email || 'N/A'}</strong>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <Phone className="me-2 text-primary" />
                          <small className="text-muted d-block">Phone</small>
                          <strong>{selectedPatient.phone || 'N/A'}</strong>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <Vegan className="me-2 text-primary" />
                          <small className="text-muted d-block">Gender</small>
                          <strong>{selectedPatient.gender || 'N/A'}</strong>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <TableCellsMerge className="me-2 text-primary" />
                          <small className="text-muted d-block">Blood Group</small>
                          <strong>{selectedPatient.blood_group || 'N/A'}</strong>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <h5 className="mb-3">
                <History className="me-2 text-primary" />
                Visit History
              </h5>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Reason</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPatient.appointments?.map(app => (
                    <tr key={app.id}>
                      <td>{formatDate(app.date)}</td>
                      <td>{app.type}</td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td>{app.reason || '-'}</td>
                      <td>
                        <Button size="sm" variant="outline-primary">
                          <Eye /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Medical History */}
              <h5 className="mb-3 mt-4">
                <NotebookTabs className="me-2 text-primary" />
                Medical History
              </h5>
              <Row>
                <Col md={6}>
                  <Card className="border-0 bg-light mb-3">
                    <Card.Body>
                      <h6>Conditions</h6>
                      <p className="mb-0">
                        {selectedPatient.medical_conditions || 'No conditions recorded'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 bg-light mb-3">
                    <Card.Body>
                      <h6>Allergies</h6>
                      <p className="mb-0">
                        {selectedPatient.allergies || 'No allergies recorded'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={12}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <h6>Medications</h6>
                      <p className="mb-0">
                        {selectedPatient.medications || 'No medications recorded'}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">
            <NotebookTabs className="me-2" />
            Add Prescription
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Patient Table Component
const PatientTable = ({ patients, loading, onView, getStatusBadge, formatDate }) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading patients...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-5">
        <User size={50} className="text-muted mb-3" />
        <h5>No Patients Found</h5>
        <p className="text-muted">No patients match your search criteria.</p>
      </div>
    );
  }

  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Patient Name</th>
          <th>Contact</th>
          <th>Last Visit</th>
          <th>Total Visits</th>
          <th>Attended</th>
          <th>Upcoming</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {patients.map(patient => (
          <tr key={patient.id}>
            <td>
              <strong>{patient.first_name} {patient.last_name}</strong>
            </td>
            <td>
              <small>
                <Phone size={12} className="me-1 text-muted" />
                {patient.phone || 'N/A'}<br />
                <AlignEndVerticalIcon size={12} className="me-1 text-muted" />
                {patient.email || 'N/A'}
              </small>
            </td>
            <td>{patient.lastVisit ? formatDate(patient.lastVisit) : 'N/A'}</td>
            <td>
              <Badge bg="secondary">{patient.totalVisits || 0}</Badge>
            </td>
            <td>
              <Badge bg="success">{patient.attendedCount || 0}</Badge>
            </td>
            <td>
              <Badge bg="info">{patient.upcomingCount || 0}</Badge>
            </td>
            <td>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => onView(patient)}
              >
                <Eye className="me-1" />
                View Details
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default PatientAttendDetails;