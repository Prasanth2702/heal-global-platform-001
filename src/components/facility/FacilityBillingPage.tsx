// // // // import React, { useState, useEffect } from 'react';
// // // // import { Button, Form, Table, Card, Row, Col, Container, Alert, Spinner, InputGroup } from 'react-bootstrap';
// // // // import { FileText, Users, Search, PlusCircle, Receipt, Calendar, DollarSign } from 'lucide-react';
// // // // import { supabase } from '@/integrations/supabase/client';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import { useUser } from '@/hooks/useUser';

// // // // interface Patient {
// // // //   id: string;
// // // //   first_name: string;
// // // //   last_name: string;
// // // //   email: string;
// // // //   phone: string;
// // // //   address?: string;
// // // // }

// // // // interface Department {
// // // //   id: string;
// // // //   name: string;
// // // //   price_per_day: number;
// // // // }

// // // // interface Bill {
// // // //   id: string;
// // // //   patient_id: string;
// // // //   department_id: string;
// // // //   amount: number;
// // // //   description: string;
// // // //   status: 'pending' | 'paid' | 'cancelled';
// // // //   created_at: string;
// // // // }

// // // // const FacilityBillingPage: React.FC = () => {
// // // //   const { toast } = useToast();
// // // //   const { user } = useUser();
// // // //   const [facilityId, setFacilityId] = useState<string | null>(null);
// // // //   const [activeTab, setActiveTab] = useState<'billing' | 'patients'>('billing');

// // // //   // Data states
// // // //   const [patients, setPatients] = useState<Patient[]>([]);
// // // //   const [departments, setDepartments] = useState<Department[]>([]);
// // // //   const [bills, setBills] = useState<Bill[]>([]);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [submitting, setSubmitting] = useState(false);

// // // //   // Billing form state
// // // //   const [searchTerm, setSearchTerm] = useState('');
// // // //   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
// // // //   const [selectedDepartment, setSelectedDepartment] = useState<string>('');
// // // //   const [amount, setAmount] = useState<number>(0);
// // // //   const [description, setDescription] = useState('');
// // // //   const [status, setStatus] = useState<'pending' | 'paid'>('pending');

// // // //   // Get facility ID
// // // //   useEffect(() => {
// // // //     const getFacility = async () => {
// // // //       if (!user) return;
// // // //       const { data, error } = await supabase
// // // //         .from('facilities')
// // // //         .select('id')
// // // //         .eq('admin_user_id', user.id)
// // // //         .single();
// // // //       if (error) {
// // // //         toast({ title: 'Error', description: 'Facility not found', variant: 'destructive' });
// // // //       } else if (data) {
// // // //         setFacilityId(data.id);
// // // //       }
// // // //     };
// // // //     getFacility();
// // // //   }, [user, toast]);

// // // //   // Fetch departments when facility is known
// // // //   useEffect(() => {
// // // //     if (facilityId) {
// // // //       fetchDepartments();
// // // //       fetchPatients();
// // // //     }
// // // //   }, [facilityId]);

// // // //   const fetchDepartments = async () => {
// // // //     const { data, error } = await supabase
// // // //       .from('departments')
// // // //       .select('id, name, price_per_day')
// // // //       .eq('facility_id', facilityId)
// // // //       .eq('is_active', true);
// // // //     if (error) {
// // // //       toast({ title: 'Error', description: 'Failed to load departments', variant: 'destructive' });
// // // //     } else {
// // // //       setDepartments(data || []);
// // // //     }
// // // //   };

// // // //   const fetchPatients = async () => {
// // // //     if (!facilityId) return;
// // // //     setLoading(true);
// // // //     const { data, error } = await supabase
// // // //       .from('patients')
// // // //       .select('id, first_name, last_name, email, phone, address')
// // // //       .eq('facility_id', facilityId)
// // // //       .order('first_name');
// // // //     if (error) {
// // // //       toast({ title: 'Error', description: 'Failed to load patients', variant: 'destructive' });
// // // //     } else {
// // // //       setPatients(data || []);
// // // //     }
// // // //     setLoading(false);
// // // //   };

// // // //   const fetchPatientBills = async (patientId: string) => {
// // // //     const { data, error } = await supabase
// // // //       .from('bills')
// // // //       .select('*')
// // // //       .eq('patient_id', patientId)
// // // //       .order('created_at', { ascending: false });
// // // //     if (!error) setBills(data || []);
// // // //   };

// // // //   const handleDepartmentChange = (deptId: string) => {
// // // //     setSelectedDepartment(deptId);
// // // //     const dept = departments.find(d => d.id === deptId);
// // // //     if (dept) setAmount(dept.price_per_day);
// // // //   };

// // // //   const handleSelectPatient = (patient: Patient) => {
// // // //     setSelectedPatient(patient);
// // // //     fetchPatientBills(patient.id);
// // // //     setSearchTerm('');
// // // //   };

// // // //   const handleCreateBill = async (e: React.FormEvent) => {
// // // //     e.preventDefault();
// // // //     if (!selectedPatient) {
// // // //       toast({ title: 'Error', description: 'Please select a patient', variant: 'destructive' });
// // // //       return;
// // // //     }
// // // //     if (!selectedDepartment) {
// // // //       toast({ title: 'Error', description: 'Please select a department', variant: 'destructive' });
// // // //       return;
// // // //     }
// // // //     if (amount <= 0) {
// // // //       toast({ title: 'Error', description: 'Amount must be greater than zero', variant: 'destructive' });
// // // //       return;
// // // //     }

// // // //     setSubmitting(true);
// // // //     const newBill = {
// // // //       patient_id: selectedPatient.id,
// // // //       department_id: selectedDepartment,
// // // //       amount,
// // // //       description: description || `${selectedPatient.first_name} ${selectedPatient.last_name} - ${departments.find(d => d.id === selectedDepartment)?.name} consultation`,
// // // //       status,
// // // //       created_by: user?.id,
// // // //       created_at: new Date().toISOString(),
// // // //     };

// // // //     const { error } = await supabase.from('bills').insert([newBill]);
// // // //     if (error) {
// // // //       toast({ title: 'Error', description: error.message, variant: 'destructive' });
// // // //     } else {
// // // //       toast({ title: 'Success', description: 'Bill created successfully' });
// // // //       // Reset form except patient
// // // //       setSelectedDepartment('');
// // // //       setAmount(0);
// // // //       setDescription('');
// // // //       setStatus('pending');
// // // //       fetchPatientBills(selectedPatient.id); // refresh bills list
// // // //     }
// // // //     setSubmitting(false);
// // // //   };

// // // //   // Filter patients for search (used in billing view dropdown)
// // // //   const filteredPatients = patients.filter(p =>
// // // //     `${p.first_name} ${p.last_name} ${p.email} ${p.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
// // // //   );

// // // //   // Render patient list (desktop table + mobile cards)
// // // //   const renderPatientList = () => {
// // // //     if (loading) return <div className="text-center py-4"><Spinner animation="border" /></div>;
// // // //     if (patients.length === 0) return <Alert variant="info">No patients registered.</Alert>;

