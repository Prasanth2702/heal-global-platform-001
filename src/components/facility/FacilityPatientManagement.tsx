// import React, { useState, useEffect } from 'react';
// import { Button, Form, Table, Card, Row, Col, Container, Alert, Spinner, Modal } from 'react-bootstrap';
// import { UserPlus, Users, CheckCircle, XCircle, Copy } from 'lucide-react';
// import { supabase } from '@/integrations/supabase/client';
// import { useToast } from '@/hooks/use-toast';
// import { useUser } from '@/hooks/useUser';

// interface Patient {
//   id: string;
//   facility_id: string;
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone: string;
//   date_of_birth: string;
//   gender: string;
//   address: string;
//   emergency_contact_name: string;
//   emergency_contact_phone: string;
//   is_confirmed: boolean;
//   created_at: string;
// }

// const FacilityPatientManagement: React.FC = () => {
//   const { toast } = useToast();
//   const { user } = useUser();
//   const [activeView, setActiveView] = useState<'register' | 'list'>('register');
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [facilityId, setFacilityId] = useState<string | null>(null);
//   const [showPasswordModal, setShowPasswordModal] = useState(false);
//   const [tempPassword, setTempPassword] = useState('');

//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     phone: '',
//     date_of_birth: '',
//     gender: '',
//     address: '',
//     emergency_contact_name: '',
//     emergency_contact_phone: '',
//     blood_group: '',
//     known_allergies: '',
//     current_medications: '',
//     city: '',
//     state: '',
//     pincode: '',
//     country_code: '',
//   });

//   // Fetch facility ID for the logged-in admin
//   useEffect(() => {
//     const getFacility = async () => {
//       if (!user) return;
//       const { data, error } = await supabase
//         .from('facilities')
//         .select('id')
//         .eq('admin_user_id', user.id)
//         .single();
//       if (error) {
//         console.error('Error fetching facility:', error);
//         toast({ title: 'Error', description: 'Facility not found', variant: 'destructive' });
//       } else if (data) {
//         setFacilityId(data.id);
//       }
//     };
//     getFacility();
//   }, [user, toast]);

//   // Fetch patients linked to this facility
//   useEffect(() => {
//     if (facilityId) {
//       fetchPatients();
//     }
//   }, [facilityId]);

//   const fetchPatients = async () => {
//     if (!facilityId) return;
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('patients')
//       .select('*')
//       .order('created_at', { ascending: false });
//     if (error) {
//       toast({ title: 'Error', description: 'Failed to load patients', variant: 'destructive' });
//     } else {
//       setPatients(data || []);
//     }
//     setLoading(false);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleRegister = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!facilityId) {
//       toast({ title: 'Error', description: 'Facility not identified', variant: 'destructive' });
//       return;
//     }

//     if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
//       toast({ title: 'Missing Fields', description: 'Please fill all required fields', variant: 'destructive' });
//       return;
//     }

//     setSubmitting(true);
//     try {
//       const { data: { session } } = await supabase.auth.getSession();
//       const token = session?.access_token;
//       if (!token) throw new Error('Authentication token missing');

//       const payload = {
//         email: formData.email,
//         name: `${formData.first_name} ${formData.last_name}`.trim(),
//         phone_number: formData.phone,
//         date_of_birth: formData.date_of_birth || undefined,
//         gender: formData.gender || undefined,
//         emergency_contact_name: formData.emergency_contact_name || undefined,
//         emergency_contact_number: formData.emergency_contact_phone || undefined,
//         blood_group: formData.blood_group || undefined,
//         known_allergies: formData.known_allergies || undefined,
//         current_medications: formData.current_medications || undefined,
//         address: formData.address || undefined,
//         city: formData.city || undefined,
//         state: formData.state || undefined,
//         pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
//         country_code: formData.country_code || undefined,
//       };

//       const response = await fetch(
//         'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/register-patient',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         if (response.status === 409 && result.existing_user) {
//           toast({
//             title: 'User Already Exists',
//             description: result.message || 'Patient with this email already exists.',
//           });
//         } else {
//           throw new Error(result.message || 'Registration failed');
//         }
//         return;
//       }

//       // Success: user created
//       toast({ title: 'Success', description: result.message || 'Patient registered successfully' });
      
//       if (result.temporary_password) {
//         setTempPassword(result.temporary_password);
//         setShowPasswordModal(true);
//       }

