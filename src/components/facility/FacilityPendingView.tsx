import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { CheckCircle, XCircle, ArrowLeft, User, Calendar, Clock, Mail, Phone, FileText, AlertCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PendingAppointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  type: "teleconsultation" | "in_person";
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  email?: string | null;
  phoneNumber?: string | null;
  patientAvatar?: string | null;
  createdAt?: string;
}

const FacilityPendingView: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<PendingAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      
      // 1. Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');
      setUserId(user.id); // ✅ ADD THIS LINE

      // 2. Get medical professional record (doctor)
      const { data: medicalProfessional, error: mpError } = await supabase
        .from('facilities')
        .select('id, admin_user_id')
        .eq('admin_user_id', user.id)
        .single();

      if (mpError || !medicalProfessional) {
        throw new Error('Facility profile not found');
      }

      // 3. Fetch all pending appointments for this doctor
      const { data: appointmentsData, error: aptError } = await supabase
        .from('appointments')
        .select(`
          id,
          appointment_date,
          type,
          status,
          patient_id,
          facility_id,
          chief_complaint,
          notes,
          created_at
        `)
        .eq('facility_id', medicalProfessional.id)  // using facility_id as identifier
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (aptError) throw aptError;
      if (!appointmentsData?.length) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      // 4. Get unique patient IDs
      const patientIds = [...new Set(appointmentsData.map(a => a.patient_id))];

      // 5. Fetch patient profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, email, phone_number, avatar_url')
        .in('user_id', patientIds);

      if (profilesError) throw profilesError;

      // Create patient lookup map
      const patientMap: Record<string, any> = {};
      profiles?.forEach(profile => {
        patientMap[profile.user_id] = {
          name: `${profile.first_name} ${profile.last_name}`,
          email: profile.email,
          phone: profile.phone_number,
          avatar: profile.avatar_url,
        };
      });

      // 6. Transform data
      const pendingApps: PendingAppointment[] = appointmentsData.map(app => {
        const patient = patientMap[app.patient_id] || { name: 'Unknown', email: null, phone: null };
        const appointmentDate = new Date(app.appointment_date);
        return {
          id: app.id,
          patientName: patient.name,
          patientId: app.patient_id,
          date: appointmentDate.toLocaleDateString(),
          time: appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: app.type as "teleconsultation" | "in_person",
          status: app.status,
          notes: app.notes,
          email: patient.email,
          phoneNumber: patient.phone,
          patientAvatar: patient.avatar,
          createdAt: app.created_at,
        };
      });

      setAppointments(pendingApps);
    } catch (err: any) {
      console.error('Error fetching pending appointments:', err);
      setError(err.message || 'Failed to load pending appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (userId: string, patientId: string, appointmentId: string) => {
    navigate(`/facility/appointment-patient/${userId}/${patientId}/${appointmentId}`);
  };

  const handleBack = () => navigate(-1);

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    let variant = 'warning';
    let icon = <AlertCircle size={14} className="me-1" />;
    if (status === 'confirmed') { variant = 'success'; icon = <CheckCircle size={14} className="me-1" />; }
    if (status === 'cancelled') { variant = 'danger'; icon = <XCircle size={14} className="me-1" />; }
    if (status === 'completed') { variant = 'info'; icon = <CheckCircle size={14} className="me-1" />; }
    return (
      <Badge bg={variant} className="d-inline-flex align-items-center gap-1 px-3 py-2">
        {icon} {status.toUpperCase()}
      </Badge>
    );
  };

  // Desktop table view
  const DesktopTableView = () => (
    <div className="table-responsive">
      <Table striped bordered hover className="shadow-sm rounded">
        <thead className="bg-light">
          <tr>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Type</th>
            <th>Status</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((app) => (
            <tr key={app.id}>
              <td className="align-middle">
                <div className="d-flex align-items-center gap-2">
                  <User size={18} className="text-secondary" />
                  <span>{app.patientName}</span>
                </div>
              </td>
              <td className="align-middle">{app.date}</td>
              <td className="align-middle">{app.time}</td>
              <td className="align-middle text-capitalize">{app.type.replace('_', ' ')}</td>
              <td className="align-middle"><StatusBadge status={app.status} /></td>
              <td className="align-middle">
                <div className="d-flex flex-column gap-1">
                  {app.email && <small><Mail size={12} /> {app.email}</small>}
                  {app.phoneNumber && <small><Phone size={12} /> {app.phoneNumber}</small>}
                </div>
              </td>
              <td className="align-middle">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewDetails(userId, app.patientId, app.id)}
                >
                  <Eye size={14} className="me-1" /> View and confirm
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  // Mobile card view
  const MobileCardView = () => (
    <div className="d-flex flex-column gap-3">
      {appointments.map((app) => (
        <Card key={app.id} className="shadow-sm border-0">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="d-flex align-items-center gap-2">
                <User size={20} className="text-secondary" />
                <h6 className="mb-0">{app.patientName}</h6>
              </div>
              <StatusBadge status={app.status} />
            </div>
            <div className="d-flex flex-column gap-2 mt-2">
              <div className="d-flex justify-content-between">
                <span><Calendar size={16} className="text-secondary me-2" /> Date</span>
                <span>{app.date}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span><Clock size={16} className="text-secondary me-2" /> Time</span>
                <span>{app.time}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Type</span>
                <span className="text-capitalize">{app.type.replace('_', ' ')}</span>
              </div>
              {(app.email || app.phoneNumber) && (
                <div className="border-top pt-2 mt-1">
                  {app.email && (
                    <div className="d-flex justify-content-between small">
                      <span><Mail size={14} /> Email</span>
                      <span>{app.email}</span>
                    </div>
                  )}
                  {app.phoneNumber && (
                    <div className="d-flex justify-content-between small mt-1">
                      <span><Phone size={14} /> Phone</span>
                      <span>{app.phoneNumber}</span>
                    </div>
                  )}
                </div>
              )}
              {app.notes && (
                <div className="border-top pt-2 mt-1">
                  <div className="d-flex gap-2">
                    <FileText size={16} className="text-secondary" />
                    <small className="text-muted">{app.notes}</small>
                  </div>
                </div>
              )}
              <div className="mt-3 text-end">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleViewDetails(userId, app.patientId, app.id)}
                >
                  View Detail s →
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading pending appointments...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-5 text-center">
        <AlertCircle size={48} className="text-danger mb-3" />
        <h5>Error</h5>
        <p className="text-muted">{error}</p>
        <Button variant="outline-primary" onClick={fetchPendingAppointments}>Retry</Button>
        <Button variant="link" onClick={handleBack}>Go Back</Button>
      </Container>
    );
  }

  if (appointments.length === 0) {
    return (
      <Container fluid className="py-5 text-center">
        <CheckCircle size={48} className="text-muted mb-3" />
        <h4>No pending appointments</h4>
        <p className="text-muted">You have no appointment requests waiting for confirmation.</p>
        <Button variant="outline-primary" onClick={handleBack}>Go Back</Button>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          {/* Back button */}
          <div className="mb-4">
            <Button variant="link" onClick={handleBack} className="text-decoration-none p-0">
              <ArrowLeft size={18} className="me-1" /> Back
            </Button>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <h2 className="h3 mb-0">Pending Appointments</h2>
            <Badge bg="warning" className="px-3 py-2">
              {appointments.length} request(s)
            </Badge>
          </div>

          {/* Responsive views */}
          <div className="d-none d-md-block">
            <DesktopTableView />
          </div>
          <div className="d-md-none">
            <MobileCardView />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default FacilityPendingView;