// // // //     return (
// // // //       <>
// // // //         <div className="d-none d-md-block">
// // // //           <Table striped bordered hover responsive>
// // // //             <thead>
// // // //               <tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Action</th></tr>
// // // //             </thead>
// // // //             <tbody>
// // // //               {patients.map(patient => (
// // // //                 <tr key={patient.id}>
// // // //                   <td>{patient.first_name} {patient.last_name}</td>
// // // //                   <td>{patient.email}</td>
// // // //                   <td>{patient.phone}</td>
// // // //                   <td>{patient.address || '-'}</td>
// // // //                   <td><Button size="sm" variant="outline-primary" onClick={() => { setActiveTab('billing'); handleSelectPatient(patient); }}>Create Bill</Button></td>
// // // //                 </tr>
// // // //               ))}
// // // //             </tbody>
// // // //           </Table>
// // // //         </div>
// // // //         <div className="d-md-none">
// // // //           <Row>
// // // //             {patients.map(patient => (
// // // //               <Col xs={12} className="mb-3" key={patient.id}>
// // // //                 <Card>
// // // //                   <Card.Body>
// // // //                     <Card.Title>{patient.first_name} {patient.last_name}</Card.Title>
// // // //                     <Card.Text>
// // // //                       <strong>Email:</strong> {patient.email}<br />
// // // //                       <strong>Phone:</strong> {patient.phone}<br />
// // // //                       <strong>Address:</strong> {patient.address || '-'}
// // // //                     </Card.Text>
// // // //                     <Button size="sm" variant="outline-primary" onClick={() => { setActiveTab('billing'); handleSelectPatient(patient); }}>Create Bill</Button>
// // // //                   </Card.Body>
// // // //                 </Card>
// // // //               </Col>
// // // //             ))}
// // // //           </Row>
// // // //         </div>
// // // //       </>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <Container fluid className="py-4">
// // // //       <h2 className="mb-4">Billing Management</h2>
// // // //       <div className="d-flex gap-3 mb-4">
// // // //         <Button variant={activeTab === 'billing' ? 'primary' : 'outline-secondary'} onClick={() => setActiveTab('billing')}>
// // // //           <Receipt className="me-2" size={18} /> New Bill
// // // //         </Button>
// // // //         <Button variant={activeTab === 'patients' ? 'primary' : 'outline-secondary'} onClick={() => setActiveTab('patients')}>
// // // //           <Users className="me-2" size={18} /> Patient List
// // // //         </Button>
// // // //       </div>

// // // //       {activeTab === 'billing' && (
// // // //         <Row>
// // // //           <Col lg={6}>
// // // //             <Card className="mb-4">
// // // //               <Card.Header>Create New Bill</Card.Header>
// // // //               <Card.Body>
// // // //                 <Form onSubmit={handleCreateBill}>
// // // //                   <Form.Group className="mb-3">
// // // //                     <Form.Label>Search Patient</Form.Label>
// // // //                     <InputGroup>
// // // //                       <InputGroup.Text><Search size={18} /></InputGroup.Text>
// // // //                       <Form.Control
// // // //                         type="text"
// // // //                         placeholder="Type name, email or phone"
// // // //                         value={searchTerm}
// // // //                         onChange={(e) => setSearchTerm(e.target.value)}
// // // //                       />
// // // //                     </InputGroup>
// // // //                     {searchTerm && filteredPatients.length > 0 && (
// // // //                       <div className="mt-2 border rounded p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
// // // //                         {filteredPatients.map(p => (
// // // //                           <div key={p.id} className="d-flex justify-content-between align-items-center p-1 border-bottom">
// // // //                             <span>{p.first_name} {p.last_name} ({p.email})</span>
// // // //                             <Button size="sm" variant="link" onClick={() => handleSelectPatient(p)}>Select</Button>
// // // //                           </div>
// // // //                         ))}
// // // //                       </div>
// // // //                     )}
// // // //                     {selectedPatient && (
// // // //                       <Alert variant="success" className="mt-2">
// // // //                         <strong>Selected Patient:</strong> {selectedPatient.first_name} {selectedPatient.last_name} ({selectedPatient.email})
// // // //                       </Alert>
// // // //                     )}
// // // //                   </Form.Group>

// // // //                   <Form.Group className="mb-3">
// // // //                     <Form.Label>Department</Form.Label>
// // // //                     <Form.Select value={selectedDepartment} onChange={(e) => handleDepartmentChange(e.target.value)}>
// // // //                       <option value="">Select department</option>
// // // //                       {departments.map(dept => (
// // // //                         <option key={dept.id} value={dept.id}>{dept.name} - ₹{dept.price_per_day}</option>
// // // //                       ))}
// // // //                     </Form.Select>
// // // //                   </Form.Group>

// // // //                   <Form.Group className="mb-3">
// // // //                     <Form.Label>Amount (₹)</Form.Label>
// // // //                     <InputGroup>
// // // //                       <InputGroup.Text><DollarSign size={18} /></InputGroup.Text>
// // // //                       <Form.Control type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} min="0" step="1" required />
// // // //                     </InputGroup>
// // // //                   </Form.Group>

// // // //                   <Form.Group className="mb-3">
// // // //                     <Form.Label>Description (Optional)</Form.Label>
// // // //                     <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
// // // //                   </Form.Group>

// // // //                   <Form.Group className="mb-3">
// // // //                     <Form.Label>Status</Form.Label>
// // // //                     <Form.Select value={status} onChange={(e) => setStatus(e.target.value as 'pending' | 'paid')}>
// // // //                       <option value="pending">Pending</option>
// // // //                       <option value="paid">Paid</option>
// // // //                     </Form.Select>
// // // //                   </Form.Group>

// // // //                   <Button type="submit" variant="success" disabled={submitting}>
// // // //                     {submitting ? <Spinner size="sm" className="me-2" /> : <PlusCircle size={18} className="me-2" />}
// // // //                     Create Bill
// // // //                   </Button>
// // // //                 </Form>
// // // //               </Card.Body>
// // // //             </Card>
// // // //           </Col>

// // // //           <Col lg={6}>
// // // //             <Card>
// // // //               <Card.Header>Recent Bills - {selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : 'Select a patient'}</Card.Header>
// // // //               <Card.Body>
// // // //                 {!selectedPatient ? (
// // // //                   <Alert variant="info">Search and select a patient to see their bills.</Alert>
// // // //                 ) : bills.length === 0 ? (
// // // //                   <Alert variant="secondary">No bills found for this patient.</Alert>
// // // //                 ) : (
// // // //                   <div className="table-responsive">
// // // //                     <Table size="sm">
// // // //                       <thead><tr><th>Date</th><th>Department</th><th>Amount</th><th>Status</th></tr></thead>
// // // //                       <tbody>
// // // //                         {bills.map(bill => {
// // // //                           const dept = departments.find(d => d.id === bill.department_id);
// // // //                           return (
// // // //                             <tr key={bill.id}>
// // // //                               <td>{new Date(bill.created_at).toLocaleDateString()}</td>
// // // //                               <td>{dept?.name || '-'}</td>
// // // //                               <td>₹{bill.amount}</td>
// // // //                               <td>{bill.status}</td>
// // // //                             </tr>
// // // //                           );
// // // //                         })}
// // // //                       </tbody>
// // // //                     </Table>
// // // //                   </div>
// // // //                 )}
// // // //               </Card.Body>
// // // //             </Card>
// // // //           </Col>
// // // //         </Row>
// // // //       )}