//       // Link the patient to the current facility
//       if (result.user_id) {
//         const { error: updateError } = await supabase
//           .from('patients')
//           .update({ facility_id: facilityId })
//           .eq('user_id', result.user_id);

//         if (updateError) {
//           console.error('Failed to link patient to facility:', updateError);
//           toast({
//             title: 'Warning',
//             description: 'Patient created but not linked to facility. Please contact support.',
//           });
//         } else {
//           console.log(`Patient ${result.user_id} linked to facility ${facilityId}`);
//         }
//       }

//       // Reset form
//       setFormData({
//         first_name: '', last_name: '', email: '', phone: '', date_of_birth: '',
//         gender: '', address: '', emergency_contact_name: '', emergency_contact_phone: '',
//         blood_group: '', known_allergies: '', current_medications: '',
//         city: '', state: '', pincode: '', country_code: 'KR',
//       });
      
//       await fetchPatients(); // refresh list (now includes the new patient)
//       setActiveView('list');
//     } catch (err: any) {
//       console.error(err);
//       toast({ title: 'Registration Failed', description: err.message, variant: 'destructive' });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleConfirmPatient = async (patientId: string, currentStatus: boolean) => {
//     const { error } = await supabase
//       .from('patients')
//       .update({ is_confirmed: !currentStatus })
//       .eq('id', patientId);
//     if (error) {
//       toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
//     } else {
//       toast({ title: 'Updated', description: `Patient ${!currentStatus ? 'confirmed' : 'unconfirmed'}` });
//       fetchPatients();
//     }
//   };

//   const renderPatientList = () => {
//     if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;
//     if (patients.length === 0) return <Alert variant="info">No patients registered yet.</Alert>;

//     return (
//       <>
//         {/* Desktop Table */}
//         <div className="d-none d-md-block">
//           <Table striped bordered hover responsive>
//             <thead>
//               <tr><th>Name</th><th>Email</th><th>Phone</th><th>DOB</th><th>Gender</th><th>Confirmed</th><th>Actions</th></tr>
//             </thead>
//             <tbody>
//               {patients.map(patient => (
//                 <tr key={patient.id}>
//                   <td>{patient.first_name} {patient.last_name}</td>
//                   <td>{patient.email}</td>
//                   <td>{patient.phone}</td>
//                   <td>{patient.date_of_birth || '-'}</td>
//                   <td>{patient.gender || '-'}</td>
//                   <td>{patient.is_confirmed ? <CheckCircle className="text-success" size={18} /> : <XCircle className="text-danger" size={18} />}</td>
//                   <td>
//                     <Button variant="outline-primary" size="sm" onClick={() => handleConfirmPatient(patient.id, patient.is_confirmed)}>
//                       {patient.is_confirmed ? 'Undo Confirm' : 'Confirm'}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//         {/* Mobile Cards */}
//         <div className="d-md-none">
//           <Row>
//             {patients.map(patient => (
//               <Col xs={12} className="mb-3" key={patient.id}>
//                 <Card>
//                   <Card.Body>
//                     <Card.Title>{patient.first_name} {patient.last_name}</Card.Title>
//                     <Card.Text>
//                       <strong>Email:</strong> {patient.email}<br />
//                       <strong>Phone:</strong> {patient.phone}<br />
//                       <strong>DOB:</strong> {patient.date_of_birth || '-'}<br />
//                       <strong>Gender:</strong> {patient.gender || '-'}<br />
//                       <strong>Confirmed:</strong> {patient.is_confirmed ? 'Yes' : 'No'}
//                     </Card.Text>
//                     <Button variant="outline-primary" size="sm" onClick={() => handleConfirmPatient(patient.id, patient.is_confirmed)}>
//                       {patient.is_confirmed ? 'Undo Confirm' : 'Confirm'}
//                     </Button>
//                   </Card.Body>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </>
//     );
//   };

//   const copyPassword = () => {
//     navigator.clipboard.writeText(tempPassword);
//     toast({ title: 'Copied', description: 'Password copied to clipboard' });
//   };

//   return (
//     <Container fluid className="py-4">
//       <h2 className="mb-4">Patient Management</h2>
      