// // // //       {activeTab === 'patients' && (
// // // //         <Card>
// // // //           <Card.Header>Patient Directory</Card.Header>
// // // //           <Card.Body>
// // // //             {renderPatientList()}
// // // //           </Card.Body>
// // // //         </Card>
// // // //       )}
// // // //     </Container>
// // // //   );
// // // // };

// // // // export default FacilityBillingPage;





// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Table,
//   Spinner,
//   InputGroup,
//   Alert,
//   Tabs,
//   Tab,
// } from "react-bootstrap";
// import {
//   Search,
//   Receipt,
//   Users,
//   PlusCircle,
//   DollarSign,
//   History,
//   FileText,
// } from "lucide-react";

// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { useUser } from "@/hooks/useUser";

// // ======================== TYPES ========================
// interface Patient {
//   id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string;
// }

// interface Department {
//   id: string;
//   name: string;
// }

// interface FacilityItem {
//   id: string;
//   department_id: string;
//   facility_id?: string;
//   item_name: string;
//   item_price: number;
//   bill_number?: string;
//   isPaid?: boolean;
//   payment_method?: string;
// }

// interface BilledItem {
//  id: string;
//   created_at: string;
//   bill_number?: string;
//   isPaid?: boolean;
//   payment_method?: string;
//   amount?: number;
//   facility_items_master: {
//     item_name: string;
//     item_price: number;
//   };
// }

// interface PatientWithTotal extends Patient {
//   item_name:string;
//    total_billed: number;
//   bill_number?: string;
//   isPaid?: boolean;
//   payment_method?: string;
// }

// // ======================== COMPONENT ========================
// const FacilityBillingPage = () => {
//   const { user } = useUser();
//   const { toast } = useToast();

//   // Core state
//   const [facilityId, setFacilityId] = useState<string | null>(null);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
//   const [patients, setPatients] = useState<Patient[]>([]);
//   const [patientBills, setPatientBills] = useState<BilledItem[]>([]);
//   const [patientsWithTotal, setPatientsWithTotal] = useState<PatientWithTotal[]>([]);

//   // Form selections
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedItem, setSelectedItem] = useState<string>("");
// const [amount, setAmount] = useState("");
//   // UI state
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loadingPatients, setLoadingPatients] = useState(false);
//   const [loadingBills, setLoadingBills] = useState(false);
//   const [creatingBill, setCreatingBill] = useState(false);
//   const [loadingTotals, setLoadingTotals] = useState(false);
//   const [activeView, setActiveView] = useState<"billage" | "history" | "create">("create");
// const [itemName, setItemName] = useState("");
// const [itemPrice, setItemPrice] = useState("");
// const [creatingItem, setCreatingItem] = useState(false);
// const [billNumber, setBillNumber] = useState("");
// const [isPaid, setIsPaid] = useState(false);
// const [paymentMethod, setPaymentMethod] = useState("");
//   // 1. Get facility ID from admin_user_id
//   useEffect(() => {
//     const getFacility = async () => {
//       if (!user) return;
//       const { data, error } = await supabase
//         .from("facilities")
//         .select("id")
//         .eq("admin_user_id", user.id)
//         .single();

//       if (error) {
//         toast({
//           title: "Error",
//           description: "Facility not found for this admin.",
//           variant: "destructive",
//         });
//       } else if (data) {
//         setFacilityId(data.id);
//       }
//     };
//     getFacility();
//   }, [user, toast]);

//   // 2. Fetch departments once facilityId is known
//   useEffect(() => {
//     if (facilityId) {
//       fetchDepartments();
//       fetchPatients();
//     }
//   }, [facilityId]);
// // useEffect(() => {
// //   const generateBill = () => {
// //     const random = Math.floor(10000 + Math.random() * 90000);
// //     setBillNumber(`BILL-${random}`);
// //   };

// //   generateBill();
// // }, []);
//   // 3. When patients list changes, fetch their total billed amounts (for Billage view)
//   useEffect(() => {
//     if (patients.length > 0 && facilityId) {
//       fetchPatientsTotalBilled();
//     }
//   }, [patients, facilityId]);

//   const fetchDepartments = async () => {
//     const { data, error } = await supabase
//       .from("departments")
//       .select("id, name")
//       .eq("facility_id", facilityId)
//       .eq("is_active", true);

//     if (error) {
//       toast({ title: "Error", description: "Failed to load departments", variant: "destructive" });
//     } else {
//       setDepartments(data || []);
//     }
//   };

//   // 4. Fetch all patients (role = 'patient')
//   const fetchPatients = async () => {
//     setLoadingPatients(true);
//     const { data, error } = await supabase
//       .from("profiles")
//       .select("id, first_name, last_name, email, phone_number")
//       .eq("role", "patient")
//       .order("first_name");

//     if (error) {
//       toast({ title: "Error", description: "Failed to load patients", variant: "destructive" });
//     } else {
//       setPatients(data || []);
//     }
//     setLoadingPatients(false);
//   };

//   // 5. For each patient, compute total billed amount (sum of item prices from their bills)
// // const fetchPatientsTotalBilled = async () => {
// //   if (!facilityId) return;

// //   setLoadingTotals(true);

// //   try {
// //     const totals: PatientWithTotal[] = [];

// //     for (const patient of patients) {
// //       // 1. Get billed items
// //       const { data: bills, error } = await supabase
// //         .from("facility_billed_items")
// //         .select("item_id")
// //         .eq("patient_id", patient.id)
// //         .eq("facility_id", facilityId);

// //       let total = 0;

// //       if (!error && bills && bills.length > 0) {
// //         const itemIds = bills.map((b) => b.item_id);

// //         // 2. Get item prices
// //         const { data: items } = await supabase
// //           .from("facility_items_master")
// //           .select("id, item_price,ispaid,bill_number,payment_medthod")
// //           .in("id", itemIds);

// //         // 3. Calculate total
// //         total =
// //           items?.reduce((sum, item) => sum + (item.item_price || 0), 0) || 0;
// //       }

// //       totals.push({
// //         ...patient,
// //         total_billed: total,
// //         isPaid:isPaid,
// //         bill_number:billNumber,
// //         payment_method:paymentMethod
// //       });
// //     }

// //     setPatientsWithTotal(totals);
// //   } catch (err) {
// //     console.error(err);
// //   } finally {
// //     setLoadingTotals(false);
// //   }
// // };

// // const fetchPatientsTotalBilled = async () => {
// //   if (!facilityId) return;

// //   setLoadingTotals(true);

// //   try {
// //     const totals: PatientWithTotal[] = [];

// //     for (const patient of patients) {
// //       const { data: bills, error } = await supabase
// //         .from("facility_billed_items")
// //         .select(`
// //           bill_number,
// //           ispaid,
// //           payment_method,
// //           facility_items_master (
// //             item_price
// //           )
// //         `)
// //         .eq("patient_id", patient.id)
// //         .eq("facility_id", facilityId);

// //       let total = 0;
// //       let billNumber = "";
// //       let isPaid = false;
// //       let paymentMethod = "";

// //       if (!error && bills && bills.length > 0) {
// //         total = bills.reduce(
// //           (sum: number, bill: any) =>
// //             sum + (bill.facility_items_master?.item_price || 0),
// //           0
// //         );

// //         billNumber = bills[0]?.bill_number || "";
// //         isPaid = bills[0]?.ispaid || false;
// //         paymentMethod = bills[0]?.payment_method || "";
// //       }

// //       totals.push({
// //         ...patient,
// //         total_billed: total,
// //         bill_number: billNumber,
// //         isPaid: isPaid,
// //         item_name:itemName,
// //         payment_method: paymentMethod,
// //       });
// //     }

// //     setPatientsWithTotal(totals);
// //   } catch (err) {
// //     console.error(err);
// //   } finally {
// //     setLoadingTotals(false);
// //   }
// // };
// const fetchPatientsTotalBilled = async () => {
//   if (!facilityId) return;

//   setLoadingTotals(true);

//   try {
//     // 1. Get billed items
//     const { data: bills, error } = await supabase
//       .from("facility_billed_items")
//       .select("*")
//       .eq("facility_id", facilityId)
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     // 2. Get item IDs
//     const itemIds = bills.map(b => b.item_id);

//     // 3. Fetch items
//     const { data: items } = await supabase
//       .from("facility_items_master")
//       .select("id, item_name, item_price")
//       .in("id", itemIds);

//     // 4. Merge Data
//     const merged = bills.map(bill => {
//       const item = items?.find(i => i.id === bill.item_id);
//       const patient = patients.find(p => p.id === bill.patient_id);

//       return {
//         ...patient,
//         id: bill.id,
//         item_name: item?.item_name || "",
//         total_billed: item?.item_price || 0,
//         bill_number: bill.bill_number || "",
//         isPaid: bill.ispaid || false,
//         payment_method: bill.payment_method || "",
//       };
//     });

//     setPatientsWithTotal(merged);

//   } catch (err) {
//     console.error(err);
//   } finally {
//     setLoadingTotals(false);
//   }
// };

//   // 6. Fetch facility items for selected department + facility
// //   const fetchFacilityItems = async (deptId: string) => {
// //     if (!facilityId) return;
// //     const { data, error } = await supabase
// //       .from("facility_items_master")
// //       .select("id, item_name, item_price")
// //       .eq("facility_id", facilityId)
// //       .eq("department_id", deptId)
// //       .eq("active", true);

// //     if (error) {
// //       toast({ title: "Error", description: "Failed to load items", variant: "destructive" });
// //       setFacilityItems([]);
// //     } else {
// //       setFacilityItems(data || []);
// //     }
// //   };
// const fetchFacilityItems = async (deptId: string) => {
//   if (!facilityId) return;

//   const { data, error } = await supabase
//     .from("facility_items_master")
//     .select("id, department_id, item_name, item_price")
//     .eq("facility_id", facilityId)
//     .eq("department_id", deptId)
//     .eq("active", true);

//   if (error) {
//     toast({
//       title: "Error",
//       description: "Failed to load items",
//       variant: "destructive",
//     });
//     setFacilityItems([]);
//   } else {
//     setFacilityItems(data || []);
//   }
// };
//   // 7. Fetch existing bills for a patient + facility
//  const fetchPatientBills = async (patientId: string) => {
//   if (!facilityId) return;

//   setLoadingBills(true);

//   const { data: bills, error } = await supabase
//     .from("facility_billed_items")
//     .select("*")
//     .eq("patient_id", patientId)
//     .eq("facility_id", facilityId)
//     .order("created_at", { ascending: false });

//   if (error) {
//     toast({
//       title: "Error",
//       description: "Failed to load billing history",
//       variant: "destructive",
//     });
//     setPatientBills([]);
//     setLoadingBills(false);
//     return;
//   }

//   // Fetch items separately
//   const itemIds = bills.map(b => b.item_id);

//   const { data: items } = await supabase
//     .from("facility_items_master")
//     .select("id, item_name, item_price")
//     .in("id", itemIds);

//   const merged = bills.map(bill => ({
//     ...bill,
//     facility_items_master: items?.find(i => i.id === bill.item_id)
//   }));

//   setPatientBills(merged || []);
//   setLoadingBills(false);
// };
// const handleItemChange = (e) => {
//   const itemId = e.target.value;
//   setSelectedItem(itemId);

//   const selected = facilityItems.find(item => item.id === itemId);
//   setAmount(selected ? String(selected.item_price) : "");
// };
// const handleCreateItem = async () => {
//   if (!facilityId) return;

//   if (!selectedDepartment) {
//     toast({
//       title: "Error",
//       description: "Select Department",
//       variant: "destructive",
//     });
//     return;
//   }

//   if (!itemName || !itemPrice) {
//     toast({
//       title: "Error",
//       description: "Enter Item Name & Price",
//       variant: "destructive",
//     });
//     return;
//   }

//   setCreatingItem(true);

//   const { error } = await supabase
//     .from("facility_items_master")
//     .insert([
//       {
//         facility_id: facilityId,
//         department_id: selectedDepartment,
//         item_name: itemName,
//         item_price: itemPrice,
//         active: true,
//       },
//     ]);

//   if (error) {
//     toast({
//       title: "Error",
//       description: error.message,
//       variant: "destructive",
//     });
//   } else {
//     toast({
//       title: "Success",
//       description: "Billing item created",
//     });

//     setItemName("");
//     setItemPrice("");

//     fetchFacilityItems(selectedDepartment);
//   }

//   setCreatingItem(false);
// };
//   // 8. Handle department change -> load items
//   const handleDepartmentChange = (deptId: string) => {
//     setSelectedDepartment(deptId);
//     setSelectedItem("");
//     if (deptId) {
//       fetchFacilityItems(deptId);
//     } else {
//       setFacilityItems([]);
//     }
//   };

//   // 9. Create a new billing entry
//   const handleCreateBill = async () => {
//     if (!selectedPatient) {
//       toast({ title: "Error", description: "Please select a patient first.", variant: "destructive" });
//       return;
//     }
//     if (!selectedItem) {
//       toast({ title: "Error", description: "Please select an item.", variant: "destructive" });
//       return;
//     }
//     if (!facilityId) {
//       toast({ title: "Error", description: "Facility not identified.", variant: "destructive" });
//       return;
//     }