//         <Card>
//           <Card.Header>New Patient Registration</Card.Header>
//           <Card.Body>
//             <Form onSubmit={handleRegister}>
//               <Row>
//                 <Col md={6}><Form.Group className="mb-3"><Form.Label>First Name *</Form.Label><Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required /></Form.Group></Col>
//                 <Col md={6}><Form.Group className="mb-3"><Form.Label>Last Name *</Form.Label><Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required /></Form.Group></Col>
//               </Row>
//               <Row>
//                 <Col md={6}><Form.Group className="mb-3"><Form.Label>Email *</Form.Label><Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required /></Form.Group></Col>
//                 <Col md={6}><Form.Group className="mb-3"><Form.Label>Phone *</Form.Label><Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required /></Form.Group></Col>
//               </Row>
//               <Row>
//                 <Col md={4}><Form.Group className="mb-3"><Form.Label>Date of Birth</Form.Label><Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} /></Form.Group></Col>
//                 <Col md={4}><Form.Group className="mb-3"><Form.Label>Gender</Form.Label><Form.Select name="gender" value={formData.gender} onChange={handleInputChange}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></Form.Select></Form.Group></Col>
//                 <Col md={4}><Form.Group className="mb-3"><Form.Label>Blood Group</Form.Label><Form.Select name="blood_group" value={formData.blood_group} onChange={handleInputChange}><option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option></Form.Select></Form.Group></Col>
//               </Row>
//               <Row>
//                 <Col md={6}><Form.Group className="mb-3"><Form.Label>Address</Form.Label><Form.Control as="textarea" rows={1} name="address" value={formData.address} onChange={handleInputChange} /></Form.Group></Col>
//                 <Col md={3}><Form.Group className="mb-3"><Form.Label>City</Form.Label><Form.Control type="text" name="city" value={formData.city} onChange={handleInputChange} /></Form.Group></Col>
//                 <Col md={3}><Form.Group className="mb-3"><Form.Label>State</Form.Label><Form.Control type="text" name="state" value={formData.state} onChange={handleInputChange} /></Form.Group></Col>
//               </Row>
//               <Row>
//                 <Col md={4}><Form.Group className="mb-3"><Form.Label>Pincode</Form.Label><Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} /></Form.Group></Col>
//                 <Col md={4}><Form.Group className="mb-3"><Form.Label>Country Code</Form.Label><Form.Control type="text" name="country_code" value={formData.country_code} onChange={handleInputChange} placeholder="KR, IN, US" /></Form.Group></Col>
//                 <Col md={4}><Form.Group className="mb-3"><Form.Label>Known Allergies</Form.Label><Form.Control type="text" name="known_allergies" value={formData.known_allergies} onChange={handleInputChange} /></Form.Group></Col>
//               </Row>
//               <Row>
//                 <Col md={6}><Form.Group className="mb-3"><Form.Label>Current Medications</Form.Label><Form.Control type="text" name="current_medications" value={formData.current_medications} onChange={handleInputChange} /></Form.Group></Col>
//                 <Col md={3}><Form.Group className="mb-3"><Form.Label>Emergency Contact Name</Form.Label><Form.Control type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleInputChange} /></Form.Group></Col>
//                 <Col md={3}><Form.Group className="mb-3"><Form.Label>Emergency Contact Phone</Form.Label><Form.Control type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleInputChange} /></Form.Group></Col>
//               </Row>
//               <Button type="submit" variant="success" disabled={submitting}>
//                 {submitting ? <Spinner size="sm" className="me-2" /> : <UserPlus className="me-2" size={18} />}
//                 Register Patient
//               </Button>
//             </Form>
//           </Card.Body>
//         </Card>
     

//       <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Patient Account Created</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <p>The patient account has been created. Please share the following temporary password with the patient:</p>
//           <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded">
//             <code className="fs-5">{tempPassword}</code>
//             <Button variant="outline-secondary" size="sm" onClick={copyPassword}>
//               <Copy size={16} className="me-1" /> Copy
//             </Button>
//           </div>
//           <p className="mt-3 text-muted small">The patient will be prompted to change their password on first login.</p>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => setShowPasswordModal(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default FacilityPatientManagement;