//     setCreatingBill(true);
//     const { error } = await supabase.from("facility_billed_items").insert([
//       {
//         facility_id: facilityId,
//       patient_id: selectedPatient.id,
//       item_id: selectedItem,
//       added_by: user?.id,
//       bill_number: billNumber,
//       ispaid: isPaid,
//       payment_method: paymentMethod,
//       created_at: new Date().toISOString(),
//       },
//     ]);

//     if (error) {
//       toast({ title: "Error", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "Success", description: "Billing created successfully." });
//       // Refresh data
//       await fetchPatientBills(selectedPatient.id);
//       await fetchPatientsTotalBilled(); // update totals in Billage view
//       setSelectedDepartment("");
//       setSelectedItem("");
//       setFacilityItems([]);
//     }
//     setCreatingBill(false);
//   };

//   // 10. Patient selection handler (used in History & Create views)
//   const handleSelectPatient = (patient: Patient) => {
//     setSelectedPatient(patient);
//     setSearchTerm("");
//     setSelectedDepartment("");
//     setSelectedItem("");
//     setFacilityItems([]);
//     fetchPatientBills(patient.id);
//   };

//   // Filter patients based on search input (for Create view dropdown)
//   const filteredPatients = patients.filter((p) =>
//     `${p.first_name} ${p.last_name} ${p.email} ${p.phone_number}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   // Calculate total amount for current patient's bills
//   const totalAmount = patientBills.reduce(
//     (sum, bill) => sum + (bill.facility_items_master?.item_price || 0),
//     0
//   );

//   // ======================== RENDER VIEWS ========================

  

//   // View 2: Billing History – Detailed bills for a selected patient
//   const renderHistoryView = () => (
//     <>
    
//     <Card>
//       <Card.Header className="d-flex align-items-center gap-2">
//         <Users size={18} /> Patient Billing History
//       </Card.Header>
//       <Card.Body>
//         {loadingTotals ? (
//           <div className="text-center py-4">
//             <Spinner animation="border" />
//           </div>
//         ) : patientsWithTotal.length === 0 ? (
//           <Alert variant="info">No patients found.</Alert>
//         ) : (
//           <div className="table-responsive">
//             <Table striped hover>
//               <thead>
//                 <tr>
//                   <th>Bill Number</th>
//                   <th>Item Name</th>
//                   <th>Total Billed (₹)</th>
//                   <th>Status</th>
//                   <th className="text-end">Payment Method</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {patientsWithTotal.map((p) => (
//                   <tr key={p.id}>
//                     <td>
//                       {p.bill_number}
//                     </td>
//                     <td>
//                       {p.item_name}
//                     </td>
//                     {/* <td>{p.email}</td>
//                     <td>{p.phone_number}</td> */}
//                     <td >
//                       ₹{p.total_billed.toFixed(2)}
//                     </td>
//                     <td>
//   {p.isPaid ? (
//     <span className="text-success fw-bold">Paid</span>
//   ) : (
//     <span className="text-danger fw-bold">Unpaid</span>
//   )}
// </td>
//                     <td className="text-end fw-bold">
//                       {p.payment_method}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </Table>
//           </div>
//         )}
//       </Card.Body>
//     </Card>
//     </>
//   );

//   // View 3: Create Billing – Original form (left column)
//   const renderCreateView = () => (
//     <Row>
//       <Col lg={6}>
//         <Card>
//           <Card.Header className="d-flex align-items-center gap-2">
//             <PlusCircle size={18} /> Create New Billing
//           </Card.Header>
//           <Card.Body>
//             {/* Patient Search */}
//             <Form.Group className="mb-3">
//               <Form.Label>Search Patient</Form.Label>
//               <InputGroup>
//                 <InputGroup.Text>
//                   <Search size={18} />
//                 </InputGroup.Text>
//                 <Form.Control
//                   placeholder="Type name, email or phone..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </InputGroup>

//               {searchTerm && (
//                 <div
//                   className="border rounded p-2 mt-2"
//                   style={{ maxHeight: "250px", overflowY: "auto" }}
//                 >
//                   {loadingPatients ? (
//                     <div className="text-center">
//                       <Spinner size="sm" />
//                     </div>
//                   ) : filteredPatients.length === 0 ? (
//                     <Alert variant="info" className="m-0">
//                       No patients found.
//                     </Alert>
//                   ) : (
//                     filteredPatients.map((p) => (
//                       <div
//                         key={p.id}
//                         className="d-flex justify-content-between align-items-center p-2 border-bottom"
//                       >
//                         <span>
//                           <strong>
//                             {p.first_name} {p.last_name}
//                           </strong>
//                           <br />
//                           <small>
//                             {p.email} | {p.phone_number}
//                           </small>
//                         </span>
//                         <Button size="sm" onClick={() => handleSelectPatient(p)}>
//                           Select
//                         </Button>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               )}

//               {selectedPatient && (
//                 <Alert variant="success" className="mt-2">
//                   <strong>Selected Patient:</strong> {selectedPatient.first_name}{" "}
//                   {selectedPatient.last_name} ({selectedPatient.email})
//                 </Alert>
//               )}
//             </Form.Group>

//             {/* Bill Number */}
// <Form.Group className="mb-3">
//   <Form.Label>Bill Number</Form.Label>
//   <Form.Control
//     type="text"
//     placeholder="Enter Bill Number"
//     value={billNumber}
//     onChange={(e) => setBillNumber(e.target.value)}
//   />
// </Form.Group>

//             {/* Department Dropdown */}
//             <Form.Group className="mb-3">
//               <Form.Label>Department</Form.Label>
//               <Form.Select
//                 value={selectedDepartment}
//                 onChange={(e) => handleDepartmentChange(e.target.value)}
//                 disabled={!selectedPatient}
//               >
//                 <option value="">Select Department</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>

//             {/* Items Dropdown */}
//             <Form.Group className="mb-3">
//   <Form.Label>Item / Service</Form.Label>
//   <Form.Select
//     value={selectedItem}
//     onChange={handleItemChange}
//     disabled={!selectedDepartment}
//   >
//     <option value="">Select Item</option>
//     {facilityItems.map((item) => (
//       <option key={item.id} value={item.id}>
//         {item.item_name} - ₹{item.item_price}
//       </option>
//     ))}
//   </Form.Select>

//   {selectedDepartment && facilityItems.length === 0 && !loadingPatients && (
//     <Alert variant="warning" className="mt-2">
//       No active items found for this department.
//     </Alert>
//   )}
// </Form.Group>
//             <Form.Group className="mb-3">
//   <Form.Label>Amount</Form.Label>
//   <Form.Control
//     type="text"
//     value={amount ? `₹ ${amount}` : ""}
//     placeholder="Amount will appear automatically"
//     readOnly
//   />
// </Form.Group>

// <Form.Group className="mb-3">
//   <Form.Label>Payment Status</Form.Label>
//   <Form.Select
//     value={isPaid ? "paid" : "unpaid"}
//     onChange={(e) => setIsPaid(e.target.value === "paid")}
//   >
//     <option value="unpaid">UnPaid</option>
//     <option value="paid">Paid</option>
//   </Form.Select>
// </Form.Group>

// {/* Payment Method */}
// <Form.Group className="mb-3">
//   <Form.Label>Payment Method</Form.Label>
//   <Form.Select
//     value={paymentMethod}
//     onChange={(e) => setPaymentMethod(e.target.value)}
//   >
//     <option value="">Select Payment Method</option>
//     <option value="offline">Offline</option>
//     <option value="online">Online</option>
//     <option value="upi">UPI</option>
//   </Form.Select>
// </Form.Group>
//             <Button
//               onClick={handleCreateBill}
//             //   disabled={!selectedPatient || !selectedItem || creatingBill}
//               className="w-100"
//             >
//               {creatingBill ? (
//                 <>
//                   <Spinner size="sm" className="me-2" /> Saving...
//                 </>
//               ) : (
//                 <>
//                   <PlusCircle size={18} className="me-2" /> Save
//                 </>
//               )}
//             </Button>
//           </Card.Body>
//         </Card>
//       </Col>
//     </Row>
//   );

//   // ======================== MAIN RENDER ========================
//   return (
//     <Container fluid className="py-4">
//       <h3 className="mb-4 d-flex align-items-center gap-2">
//         <Receipt size={28} /> Facility Billing
//       </h3>

//       {/* Top Button Group */}
//       <div className="d-flex gap-2 mb-4 flex-wrap">
//         <Button
//           variant={activeView === "create" ? "primary" : "outline-secondary"}
//           onClick={() => setActiveView("create")}
//         >
//           <PlusCircle size={18} className="me-2" /> Create Billing
//         </Button>
//         <Button
//           variant={activeView === "history" ? "primary" : "outline-secondary"}
//           onClick={() => setActiveView("history")}
//         >
//           <History size={18} className="me-2" /> Billing History
//         </Button>
//       </div>

//       {/* Conditional Rendering based on activeView */}
//       {activeView === "create" && renderCreateView()}
//       {activeView === "history" && renderHistoryView()}
//     </Container>
//   );
// };

// export default FacilityBillingPage;

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  InputGroup,
  Alert,
} from "react-bootstrap";
import {
  Search,
  Receipt,
  Users,
  PlusCircle,
  History,
  Building2,
  CreditCard,
  CalendarDays,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

// ======================== TYPES (unchanged) ========================
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface Department {
  id: string;
  name: string;
}

interface FacilityItem {
  id: string;
  department_id: string;
  facility_id?: string;
  item_name: string;
  item_price: number;
  bill_number?: string;
  isPaid?: boolean;
  payment_method?: string;
}

interface BilledItem {
  id: string;
  created_at: string;
  bill_number?: string;
  isPaid?: boolean;
  payment_method?: string;
  amount?: number;
  facility_items_master: {
    item_name: string;
    item_price: number;
  };
}

interface PatientWithTotal extends Patient {
  item_name: string;
  total_billed: number;
  bill_number?: string;
  isPaid?: boolean;
  payment_method?: string;
}

// ======================== COMPONENT ========================
const FacilityBillingPage = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // Core state (exactly as before)
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientBills, setPatientBills] = useState<BilledItem[]>([]);
  const [patientsWithTotal, setPatientsWithTotal] = useState<PatientWithTotal[]>([]);

  // Form selections
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [amount, setAmount] = useState("");

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);
  const [creatingBill, setCreatingBill] = useState(false);
  const [loadingTotals, setLoadingTotals] = useState(false);
  const [activeView, setActiveView] = useState<"history" | "create">("create");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [creatingItem, setCreatingItem] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
const [userRole, setUserRole] = useState<string | null>(null);
  // 1. Get facility ID from admin_user_id
  // useEffect(() => {
  //   const getFacility = async () => {
  //     if (!user) return;
  //     const { data, error } = await supabase
  //       .from("facilities")
  //       .select("id")
  //       .eq("admin_user_id", user.id)
  //       .single();

  //     if (error) {
  //       toast({
  //         title: "Error",
  //         description: "Facility not found for this admin.",
  //         variant: "destructive",
  //       });
  //     } else if (data) {
  //       setFacilityId(data.id);
  //     }
  //   };
  //   getFacility();
  // }, [user, toast]);
  useEffect(() => {
  const getUserAndFacility = async () => {
    if (!user) return;

    // 1. Get user role from profiles
    const { data: profile, error: roleError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();
if (profile) setUserRole(profile.role); 
    if (roleError || !profile) {
      toast({
        title: "Error",
        description: "Unable to fetch user role.",
        variant: "destructive",
      });
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
        toast({
          title: "Error",
          description: "Facility not found for this admin.",
          variant: "destructive",
        });
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
        toast({
          title: "Error",
          description: "No active facility found for this staff member.",
          variant: "destructive",
        });
        return;
      }
      facilityData = { id: data.facility_id };
    }
    else {
      toast({
        title: "Access Denied",
        description: "Only hospital admins and staff can access billing.",
        variant: "destructive",
      });
      return;
    }

    if (facilityData) {
      setFacilityId(facilityData.id);
    }
  };

  getUserAndFacility();
}, [user, toast]);

  // 2. Fetch departments once facilityId is known
  useEffect(() => {
    if (facilityId) {
      fetchDepartments();
      fetchPatients();
    }
  }, [facilityId]);

  // 3. When patients list changes, fetch their total billed amounts
  // useEffect(() => {
  //   if (patients.length > 0 && facilityId) {
  //     fetchPatientsTotalBilled();
  //   }
  // }, [patients, facilityId]);