import React, { useState, useEffect } from 'react';
import { Button, Form, Table, Card, Row, Col, Container, Alert, Spinner, Modal, Badge } from 'react-bootstrap';
import { UserPlus, Users, CheckCircle, XCircle, Copy, Building2, Mail, Phone, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/useUser';

interface Patient {
  id: string;
  facility_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  is_confirmed: boolean;
  created_at: string;
}

const FacilityPatientManagement: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const [activeView, setActiveView] = useState<'register' | 'list'>('register');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
const [userRole, setUserRole] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    blood_group: '',
    known_allergies: '',
    current_medications: '',
    city: '',
    state: '',
    pincode: '',
    country_code: '',
  });

  // Fetch facility ID for the logged-in admin (unchanged)
  // useEffect(() => {
  //   const getFacility = async () => {
  //     if (!user) return;
  //     const { data, error } = await supabase
  //       .from('facilities')
  //       .select('id')
  //       .eq('admin_user_id', user.id)
  //       .single();
  //     if (error) {
  //       console.error('Error fetching facility:', error);
  //       toast({ title: 'Error', description: 'Facility not found', variant: 'destructive' });
  //     } else if (data) {
  //       setFacilityId(data.id);
  //     }
  //   };
  //   getFacility();
  // }, [user, toast]);
  useEffect(() => {
  const getFacilityAndRole = async () => {
    if (!user) return;

    // 1. Get user role from profiles
    const { data: profile, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || !profile) {
      console.error("Role fetch error:", roleError);
      toast({ title: "Error", description: "Unable to fetch user role", variant: "destructive" });
      return;
    }

    setUserRole(profile.role);

    // 2. Get facility ID based on role
    let facilityData = null;

    if (profile.role === "hospital_admin") {
      const { data, error } = await supabase
        .from("facilities")
        .select("id")
        .eq("admin_user_id", user.id)
        .single();

      if (error) {
        toast({ title: "Error", description: "Facility not found for this admin", variant: "destructive" });
        return;
      }
      facilityData = data;
    } 
    else if (profile.role === "hospital_staff") {
      const { data, error } = await supabase
        .from("staff")
        .select("facility_id")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (error) {
        toast({ title: "Error", description: "No active facility found for this staff member", variant: "destructive" });
        return;
      }
      facilityData = { id: data.facility_id };
    }
    else {
      toast({
        title: "Access Denied",
        description: "Only hospital admins and staff can manage patients",
        variant: "destructive",
      });
      return;
    }

    if (facilityData) {
      setFacilityId(facilityData.id);
    }
  };

  getFacilityAndRole();
}, [user, toast]);

  // Fetch patients linked to this facility (unchanged)
  useEffect(() => {
    if (facilityId) {
      fetchPatients();
    }
  }, [facilityId]);

  const fetchPatients = async () => {
    if (!facilityId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Error', description: 'Failed to load patients', variant: 'destructive' });
    } else {
      setPatients(data || []);
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

// const handleRegister = async (e: React.FormEvent) => {
//   e.preventDefault();
//   if (!facilityId) {
//     toast({ title: 'Error', description: 'Facility not identified', variant: 'destructive' });
//     return;
//   }

//   if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone) {
//     toast({ title: 'Missing Fields', description: 'Please fill all required fields', variant: 'destructive' });
//     return;
//   }

//   setSubmitting(true);
//   try {
//     // Check if email already exists in profiles table
//     const { data: existingProfile, error: checkError } = await supabase
//       .from("profiles")
//       .select("id")
//       .eq("email", formData.email)
//       .maybeSingle();

//     if (existingProfile) {
//       toast({
//         title: "Patient Already Exists",
//         description: "This email is already registered. Please use a different email.",
//         variant: "destructive",
//       });
//       setSubmitting(false);
//       return;
//     }

//     const { data: { session } } = await supabase.auth.getSession();
//     const token = session?.access_token;
//     if (!token) throw new Error('Authentication token missing');

//     const payload = {
//       email: formData.email,
//       name: `${formData.first_name} ${formData.last_name}`.trim(),
//       phone_number: formData.phone,
//       date_of_birth: formData.date_of_birth || undefined,
//       gender: formData.gender || undefined,
//       emergency_contact_name: formData.emergency_contact_name || undefined,
//       emergency_contact_number: formData.emergency_contact_phone || undefined,
//       blood_group: formData.blood_group || undefined,
//       known_allergies: formData.known_allergies || undefined,
//       current_medications: formData.current_medications || undefined,
//       address: formData.address || undefined,
//       city: formData.city || undefined,
//       state: formData.state || undefined,
//       pincode: formData.pincode ? parseInt(formData.pincode) : undefined,
//       country_code: formData.country_code || undefined,
//     };

//     const response = await fetch(
//       'https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/register-patient',
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       if (response.status === 409 && result.existing_user) {
//         toast({
//           title: '⚠️ Patient Already Registered',
//           description: `${formData.email} is already associated with a patient. Please check the patient list or use a different email address.`,
//           variant: 'destructive',
//         });
//       } 
//       return;
//     }

//     toast({ title: 'Success', description: result.message || 'Patient registered successfully' });

//     if (result.temporary_password) {
//       setTempPassword(result.temporary_password);
//       setShowPasswordModal(true);
//     }

//     // Link the patient to the current facility
//     if (result.user_id) {
//       const { error: updateError } = await supabase
//         .from('patients')
//         .update({ facility_id: facilityId })
//         .eq('user_id', result.user_id);
//       if (updateError) {
//         console.error('Failed to link patient to facility:', updateError);
//         toast({
//           title: 'Warning',
//           description: 'Patient created but not linked to facility. Please contact support.',
//         });
//       }
//     }

//     // Reset form
//     setFormData({
//       first_name: '', last_name: '', email: '', phone: '', date_of_birth: '',
//       gender: '', address: '', emergency_contact_name: '', emergency_contact_phone: '',
//       blood_group: '', known_allergies: '', current_medications: '',
//       city: '', state: '', pincode: '', country_code: 'KR',
//     });

//     await fetchPatients(); // refresh list
//     setActiveView('list');
//   } catch (err: any) {
//     console.error(err);
//     toast({ title: 'Registration Failed', description: err.message, variant: 'destructive' });
//   } finally {
//     setSubmitting(false);
//   }
// };
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!facilityId) {
    toast({
      title: 'Error',
      description: 'Facility not identified',
      variant: 'destructive'
    });
    return;
  }

  if (
    !formData.first_name ||
    !formData.last_name ||
    !formData.email ||
    !formData.phone
  ) {
    toast({
      title: 'Missing Fields',
      description: 'Please fill all required fields',
      variant: 'destructive'
    });
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    toast({
      title: 'Invalid Email',
      description: 'Please enter a valid email address',
      variant: 'destructive',
    });
    return;
  }

  setSubmitting(true);

  let response: Response | undefined;
  let result: any = null;

  try {
    // Check existing email (optional, but avoids unnecessary edge function call)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", formData.email)
      .maybeSingle();

    if (existingProfile) {
      toast({
        title: "Patient Already Exists",
        description: "This email is already registered. Please use a different email.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Get access token
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const token = session?.access_token;
    if (!token) throw new Error("Authentication token missing");

    // Prepare payload
    const payload = {
      email: formData.email,
      name: `${formData.first_name} ${formData.last_name}`.trim(),
      phone_number: formData.phone,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
      emergency_contact_name: formData.emergency_contact_name,
      emergency_contact_number: formData.emergency_contact_phone,
      blood_group: formData.blood_group,
      known_allergies: formData.known_allergies,
      current_medications: formData.current_medications,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode ? parseInt(formData.pincode, 10) : null,
      country_code: formData.country_code,
    };

    // Call edge function
    response = await fetch(
      "https://mnthjabxkmgmbuquefyy.supabase.co/functions/v1/register-patient",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // Safely parse JSON response (edge function always returns JSON, but be defensive)
    const text = await response.text();
    result = text ? JSON.parse(text) : null;

    // ---- Handle HTTP errors (including 409 Conflict) ----
    if (!response.ok) {
      // 409 means email already exists in auth.users
      if (response.status === 409) {
        toast({
          title: "⚠️ Patient Already Registered",
          description: result?.message || `${formData.email} already exists`,
          variant: "destructive",
        });
        return;
      }

      // Other error statuses (4xx, 5xx)
      throw new Error(result?.message || `Registration failed (HTTP ${response.status})`);
    }

    // ---- SUCCESS: status 200 or 201 ----
    // Explicitly confirm that 201 Created is a success (though response.ok already covers it)
    const isSuccessStatus = response.status === 200 || response.status === 201;
    if (!isSuccessStatus) {
      // This should never happen because !response.ok would have been caught above,
      // but we keep it for safety.
      throw new Error(`Unexpected success status: ${response.status}`);
    }

    // Show success toast (use the message from the edge function)
    toast({
      title: "Success",
      description: result?.message || "Patient registered successfully",
    });

    // If a temporary password was returned, show it in a modal
    if (result?.temporary_password) {
      setTempPassword(result.temporary_password);
      setShowPasswordModal(true);
    }

    // ---- Link patient to the current facility ----
    // if (result?.user_id) {
    //   const { error: updateError } = await supabase
    //     .from("patients")
    //     .update({ facility_id: facilityId })
    //     .eq("user_id", result.user_id);

    //   if (updateError) {
    //     // Non‑critical error – the patient was created but not linked.
    //     // Log it and show a warning, but do not block the flow.
    //     console.warn("Facility linking failed:", updateError);
    //     toast({
    //       title: "Warning",
    //       description: "Patient created but not linked to facility. Please contact support.",
    //       variant: "default",
    //     });
    //   }
    // } else {
    //   console.warn("No user_id returned from registration endpoint");
    // }

    // ---- Log any non‑critical database errors (profiles/patients) ----
    if (result?.profile_error) {
      console.warn("Profile insert warning:", result.profile_error);
    }
    if (result?.patients_error) {
      console.warn("Patients insert warning:", result.patients_error);
    }

    // Reset form and refresh patient list
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: "",
      address: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      blood_group: "",
      known_allergies: "",
      current_medications: "",
      city: "",
      state: "",
      pincode: "",
      country_code: "",
    });

    await fetchPatients();

  } catch (err: any) {
    console.error("Registration error:", err);

    // Determine if the error occurred after a successful HTTP response
    const isSuccessStatus = response?.status === 200 || response?.status === 201;
    const errorMessage = result?.message || err?.message || "Something went wrong";

    toast({
      title: isSuccessStatus ? "Partial Success" : "Registration Failed",
      description: errorMessage,
      variant: isSuccessStatus ? "default" : "destructive",
    });
  } finally {
    setSubmitting(false);
  }
};

  const handleConfirmPatient = async (patientId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('patients')
      .update({ is_confirmed: !currentStatus })
      .eq('id', patientId);
    if (error) {
      toast({ title: 'Update Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Patient ${!currentStatus ? 'confirmed' : 'unconfirmed'}` });
      fetchPatients();
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(tempPassword);
    toast({ title: 'Copied', description: 'Password copied to clipboard' });
  };

  // ======================== RENDER HELPERS ========================

  const renderPatientList = () => {
    if (loading) return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
    if (patients.length === 0) return <Alert variant="info" className="m-3">No patients registered yet.</Alert>;

    return (
      <>
        {/* Desktop Table */}
        <div className="d-none d-md-block">
          <Table className="table-hover align-middle mb-0" style={{ minWidth: "700px" }}>
            <thead className="bg-light">
              <tr>
                <th className="ps-3">Name</th>
                <th>Contact</th>
                <th>DOB / Gender</th>
                <th>Status</th>
                <th className="pe-3 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, idx) => (
                <tr key={patient.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                  <td className="ps-3 fw-semibold">
                    {patient.first_name} {patient.last_name}
                  </td>
                  <td>
                    <div><Mail size={14} className="me-1 text-muted" /> {patient.email}</div>
                    <div><Phone size={14} className="me-1 text-muted" /> {patient.phone}</div>
                  </td>
                  <td>
                    {patient.date_of_birth || '-'}<br />
                    <span className="text-muted small">{patient.gender || '-'}</span>
                  </td>
                  <td>
                    {patient.is_confirmed ? (
                      <Badge bg="success" className="px-3 py-2 rounded-pill">
                        <CheckCircle size={12} className="me-1" /> Confirmed
                      </Badge>
                    ) : (
                      <Badge bg="warning" className="px-3 py-2 rounded-pill text-dark">
                        <AlertCircle size={12} className="me-1" /> Pending
                      </Badge>
                    )}
                  </td>
                  <td className="pe-3 text-end">
                    <Button
                      variant={patient.is_confirmed ? "outline-danger" : "outline-success"}
                      size="sm"
                      onClick={() => handleConfirmPatient(patient.id, patient.is_confirmed)}
                      className="rounded-pill px-3"
                    >
                      {patient.is_confirmed ? 'Undo Confirm' : 'Confirm'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Mobile Cards */}
        <div className="d-md-none">
          <Row className="g-3">
            {patients.map(patient => (
              <Col xs={12} key={patient.id}>
                <Card className="shadow-sm border-0 rounded-4">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Card.Title className="mb-0 fw-bold">
                        {patient.first_name} {patient.last_name}
                      </Card.Title>
                      {patient.is_confirmed ? (
                        <Badge bg="success" pill>Confirmed</Badge>
                      ) : (
                        <Badge bg="warning" pill>Pending</Badge>
                      )}
                    </div>
                    <Card.Text className="small text-muted mb-2">
                      <Mail size={14} className="me-1" /> {patient.email}<br />
                      <Phone size={14} className="me-1" /> {patient.phone}<br />
                      <Calendar size={14} className="me-1" /> {patient.date_of_birth || '-'}<br />
                      <span className="text-capitalize">{patient.gender || '-'}</span>
                    </Card.Text>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleConfirmPatient(patient.id, patient.is_confirmed)}
                      className="rounded-pill w-100 mt-2"
                    >
                      {patient.is_confirmed ? 'Undo Confirm' : 'Confirm Patient'}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  };

  // ======================== MAIN RENDER ========================
  return (
    <Container fluid className="py-4 px-3 px-md-4">
      {/* Facility Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-4 p-4 mb-5 text-white shadow-lg">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-3">
              <Users size={40} />
            </div>
            <div>
              <h2 className="mb-0 fw-bold">Patient Management</h2>
              <p className="mb-0 opacity-75">Register new patients, manage records, and confirm accounts</p>
            </div>
          </div>
          {/* <div className="d-flex gap-2">
            <Button
              variant={activeView === "register" ? "light" : "outline-light"}
              onClick={() => setActiveView("register")}
              className="rounded-pill px-4"
            >
              <UserPlus size={18} className="me-2" /> Register
            </Button>
            <Button
              variant={activeView === "list" ? "light" : "outline-light"}
              onClick={() => setActiveView("list")}
              className="rounded-pill px-4"
            >
              <Users size={18} className="me-2" /> Patient List
            </Button>
          </div> */}
        </div>
      </div>

      {/* Dynamic Views */}
      {activeView === "register" && (
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-3 d-flex align-items-center gap-2">
            <UserPlus size={20} /> New Patient Registration
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleRegister}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">First Name *</Form.Label>
                    <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Last Name *</Form.Label>
                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Email *</Form.Label>
                    <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Phone *</Form.Label>
                    <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select name="gender" value={formData.gender} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Blood Group</Form.Label>
                    <Form.Select name="blood_group" value={formData.blood_group} onChange={handleInputChange}>
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control as="textarea" rows={1} name="address" value={formData.address} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control type="text" name="city" value={formData.city} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control type="text" name="state" value={formData.state} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country Code</Form.Label>
                    <Form.Control type="text" name="country_code" value={formData.country_code} onChange={handleInputChange} placeholder="KR, IN, US" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Known Allergies</Form.Label>
                    <Form.Control type="text" name="known_allergies" value={formData.known_allergies} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Medications</Form.Label>
                    <Form.Control type="text" name="current_medications" value={formData.current_medications} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact Name</Form.Label>
                    <Form.Control type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Emergency Contact Phone</Form.Label>
                    <Form.Control type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" variant="success" disabled={submitting} className="rounded-pill px-4 py-2 fw-semibold">
                {submitting ? "Register ...": "Register Patient"}
                
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {activeView === "list" && (
        <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
          <Card.Header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 d-flex align-items-center gap-2">
            <Users size={20} /> Registered Patients
          </Card.Header>
          <Card.Body className="p-0">
            {renderPatientList()}
          </Card.Body>
        </Card>
      )}

      {/* Password Modal (unchanged except for styling) */}
      {/* <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Patient Account Created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please share the following temporary password with the patient:</p>
          <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3">
            <code className="fs-5">{tempPassword}</code>
            <Button variant="outline-secondary" size="sm" onClick={copyPassword}>
              <Copy size={16} className="me-1" /> Copy
            </Button>
          </div>
          <p className="mt-3 text-muted small">The patient will be prompted to change their password on first login.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPasswordModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal> */}
    </Container>
  );
};

export default FacilityPatientManagement;