useEffect(() => {
  if (facilityId && patients.length > 0 && userRole) {
    fetchPatientsTotalBilled();
  }
}, [facilityId, patients, userRole, user]);

  const fetchDepartments = async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("id, name")
      .eq("facility_id", facilityId)
      .eq("is_active", true);

    if (error) {
      toast({ title: "Error", description: "Failed to load departments", variant: "destructive" });
    } else {
      setDepartments(data || []);
    }
  };

  const fetchPatients = async () => {
    setLoadingPatients(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, phone_number")
      .eq("role", "patient")
      .order("first_name");

    if (error) {
      toast({ title: "Error", description: "Failed to load patients", variant: "destructive" });
    } else {
      setPatients(data || []);
    }
    setLoadingPatients(false);
  };

  // const fetchPatientsTotalBilled = async () => {
  //   if (!facilityId) return;
  //   setLoadingTotals(true);
  //   try {
  //     const { data: bills, error } = await supabase
  //       .from("facility_billed_items")
  //       .select("*")
  //       .eq("facility_id", facilityId)
  //       .order("created_at", { ascending: false });

  //     if (error) throw error;

  //     const itemIds = bills.map(b => b.item_id);
  //     const { data: items } = await supabase
  //       .from("facility_items_master")
  //       .select("id, item_name, item_price")
  //       .in("id", itemIds);

  //     const merged = bills.map(bill => {
  //       const item = items?.find(i => i.id === bill.item_id);
  //       const patient = patients.find(p => p.id === bill.patient_id);
  //       return {
  //         ...patient,
  //         id: bill.id,
  //         item_name: item?.item_name || "",
  //         total_billed: item?.item_price || 0,
  //         bill_number: bill.bill_number || "",
  //         isPaid: bill.ispaid || false,
  //         payment_method: bill.payment_method || "",
  //       };
  //     });
  //     setPatientsWithTotal(merged);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoadingTotals(false);
  //   }
  // };
const fetchPatientsTotalBilled = async () => {
  if (!facilityId) return;
  setLoadingTotals(true);
  try {
    let query = supabase
      .from("facility_billed_items")
      .select("*")
      .eq("facility_id", facilityId)
      .order("created_at", { ascending: false });

    // ✅ Ensure userId is a string, not an object
    const staffUserId = user?.id; // user.id from Supabase auth is a string
    if (userRole === "hospital_staff" && staffUserId) {
      query = query.eq("added_by", staffUserId);
    }

    const { data: bills, error } = await query;

    if (error) throw error;

    const itemIds = bills.map(b => b.item_id);
    const { data: items } = await supabase
      .from("facility_items_master")
      .select("id, item_name, item_price")
      .in("id", itemIds);

    const merged = bills.map(bill => {
      const item = items?.find(i => i.id === bill.item_id);
      const patient = patients.find(p => p.id === bill.patient_id);
      return {
        ...patient,
        id: bill.id,
        item_name: item?.item_name || "",
        total_billed: item?.item_price || 0,
        bill_number: bill.bill_number || "",
        isPaid: bill.ispaid || false,
        payment_method: bill.payment_method || "",
      };
    });
    setPatientsWithTotal(merged);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingTotals(false);
  }
};

  const fetchFacilityItems = async (deptId: string) => {
    if (!facilityId) return;
    const { data, error } = await supabase
      .from("facility_items_master")
      .select("id, department_id, item_name, item_price")
      .eq("facility_id", facilityId)
      .eq("department_id", deptId)
      .eq("active", true);

    if (error) {
      toast({ title: "Error", description: "Failed to load items", variant: "destructive" });
      setFacilityItems([]);
    } else {
      setFacilityItems(data || []);
    }
  };

  // const fetchPatientBills = async (patientId: string) => {
  //   if (!facilityId) return;
  //   setLoadingBills(true);
  //   const { data: bills, error } = await supabase
  //     .from("facility_billed_items")
  //     .select("*")
  //     .eq("patient_id", patientId)
  //     .eq("facility_id", facilityId)
  //     .order("created_at", { ascending: false });

  //   if (error) {
  //     toast({ title: "Error", description: "Failed to load billing history", variant: "destructive" });
  //     setPatientBills([]);
  //     setLoadingBills(false);
  //     return;
  //   }

  //   const itemIds = bills.map(b => b.item_id);
  //   const { data: items } = await supabase
  //     .from("facility_items_master")
  //     .select("id, item_name, item_price")
  //     .in("id", itemIds);

  //   const merged = bills.map(bill => ({
  //     ...bill,
  //     facility_items_master: items?.find(i => i.id === bill.item_id)
  //   }));
  //   setPatientBills(merged || []);
  //   setLoadingBills(false);
  // };
const fetchPatientBills = async (patientId: string) => {
  if (!facilityId) return;
  setLoadingBills(true);
  
    let query = supabase
    .from("facility_billed_items")
    .select("*")
    .eq("patient_id", patientId)
    .eq("facility_id", facilityId)
    .order("created_at", { ascending: false });

  // ✅ Same fix: use user.id directly
  const staffUserId = user?.id;
  if (userRole === "hospital_staff" && staffUserId) {
    query = query.eq("added_by", staffUserId);
  }

  const { data: bills, error } = await query;

  if (error) {
    toast({ title: "Error", description: "Failed to load billing history", variant: "destructive" });
    setPatientBills([]);
    setLoadingBills(false);
    return;
  }

  const itemIds = bills.map(b => b.item_id);
  const { data: items } = await supabase
    .from("facility_items_master")
    .select("id, item_name, item_price")
    .in("id", itemIds);

  const merged = bills.map(bill => ({
    ...bill,
    facility_items_master: items?.find(i => i.id === bill.item_id)
  }));
  setPatientBills(merged || []);
  setLoadingBills(false);
};
  const handleItemChange = (e) => {
    const itemId = e.target.value;
    setSelectedItem(itemId);
    const selected = facilityItems.find(item => item.id === itemId);
    setAmount(selected ? String(selected.item_price) : "");
  };

  const handleCreateItem = async () => {
    if (!facilityId) return;
    if (!selectedDepartment) {
      toast({ title: "Error", description: "Select Department", variant: "destructive" });
      return;
    }
    if (!itemName || !itemPrice) {
      toast({ title: "Error", description: "Enter Item Name & Price", variant: "destructive" });
      return;
    }
    setCreatingItem(true);
    const { error } = await supabase
      .from("facility_items_master")
      .insert([{
        facility_id: facilityId,
        department_id: selectedDepartment,
        item_name: itemName,
        item_price: itemPrice,
        active: true,
      }]);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Billing item created" });
      setItemName("");
      setItemPrice("");
      fetchFacilityItems(selectedDepartment);
    }
    setCreatingItem(false);
  };

  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setSelectedItem("");
    if (deptId) {
      fetchFacilityItems(deptId);
    } else {
      setFacilityItems([]);
    }
  };

 const handleCreateBill = async () => {
  if (!selectedPatient) {
    toast({ title: "Error", description: "Please select a patient first.", variant: "destructive" });
    return;
  }
  if (!selectedItem) {
    toast({ title: "Error", description: "Please select an item.", variant: "destructive" });
    return;
  }
  if (!facilityId) {
    toast({ title: "Error", description: "Facility not identified.", variant: "destructive" });
    return;
  }

  setCreatingBill(true);
  const { error } = await supabase.from("facility_billed_items").insert([{
    facility_id: facilityId,
    patient_id: selectedPatient.id,
    item_id: selectedItem,
    added_by: user?.id,
    bill_number: billNumber,
    ispaid: isPaid,
    payment_method: paymentMethod||"offline",
    created_at: new Date().toISOString(),
  }]);

  if (error) {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  } else {
    toast({ title: "Success", description: "Billing created successfully." });

    // Refresh data for the selected patient
    await fetchPatientBills(selectedPatient.id);
    await fetchPatientsTotalBilled();

    // Reset entire form
    setSelectedDepartment("");
    setSelectedItem("");
    setFacilityItems([]);
    setBillNumber("");
    setIsPaid(false);
    setPaymentMethod("");
    setAmount("");
    setSearchTerm("");          // clear patient search
    setSelectedPatient(null);   // deselect patient (optional – you can keep selected if preferred)
  }
  setCreatingBill(false);
};

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm("");
    setSelectedDepartment("");
    setSelectedItem("");
    setFacilityItems([]);
    fetchPatientBills(patient.id);
  };

  const filteredPatients = patients.filter((p) =>
    `${p.first_name} ${p.last_name} ${p.email} ${p.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const totalAmount = patientBills.reduce(
    (sum, bill) => sum + (bill.facility_items_master?.item_price || 0),
    0
  );

  // ======================== RENDER VIEWS (Redesigned) ========================

  const renderHistoryView = () => (
    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
      <Card.Header className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 d-flex align-items-center gap-2">
        <Users size={20} /> Patient Billing History
      </Card.Header>
      <Card.Body className="p-0">
        {loadingTotals ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : patientsWithTotal.length === 0 ? (
          <Alert variant="info" className="m-3">No billing records found.</Alert>
        ) : (
          <div className="table-responsive">
            <Table className="table-hover align-middle mb-0" style={{ minWidth: "600px" }}>
              <thead className="bg-light">
                <tr>
                  <th className="ps-3">Bill Number</th>
                  <th>Item Name</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th className="pe-3">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                {patientsWithTotal.map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                    <td className="ps-3 fw-semibold">{p.bill_number || "—"}</td>
                    <td>{p.item_name || "—"}</td>
                    <td>₹{p.total_billed.toFixed(2)}</td>
                    <td>
                      {p.isPaid ? (
                        <span className="badge bg-success px-3 py-2 rounded-pill">Paid</span>
                      ) : (
                        <span className="badge bg-danger px-3 py-2 rounded-pill">Unpaid</span>
                      )}
                    </td>
                    <td className="pe-3">{p.payment_method || ""}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  const renderCreateView = () => (
    <Row className="g-4">
      <Col lg={7}>
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Header className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-3 d-flex align-items-center gap-2">
            <PlusCircle size={20} /> Create New Billing
          </Card.Header>
          <Card.Body>
            {/* Patient Search */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">Search Patient</Form.Label>
              <InputGroup>
                <InputGroup.Text className="bg-light"><Search size={18} /></InputGroup.Text>
                <Form.Control
                  placeholder="Type name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              {searchTerm && (
                <div className="border rounded-3 p-2 mt-2 shadow-sm" style={{ maxHeight: "250px", overflowY: "auto" }}>
                  {loadingPatients ? (
                    <div className="text-center"><Spinner size="sm" /></div>
                  ) : filteredPatients.length === 0 ? (
                    <Alert variant="info" className="m-0">No patients found.</Alert>
                  ) : (
                    filteredPatients.map((p) => (
                      <div key={p.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                        <div>
                          <strong> {p.email} </strong><br />
                          {/* <strong>{p.first_name} {p.last_name} {p.email} {p.phone_number}</strong><br /> */}
                          <small className="text-muted">{p.email} | {p.phone_number}</small>
                        </div>
                        <Button size="sm" variant="outline-primary" onClick={() => handleSelectPatient(p)}>
                          Select
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              )}
              {selectedPatient && (
                <Alert variant="success" className="mt-3">
                  <strong>Selected Patient:</strong> ({selectedPatient.email})
                  {/* <strong>Selected Patient:</strong> {selectedPatient.first_name} {selectedPatient.last_name} ({selectedPatient.email}) */}
                </Alert>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Bill Number (optional)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Leave blank for auto-generation"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Department</Form.Label>
              <Form.Select
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                disabled={!selectedPatient}
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Item / Service</Form.Label>
              <Form.Select
                value={selectedItem}
                onChange={handleItemChange}
                disabled={!selectedDepartment}
              >
                <option value="">Select Item</option>
                {facilityItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name} - ₹{item.item_price}
                  </option>
                ))}
              </Form.Select>
              {selectedDepartment && facilityItems.length === 0 && !loadingPatients && (
                <Alert variant="warning" className="mt-2">No active items for this department.</Alert>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Amount</Form.Label>
              <Form.Control type="text" value={amount ? `₹ ${amount}` : ""} readOnly className="bg-light" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Payment Status</Form.Label>
              <Form.Select
                value={isPaid ? "paid" : "unpaid"}
                onChange={(e) => setIsPaid(e.target.value === "paid")}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </Form.Select>
            </Form.Group>

            {isPaid && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Payment Method</Form.Label>
                <Form.Select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="">Select Payment Method</option>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="upi">UPI</option>
                </Form.Select>
              </Form.Group>
            )}

            <Button
              onClick={handleCreateBill}
              className="w-100 py-2 fw-bold rounded-pill"
              variant="primary"
              size="lg"
            >
              {creatingBill ? <><Spinner size="sm" className="me-2" /> Saving...</> : <> Save Billing</>}
            </Button>
          </Card.Body>
        </Card>
      </Col>

      <Col lg={5}>
        <Card className="shadow-lg border-0 rounded-4 h-100">
          <Card.Header className="bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 d-flex align-items-center gap-2">
            <Receipt size={20} /> Billing Items for Department
          </Card.Header>
          <Card.Body>
            {!selectedDepartment ? (
              <div className="text-center text-muted py-5">
                <Building2 size={48} className="mb-3 opacity-25" />
                <p>Select a department to see available items.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="table-sm">
                  <thead>
                    <tr className="border-0">
                      <th>Item</th>
                      <th className="text-end">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilityItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.item_name}</td>
                        <td className="text-end fw-bold text-primary">₹{item.item_price.toFixed(2)}</td>
                      </tr>
                    ))}
                    {facilityItems.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center text-muted">No items yet.</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  // ======================== MAIN RENDER ========================
  return (
    <Container fluid className="py-4 px-3 px-md-4">
      {/* Facility Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-4 p-4 mb-5 text-white shadow-lg">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-3">
              <Building2 size={40} />
            </div>
            <div>
              <h2 className="mb-0 fw-bold">Facility Billing Dashboard</h2>
              <p className="mb-0 opacity-75">Manage patient bills, track payments, and generate invoices</p>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant={activeView === "create" ? "light" : "outline-light"}
              onClick={() => setActiveView("create")}
              className=" rounded-pill px-4"
            >
              <PlusCircle size={18} className="me-2" /> New Bill
            </Button>
            <Button
              variant={activeView === "history" ? "light" : "outline-light"}
              onClick={() => setActiveView("history")}
              className="rounded-pill px-4"
            >
              <History size={18} className="me-2" /> History
            </Button>
          </div>
        </div>
      </div>

      {/* Dynamic Views */}
      {activeView === "create" && renderCreateView()}
      {activeView === "history" && renderHistoryView()}
    </Container>
  );
};

export default FacilityBillingPage;