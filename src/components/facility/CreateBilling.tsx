// // // // CreateBilling.tsx
// // // import React, { useEffect, useState } from "react";
// // // import {
// // //   Container,
// // //   Row,
// // //   Col,
// // //   Card,
// // //   Form,
// // //   Button,
// // //   Table,
// // //   Spinner,
// // //   Alert,
// // //   Badge,
// // // } from "react-bootstrap";
// // // import { PlusCircle, DollarSign, Building, Layers, Save, Tag } from "lucide-react";

// // // import { supabase } from "@/integrations/supabase/client";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useUser } from "@/hooks/useUser";

// // // // ======================== TYPES ========================
// // // interface Facility {
// // //   id: string;
// // //   facility_name: string;
// // //   address: string | null;
// // // }

// // // interface Department {
// // //   id: string;
// // //   name: string;
// // //   is_active: boolean;
// // // }

// // // interface FacilityItem {
// // //   id: string;
// // //   department_id: string;
// // //   item_name: string;
// // //   item_price: number;
// // //   active: boolean;
// // // }

// // // // ======================== COMPONENT ========================
// // // const CreateBilling: React.FC = () => {
// // //   const { user } = useUser();
// // //   const { toast } = useToast();

// // //   // State
// // //   const [facility, setFacility] = useState<Facility | null>(null);
// // //   const [departments, setDepartments] = useState<Department[]>([]);
// // //   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
// // //   const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");
// // //   const [itemName, setItemName] = useState("");
// // //   const [itemPrice, setItemPrice] = useState("");
// // //   const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
// // //   const [loading, setLoading] = useState({
// // //     facility: false,
// // //     departments: false,
// // //     items: false,
// // //     create: false,
// // //   });

// // //   // 1. Fetch facility based on admin_user_id
// // //   useEffect(() => {
// // //     const fetchFacility = async () => {
// // //       if (!user) return;
// // //       setLoading((prev) => ({ ...prev, facility: true }));
// // //       const { data, error } = await supabase
// // //         .from("facilities")
// // //         .select("id, facility_name, address")
// // //         .eq("admin_user_id", user.id)
// // //         .single();

// // //       if (error) {
// // //         toast({
// // //           title: "Error",
// // //           description: "Facility not found for this admin.",
// // //           variant: "destructive",
// // //         });
// // //       } else if (data) {
// // //         setFacility(data);
// // //         fetchDepartments(data.id);
// // //       }
// // //       setLoading((prev) => ({ ...prev, facility: false }));
// // //     };

// // //     fetchFacility();
// // //   }, [user, toast]);

// // //   // 2. Fetch departments for the facility
// // //   const fetchDepartments = async (facilityId: string) => {
// // //     setLoading((prev) => ({ ...prev, departments: true }));
// // //     const { data, error } = await supabase
// // //       .from("departments")
// // //       .select("id, name, is_active")
// // //       .eq("facility_id", facilityId)
// // //       .eq("is_active", true)
// // //       .order("name");

// // //     if (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Failed to load departments.",
// // //         variant: "destructive",
// // //       });
// // //     } else {
// // //       setDepartments(data || []);
// // //     }
// // //     setLoading((prev) => ({ ...prev, departments: false }));
// // //   };

// // //   // 3. Fetch existing items for selected department
// // //   const fetchDepartmentItems = async (deptId: string) => {
// // //     if (!facility) return;
// // //     setLoading((prev) => ({ ...prev, items: true }));
// // //     const { data, error } = await supabase
// // //       .from("facility_items_master")
// // //       .select("id, department_id, item_name, item_price, active")
// // //       .eq("facility_id", facility.id)
// // //       .eq("department_id", deptId)
// // //       .eq("active", true);

// // //     if (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Failed to load items.",
// // //         variant: "destructive",
// // //       });
// // //       setFacilityItems([]);
// // //     } else {
// // //       setFacilityItems(data || []);
// // //     }
// // //     setLoading((prev) => ({ ...prev, items: false }));
// // //   };

// // //   // Handle department change
// // //   const handleDepartmentChange = (deptId: string) => {
// // //     setSelectedDepartment(deptId);
// // //     setItemName("");
// // //     setItemPrice("");
// // //     // Find department name
// // //     const dept = departments.find(d => d.id === deptId);
// // //     setSelectedDepartmentName(dept?.name || "");
// // //     if (deptId) {
// // //       fetchDepartmentItems(deptId);
// // //     } else {
// // //       setFacilityItems([]);
// // //       setSelectedDepartmentName("");
// // //     }
// // //   };

// // //   // 4. Create new billing item
// // //   const handleCreateItem = async () => {
// // //     if (!facility) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Facility not identified.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }
// // //     if (!selectedDepartment) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Please select a department.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }
// // //     if (!itemName.trim()) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Item name is required.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }
// // //     const price = parseFloat(itemPrice);
// // //     if (isNaN(price) || price <= 0) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Please enter a valid price greater than 0.",
// // //         variant: "destructive",
// // //       });
// // //       return;
// // //     }

// // //     setLoading((prev) => ({ ...prev, create: true }));
// // //     const { error } = await supabase.from("facility_items_master").insert([
// // //       {
// // //         facility_id: facility.id,
// // //         department_id: selectedDepartment,
// // //         item_name: itemName.trim(),
// // //         item_price: price,
// // //         active: true,
// // //         created_at: new Date().toISOString(),
// // //         updated_at: new Date().toISOString(),
// // //       },
// // //     ]);

// // //     if (error) {
// // //       toast({
// // //         title: "Creation Failed",
// // //         description: error.message,
// // //         variant: "destructive",
// // //       });
// // //     } else {
// // //       toast({
// // //         title: "Success",
// // //         description: `"${itemName}" has been added.`,
// // //       });
// // //       setItemName("");
// // //       setItemPrice("");
// // //       fetchDepartmentItems(selectedDepartment);
// // //     }
// // //     setLoading((prev) => ({ ...prev, create: false }));
// // //   };

// // //   return (
// // //     <Container fluid className="py-4">
// // //       {/* Facility Header Card */}
// // //       {loading.facility ? (
// // //         <div className="text-center py-3">
// // //           <Spinner animation="border" />
// // //         </div>
// // //       ) : facility ? (
// // //         <Card className="shadow-sm mb-4 border-0 bg-light">
// // //           <Card.Body className="d-flex align-items-center gap-3">
// // //             <Building size={32} className="text-primary" />
// // //             <div>
// // //               <h4 className="mb-0">{facility.facility_name}</h4>
// // //               {facility.address && <small className="text-muted">{facility.address}</small>}
// // //             </div>
// // //           </Card.Body>
// // //         </Card>
// // //       ) : (
// // //         <Alert variant="danger">No facility associated with your account.</Alert>
// // //       )}

// // //       <h3 className="mb-4 d-flex align-items-center gap-2">
// // //         <DollarSign size={28} className="text-primary" />
// // //         Department Billing Price Management
// // //       </h3>

// // //       <Row>
// // //         {/* Left Column: Create New Item */}
// // //         <Col lg={5}>
// // //           <Card className="shadow-sm border-0 h-100">
// // //             <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
// // //               <PlusCircle size={18} /> Create New Billing Item
// // //             </Card.Header>
// // //             <Card.Body>
// // //               {/* Department Selector */}
// // //               <Form.Group className="mb-3">
// // //                 <Form.Label>
// // //                   <Layers size={16} className="me-1" /> Department
// // //                 </Form.Label>
// // //                 <Form.Select
// // //                   value={selectedDepartment}
// // //                   onChange={(e) => handleDepartmentChange(e.target.value)}
// // //                   disabled={loading.departments || departments.length === 0}
// // //                 >
// // //                   <option value="">-- Select Department --</option>
// // //                   {departments.map((dept) => (
// // //                     <option key={dept.id} value={dept.id}>
// // //                       {dept.name}
// // //                     </option>
// // //                   ))}
// // //                 </Form.Select>
// // //                 {departments.length === 0 && !loading.departments && (
// // //                   <Alert variant="warning" className="mt-2">
// // //                     No active departments found for this facility.
// // //                   </Alert>
// // //                 )}
// // //               </Form.Group>

// // //               {/* Item Name */}
// // //               <Form.Group className="mb-3">
// // //                 <Form.Label>Item / Service Name</Form.Label>
// // //                 <Form.Control
// // //                   type="text"
// // //                   placeholder="e.g., Consultation Fee, X-Ray, Blood Test"
// // //                   value={itemName}
// // //                   onChange={(e) => setItemName(e.target.value)}
// // //                   disabled={!selectedDepartment}
// // //                 />
// // //               </Form.Group>

// // //               {/* Item Price */}
// // //               <Form.Group className="mb-4">
// // //                 <Form.Label>Price (₹)</Form.Label>
// // //                 <Form.Control
// // //                   type="number"
// // //                   placeholder="Enter amount"
// // //                   value={itemPrice}
// // //                   onChange={(e) => setItemPrice(e.target.value)}
// // //                   disabled={!selectedDepartment}
// // //                 />
// // //               </Form.Group>

// // //               {/* Submit Button */}
// // //               <Button
// // //                 variant="success"
// // //                 className="w-100"
// // //                 onClick={handleCreateItem}
// // //                 disabled={
// // //                   !selectedDepartment ||
// // //                   !itemName.trim() ||
// // //                   !itemPrice ||
// // //                   loading.create
// // //                 }
// // //               >
// // //                 {loading.create ? (
// // //                   <>
// // //                     <Spinner size="sm" className="me-2" /> Creating...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <Save size={18} className="me-2" /> Save Billing Item
// // //                   </>
// // //                 )}
// // //               </Button>
// // //             </Card.Body>
// // //           </Card>
// // //         </Col>

// // //         {/* Right Column: Existing Items List */}
// // //         <Col lg={7}>
// // //           <Card className="shadow-sm border-0">
// // //             <Card.Header className="bg-info text-white d-flex align-items-center gap-2">
// // //               <DollarSign size={18} /> Department Billing List
// // //               {selectedDepartmentName && (
// // //                 <Badge bg="light" text="dark" className="ms-2">
// // //                   <Tag size={14} className="me-1" />
// // //                   {selectedDepartmentName}
// // //                 </Badge>
// // //               )}
// // //             </Card.Header>
// // //             <Card.Body>
// // //               {!selectedDepartment ? (
// // //                 <Alert variant="secondary">
// // //                   Please select a department from the left to view its billing items.
// // //                 </Alert>
// // //               ) : loading.items ? (
// // //                 <div className="text-center py-4">
// // //                   <Spinner animation="border" />
// // //                 </div>
// // //               ) : facilityItems.length === 0 ? (
// // //                 <Alert variant="light">
// // //                   No items found for <strong>{selectedDepartmentName}</strong>. 
// // //                   Create your first billing item using the form.
// // //                 </Alert>
// // //               ) : (
// // //                 <div className="table-responsive">
// // //                   <Table striped hover>
// // //                     <thead>
// // //                       <tr>
// // //                         <th>Item Name</th>
// // //                         <th className="text-end">Price (₹)</th>
// // //                       </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                       {facilityItems.map((item) => (
// // //                         <tr key={item.id}>
// // //                           <td>{item.item_name}</td>
// // //                           <td className="text-end fw-bold">
// // //                             ₹{item.item_price.toFixed(2)}
// // //                           </td>
// // //                         </tr>
// // //                       ))}
// // //                     </tbody>
// // //                   </Table>
// // //                 </div>
// // //               )}
// // //             </Card.Body>
// // //           </Card>
// // //         </Col>
// // //       </Row>
// // //     </Container>
// // //   );
// // // };

// // // export default CreateBilling;

// // // CreateBilling.tsx

// // import React, { useEffect, useState } from "react";
// // import {
// //   Container,
// //   Row,
// //   Col,
// //   Card,
// //   Form,
// //   Button,
// //   Table,
// //   Spinner,
// //   Alert,
// //   Badge,
// // } from "react-bootstrap";
// // import { PlusCircle, DollarSign, Building, Layers, Save, Tag, CreditCard, ListChecks, Edit, Trash2 } from "lucide-react";

// // import { supabase } from "@/integrations/supabase/client";
// // import { useToast } from "@/hooks/use-toast";
// // import { useUser } from "@/hooks/useUser";

// // // ======================== TYPES (unchanged) ========================
// // interface Facility {
// //   id: string;
// //   facility_name: string;
// //   address: string | null;
// // }

// // interface Department {
// //   id: string;
// //   name: string;
// //   is_active: boolean;
// // }

// // interface FacilityItem {
// //   id: string;
// //   department_id: string;
// //   item_name: string;
// //   item_price: number;
// //   active: boolean;
// // }

// // // ======================== COMPONENT ========================
// // const CreateBilling: React.FC = () => {
// //   const { user } = useUser();
// //   const { toast } = useToast();

// //   // State (exactly as before)
// //   const [facility, setFacility] = useState<Facility | null>(null);
// //   const [departments, setDepartments] = useState<Department[]>([]);
// //   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
// //   const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");
// //   const [itemName, setItemName] = useState("");
// //   const [itemPrice, setItemPrice] = useState("");
// //   const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
// //   const [loading, setLoading] = useState({
// //     facility: false,
// //     departments: false,
// //     items: false,
// //     create: false,
// //   });
// // const [searchTerm, setSearchTerm] = useState("");
// // const [isEditMode, setIsEditMode] = useState(false);
// // const [editingId, setEditingId] = useState<string | null>(null);
// //   // 1. Fetch facility based on admin_user_id (unchanged)
// //   useEffect(() => {
// //     const fetchFacility = async () => {
// //       if (!user) return;
// //       setLoading((prev) => ({ ...prev, facility: true }));
// //       const { data, error } = await supabase
// //         .from("facilities")
// //         .select("id, facility_name, address")
// //         .eq("admin_user_id", user.id)
// //         .single();

// //       if (error) {
// //         toast({
// //           title: "Error",
// //           description: "Facility not found for this admin.",
// //           variant: "destructive",
// //         });
// //       } else if (data) {
// //         setFacility(data);
// //         fetchDepartments(data.id);
// //       }
// //       setLoading((prev) => ({ ...prev, facility: false }));
// //     };

// //     fetchFacility();
// //   }, [user, toast]);

// //   // 2. Fetch departments for the facility (unchanged)
// //   const fetchDepartments = async (facilityId: string) => {
// //     setLoading((prev) => ({ ...prev, departments: true }));
// //     const { data, error } = await supabase
// //       .from("departments")
// //       .select("id, name, is_active")
// //       .eq("facility_id", facilityId)
// //       .eq("is_active", true)
// //       .order("name");

// //     if (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to load departments.",
// //         variant: "destructive",
// //       });
// //     } else {
// //       setDepartments(data || []);
// //     }
// //     setLoading((prev) => ({ ...prev, departments: false }));
// //   };

// //   // 3. Fetch existing items for selected department (unchanged)
// //   const fetchDepartmentItems = async (deptId: string) => {
// //     if (!facility) return;
// //     setLoading((prev) => ({ ...prev, items: true }));
// //     const { data, error } = await supabase
// //       .from("facility_items_master")
// //       .select("id, department_id, item_name, item_price, active")
// //       .eq("facility_id", facility.id)
// //       .eq("department_id", deptId)
// //       .eq("active", true);

// //     if (error) {
// //       toast({
// //         title: "Error",
// //         description: "Failed to load items.",
// //         variant: "destructive",
// //       });
// //       setFacilityItems([]);
// //     } else {
// //       setFacilityItems(data || []);
// //     }
// //     setLoading((prev) => ({ ...prev, items: false }));
// //   };

// //   // Handle department change (unchanged)
// //   const handleDepartmentChange = (deptId: string) => {
// //     setSelectedDepartment(deptId);
// //     setItemName("");
// //     setItemPrice("");
// //     const dept = departments.find(d => d.id === deptId);
// //     setSelectedDepartmentName(dept?.name || "");
// //     if (deptId) {
// //       fetchDepartmentItems(deptId);
// //     } else {
// //       setFacilityItems([]);
// //       setSelectedDepartmentName("");
// //     }
// //   };

// //   // 4. Create new billing item (unchanged)
// //   const handleCreateItem = async () => {
// //     if (!facility) {
// //       toast({
// //         title: "Error",
// //         description: "Facility not identified.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
// //     if (!selectedDepartment) {
// //       toast({
// //         title: "Error",
// //         description: "Please select a department.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
// //     if (!itemName.trim()) {
// //       toast({
// //         title: "Error",
// //         description: "Item name is required.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }
// //     const price = parseFloat(itemPrice);
// //     if (isNaN(price) || price <= 0) {
// //       toast({
// //         title: "Error",
// //         description: "Please enter a valid price greater than 0.",
// //         variant: "destructive",
// //       });
// //       return;
// //     }

// //     setLoading((prev) => ({ ...prev, create: true }));
// //     const { error } = await supabase.from("facility_items_master").insert([
// //       {
// //         facility_id: facility.id,
// //         department_id: selectedDepartment,
// //         item_name: itemName.trim(),
// //         item_price: price,
// //         active: true,
// //         created_at: new Date().toISOString(),
// //         updated_at: new Date().toISOString(),
// //       },
// //     ]);

// //     if (error) {
// //       toast({
// //         title: "Creation Failed",
// //         description: error.message,
// //         variant: "destructive",
// //       });
// //     } else {
// //       toast({
// //         title: "Success",
// //         description: `"${itemName}" has been added.`,
// //       });
// //       setItemName("");
// //       setItemPrice("");
// //       fetchDepartmentItems(selectedDepartment);
// //     }
// //     setLoading((prev) => ({ ...prev, create: false }));
// //   };
// // const handleEdit = (item: FacilityItem) => {
// //   setItemName(item.item_name);
// //   setItemPrice(item.item_price.toString());
// //   setSelectedDepartment(item.department_id);

// //   setEditingId(item.id);
// //   setIsEditMode(true);
// // };
// // const handleSaveItem = async () => {
// //   if (!facility) return;

// //   const price = parseFloat(itemPrice);

// //   if (!itemName.trim() || isNaN(price) || price <= 0) {
// //     toast({
// //       title: "Error",
// //       description: "Enter valid item name and price",
// //       variant: "destructive",
// //     });
// //     return;
// //   }

// //   setLoading((prev) => ({ ...prev, create: true }));

// //   let error;

// //   // Edit Mode
// //   if (isEditMode && editingId) {
// //     const response = await supabase
// //       .from("facility_items_master")
// //       .update({
// //         item_name: itemName,
// //         item_price: price,
// //         department_id: selectedDepartment,
// //         updated_at: new Date().toISOString(),
// //       })
// //       .eq("id", editingId);

// //     error = response.error;

// //   } 
// //   // Create Mode
// //   else {
// //     const response = await supabase
// //       .from("facility_items_master")
// //       .insert([
// //         {
// //           facility_id: facility.id,
// //           department_id: selectedDepartment,
// //           item_name: itemName,
// //           item_price: price,
// //           active: true,
// //           created_at: new Date().toISOString(),
// //           updated_at: new Date().toISOString(),
// //         },
// //       ]);

// //     error = response.error;
// //   }

// //   if (error) {
// //     toast({
// //       title: isEditMode ? "Update Failed" : "Create Failed",
// //       description: error.message,
// //       variant: "destructive",
// //     });
// //   } else {
// //     toast({
// //       title: "Success",
// //       description: isEditMode
// //         ? "Billing item updated"
// //         : "Billing item created",
// //     });

// //     resetForm();
// //     fetchDepartmentItems(selectedDepartment);
// //   }

// //   setLoading((prev) => ({ ...prev, create: false }));
// // };

// // const resetForm = () => {
// //   setItemName("");
// //   setItemPrice("");
// //   setEditingId(null);
// //   setIsEditMode(false);
// // };

// // const handleDelete = async (id: string) => {
// //   if (!confirm("Are you sure you want to delete this item?")) return;

// //   const { error } = await supabase
// //     .from("facility_items_master")
// //     .delete()
// //     .eq("id", id);

// //   if (error) {
// //     toast({
// //       title: "Delete Failed",
// //       description: error.message,
// //       variant: "destructive",
// //     });
// //   } else {
// //     toast({
// //       title: "Deleted",
// //       description: "Billing item removed",
// //     });

// //     fetchDepartmentItems(selectedDepartment);
// //   }
// // };
// //   // ======================== MAIN RENDER (Redesigned) ========================
// //   return (
// //     <Container fluid className="py-4 px-3 px-md-4">
// //       {/* Facility Banner - Modern Gradient */}
// //       {loading.facility ? (
// //         <div className="text-center py-5">
// //           <Spinner animation="border" variant="primary" />
// //         </div>
// //       ) : facility ? (
// //         <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-4 md:p-5 mb-6 text-white shadow-lg">
// //           <div className="d-flex flex-wrap align-items-center gap-3">
// //             <div className="bg-white/20 p-3 rounded-xl">
// //               <Building size={32} />
// //             </div>
// //             <div className="flex-grow-1">
// //               <h2 className="mb-0 fw-bold">{facility.facility_name}</h2>
// //               {facility.address && (
// //                 <p className="mb-0 mt-1 opacity-90 small">
// //                   📍 {facility.address}
// //                 </p>
// //               )}
// //             </div>
// //             <div className="bg-white/20 px-3 py-2 rounded-full">
// //               <span className="small">🏥 Healthcare Facility</span>
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         <Alert variant="danger" className="rounded-xl">
// //           No facility associated with your account.
// //         </Alert>
// //       )}

// //       {/* Page Title */}
// //       <div className="d-flex align-items-center gap-2 mb-4">
// //         <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
// //           <DollarSign size={24} className="text-primary" />
// //         </div>
// //         <h3 className="mb-0 fw-semibold">Department Billing Price Management</h3>
// //       </div>

// //       <Row className="g-4">
// //         {/* Left Column: Create New Item */}
// //         <Col lg={5}>
// //           <Card className="shadow-lg border-0 rounded-4 h-100">
// //             <Card.Header className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-top-4 d-flex align-items-center gap-2">
// //               <PlusCircle size={20} /> Create New Billing Item
// //             </Card.Header>
// //             <Card.Body className="p-4">
// //               {/* Department Selector */}
// //               <Form.Group className="mb-4">
// //                 <Form.Label className="fw-semibold d-flex align-items-center gap-1">
// //                   <Layers size={16} /> Department
// //                 </Form.Label>
// //                 <Form.Select
// //                   value={selectedDepartment}
// //                   onChange={(e) => handleDepartmentChange(e.target.value)}
// //                   disabled={loading.departments || departments.length === 0}
// //                   className="py-2 rounded-lg"
// //                 >
// //                   <option value="">-- Select Department --</option>
// //                   {departments.map((dept) => (
// //                     <option key={dept.id} value={dept.id}>
// //                       {dept.name}
// //                     </option>
// //                   ))}
// //                 </Form.Select>
// //                 {departments.length === 0 && !loading.departments && (
// //                   <Alert variant="warning" className="mt-2 small">
// //                     No active departments found for this facility.
// //                   </Alert>
// //                 )}
// //               </Form.Group>

// //               {/* Item Name */}
// //               <Form.Group className="mb-4">
// //                 <Form.Label className="fw-semibold">Item / Service Name</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   placeholder="e.g., Consultation Fee, X-Ray, Blood Test"
// //                   value={itemName}
// //                   onChange={(e) => setItemName(e.target.value)}
// //                   disabled={!selectedDepartment}
// //                   className="py-2 rounded-lg"
// //                 />
// //               </Form.Group>

// //               {/* Item Price */}
// //               <Form.Group className="mb-4">
// //                 <Form.Label className="fw-semibold">Price (₹)</Form.Label>
// //                 <Form.Control
// //                   type="number"
// //                   placeholder="Enter amount"
// //                   value={itemPrice}
// //                   onChange={(e) => setItemPrice(e.target.value)}
// //                   disabled={!selectedDepartment}
// //                   className="py-2 rounded-lg"
// //                 />
// //               </Form.Group>

// //               {/* Submit Button */}
// //               {/* <Button
// //                 variant="success"
// //                 className="w-100 py-2 fw-semibold rounded-pill shadow-sm"
// //                 onClick={handleCreateItem}
// //                 disabled={
// //                   !selectedDepartment ||
// //                   !itemName.trim() ||
// //                   !itemPrice ||
// //                   loading.create
// //                 }
// //               >
// //                 {loading.create ? (
// //                   <>
// //                     <Spinner size="sm" className="me-2" /> Creating...
// //                   </>
// //                 ) : (
// //                   <>
// //                      Save Billing Item
// //                   </>
// //                 )}
// //               </Button> */}
// //               <Button
// // variant={isEditMode ? "primary" : "success"}
// // className="w-100 py-2 fw-semibold rounded-pill shadow-sm"
// // onClick={handleSaveItem}
// // disabled={
// //   !selectedDepartment ||
// //   !itemName.trim() ||
// //   !itemPrice ||
// //   loading.create
// // }
// // >
// // {loading.create ? (
// // <>
// // <Spinner size="sm" className="me-2" />
// // {isEditMode ? "Updating..." : "Creating..."}
// // </>
// // ) : (
// // <>
// // {isEditMode ? "Update Billing Item" : "Save Billing Item"}
// // </>
// // )}
// // </Button>
// //             </Card.Body>
// //           </Card>
// //         </Col>

// //         {/* Right Column: Existing Items List */}
// //         <Col lg={7}>
// //           <Card className="shadow-lg border-0 rounded-4 h-100">
// //            <Card.Header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-top-4">
// //   <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
// //     <div className="d-flex align-items-center gap-2">
// //       <ListChecks size={20} /> 
// //       <span>Department Billing Items</span>
// //       {selectedDepartmentName && (
// //         <Badge bg="light" text="dark" className="rounded-pill px-3">
// //           <Tag size={14} className="me-1" />
// //           {selectedDepartmentName}
// //         </Badge>
// //       )}
// //     </div>
// //       <div className="position-relative" style={{ width: '250px' }}>
// //         <Form.Control
// //           type="text"
// //           placeholder="🔍 Search items..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="bg-white text-dark py-1 ps-3 pe-4 rounded-pill border-0 shadow-sm"
// //           style={{ fontSize: '0.9rem' }}
// //         />
// //       </div>
// //   </div>
// // </Card.Header>
// //             <Card.Body className="p-0">
// //               {!selectedDepartment ? (
// //                 <div className="text-center text-muted py-5 px-4">
// //                   <Building size={48} className="mb-3 opacity-25" />
// //                   <p className="mb-0">Select a department from the left to view its billing items.</p>
// //                 </div>
// //               ) : loading.items ? (
// //                 <div className="text-center py-5">
// //                   <Spinner animation="border" variant="warning" />
// //                 </div>
// //               ) : facilityItems.length === 0 ? (
// //                 <div className="text-center py-5 px-4">
// //                   <CreditCard size={48} className="mb-3 opacity-25 text-muted" />
// //                   <Alert variant="light" className="d-inline-block">
// //                     No items found for <strong>{selectedDepartmentName}</strong>. 
// //                     Create your first billing item using the form.
// //                   </Alert>
// //                 </div>
// //               ) : (
// //                 <div className="table-responsive">
// //                   <Table className="table-hover align-middle mb-0">
// //                     <thead className="bg-light">
// //                       <tr>
// //                         <th className="ps-4 py-3">Item Name</th>
// //                         <th className="text-end pe-4 py-3">Price (₹)</th>
// //                       <th className="text-center pe-4 py-3">Action</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody>
// //                       {facilityItems.map((item, idx) => (
// //                         <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
// //                           <td className="ps-4 py-3 fw-medium">
// //                             <div className="d-flex align-items-center gap-2">
// //                               <div className="bg-primary bg-opacity-10 p-1 rounded">
// //                                 <DollarSign size={14} className="text-primary" />
// //                               </div>
// //                               {item.item_name}
// //                             </div>
// //                           </td>
// //                           <td className="text-end pe-4 py-3 fw-bold text-success">
// //                             ₹{item.item_price.toFixed(2)}
// //                           </td>
// //                           <td className="text-center pe-4">
// // <div className="d-flex justify-content-center gap-2">

// // <Button
// // variant="outline-primary"
// // size="sm"
// // onClick={() => handleEdit(item)}
// // >
// // <Edit size={14} />
// // </Button>

// // <Button
// // variant="outline-danger"
// // size="sm"
// // onClick={() => handleDelete(item.id)}
// // >
// // <Trash2 size={14} />
// // </Button>

// // </div>
// // </td>
// //                         </tr>
// //                       ))}
// //                     </tbody>
// //                   </Table>
// //                 </div>
// //               )}
// //             </Card.Body>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default CreateBilling;

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
//   Alert,
//   Badge,
//   Modal,
// } from "react-bootstrap";
// import {
//   PlusCircle,
//   DollarSign,
//   Building,
//   Layers,
//   Save,
//   Tag,
//   CreditCard,
//   ListChecks,
//   Edit,
//   Trash2,
// } from "lucide-react";

// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { useUser } from "@/hooks/useUser";

// // ======================== TYPES ========================
// interface Facility {
//   id: string;
//   facility_name: string;
//   address: string | null;
// }

// interface Department {
//   id: string;
//   name: string;
//   is_active: boolean;
// }

// interface FacilityItem {
//   id: string;
//   department_id: string;
//   item_name: string;
//   item_price: number;
//   active: boolean;
// }

// // ======================== COMPONENT ========================
// const CreateBilling: React.FC = () => {
//   const { user } = useUser();
//   const { toast } = useToast();

//   // State
//   const [facility, setFacility] = useState<Facility | null>(null);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [selectedDepartment, setSelectedDepartment] = useState<string>("");
//   const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");
//   const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
//   const [loading, setLoading] = useState({
//     facility: false,
//     departments: false,
//     items: false,
//     create: false,
//   });
//   const [searchTerm, setSearchTerm] = useState("");

//   // Modal state
//   const [showModal, setShowModal] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [modalItemName, setModalItemName] = useState("");
//   const [modalItemPrice, setModalItemPrice] = useState("");
//   const [modalDepartmentId, setModalDepartmentId] = useState("");

//   // 1. Fetch facility based on admin_user_id
//   useEffect(() => {
//     const fetchFacility = async () => {
//       if (!user) return;
//       setLoading((prev) => ({ ...prev, facility: true }));
//       const { data, error } = await supabase
//         .from("facilities")
//         .select("id, facility_name, address")
//         .eq("admin_user_id", user.id)
//         .single();

//       if (error) {
//         toast({
//           title: "Error",
//           description: "Facility not found for this admin.",
//           variant: "destructive",
//         });
//       } else if (data) {
//         setFacility(data);
//         await fetchDepartments(data.id);
//       }
//       setLoading((prev) => ({ ...prev, facility: false }));
//     };

//     fetchFacility();
//   }, [user, toast]);

//   // 2. Fetch departments and auto-select first active one
//   const fetchDepartments = async (facilityId: string) => {
//     setLoading((prev) => ({ ...prev, departments: true }));
//     const { data, error } = await supabase
//       .from("departments")
//       .select("id, name, is_active")
//       .eq("facility_id", facilityId)
//       .eq("is_active", true)
//       .order("name");

//     if (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load departments.",
//         variant: "destructive",
//       });
//       setDepartments([]);
//     } else {
//       setDepartments(data || []);
//       if (data && data.length > 0) {
//         // Auto-select first department
//         handleDepartmentChange(data[0].id);
//       }
//     }
//     setLoading((prev) => ({ ...prev, departments: false }));
//   };

//   // 3. Fetch items for selected department
//   const fetchDepartmentItems = async (deptId: string) => {
//     if (!facility) return;
//     setLoading((prev) => ({ ...prev, items: true }));
//     const { data, error } = await supabase
//       .from("facility_items_master")
//       .select("id, department_id, item_name, item_price, active")
//       .eq("facility_id", facility.id)
//       .eq("department_id", deptId)
//       .eq("active", true);

//     if (error) {
//       toast({
//         title: "Error",
//         description: "Failed to load items.",
//         variant: "destructive",
//       });
//       setFacilityItems([]);
//     } else {
//       setFacilityItems(data || []);
//     }
//     setLoading((prev) => ({ ...prev, items: false }));
//   };

//   // Handle department change (from dropdown above table)
//   const handleDepartmentChange = (deptId: string) => {
//     setSelectedDepartment(deptId);
//     const dept = departments.find((d) => d.id === deptId);
//     setSelectedDepartmentName(dept?.name || "");
//     if (deptId) {
//       fetchDepartmentItems(deptId);
//     } else {
//       setFacilityItems([]);
//       setSelectedDepartmentName("");
//     }
//   };

//   // Open modal for new item
//   const handleOpenCreateModal = () => {
//     setIsEditMode(false);
//     setEditingId(null);
//     setModalItemName("");
//     setModalItemPrice("");
//     // Preselect current department if any, otherwise first available
//     setModalDepartmentId(selectedDepartment || departments[0]?.id || "");
//     setShowModal(true);
//   };

//   // Open modal for editing an existing item
//   const handleOpenEditModal = (item: FacilityItem) => {
//     setIsEditMode(true);
//     setEditingId(item.id);
//     setModalItemName(item.item_name);
//     setModalItemPrice(item.item_price.toString());
//     setModalDepartmentId(item.department_id);
//     setShowModal(true);
//   };

//   // Save (create or update) from modal
//   const handleSaveItem = async () => {
//     if (!facility) {
//       toast({ title: "Error", description: "Facility not identified.", variant: "destructive" });
//       return;
//     }
//     if (!modalDepartmentId) {
//       toast({ title: "Error", description: "Please select a department.", variant: "destructive" });
//       return;
//     }
//     if (!modalItemName.trim()) {
//       toast({ title: "Error", description: "Item name is required.", variant: "destructive" });
//       return;
//     }
//     const price = parseFloat(modalItemPrice);
//     if (isNaN(price) || price <= 0) {
//       toast({ title: "Error", description: "Enter a valid price greater than 0.", variant: "destructive" });
//       return;
//     }

//     setLoading((prev) => ({ ...prev, create: true }));

//     let error;
//     if (isEditMode && editingId) {
//       // Update existing item
//       const response = await supabase
//         .from("facility_items_master")
//         .update({
//           item_name: modalItemName.trim(),
//           item_price: price,
//           department_id: modalDepartmentId,
//           updated_at: new Date().toISOString(),
//         })
//         .eq("id", editingId);
//       error = response.error;
//     } else {
//       // Create new item
//       const response = await supabase.from("facility_items_master").insert([
//         {
//           facility_id: facility.id,
//           department_id: modalDepartmentId,
//           item_name: modalItemName.trim(),
//           item_price: price,
//           active: true,
//           created_at: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         },
//       ]);
//       error = response.error;
//     }

//     if (error) {
//       toast({
//         title: isEditMode ? "Update Failed" : "Creation Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } else {
//       toast({
//         title: "Success",
//         description: isEditMode ? "Billing item updated" : "Billing item created",
//       });
//       setShowModal(false);
//       // Refresh the list for the currently selected department
//       if (selectedDepartment) {
//         fetchDepartmentItems(selectedDepartment);
//       } else if (departments.length > 0) {
//         handleDepartmentChange(departments[0].id);
//       }
//     }
//     setLoading((prev) => ({ ...prev, create: false }));
//   };

//   // Delete item
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this item?")) return;

//     const { error } = await supabase.from("facility_items_master").delete().eq("id", id);

//     if (error) {
//       toast({ title: "Delete Failed", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "Deleted", description: "Billing item removed" });
//       if (selectedDepartment) {
//         fetchDepartmentItems(selectedDepartment);
//       }
//     }
//   };

//   // Filter items by search term
//   const filteredItems = facilityItems.filter((item) =>
//     item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // ======================== RENDER ========================
//   return (
//     <Container fluid className="py-4 px-3 px-md-4">
//       {/* Facility Banner */}
//       {loading.facility ? (
//         <div className="text-center py-5">
//           <Spinner animation="border" variant="primary" />
//         </div>
//       ) : facility ? (
//         <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-4 md:p-5 mb-6 text-white shadow-lg">
//           <div className="d-flex flex-wrap align-items-center gap-3">
//             <div className="bg-white/20 p-3 rounded-xl">
//               <Building size={32} />
//             </div>
//             <div className="flex-grow-1">
//               <h2 className="mb-0 fw-bold">{facility.facility_name}</h2>
//               {facility.address && (
//                 <p className="mb-0 mt-1 opacity-90 small">📍 {facility.address}</p>
//               )}
//             </div>
//             <div className="bg-white/20 px-3 py-2 rounded-full">
//               <span className="small">🏥 Healthcare Facility</span>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <Alert variant="danger" className="rounded-xl">
//           No facility associated with your account.
//         </Alert>
//       )}

//       {/* Page Title + Create Button */}
//       <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
//         <div className="d-flex align-items-center gap-2">
//           <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
//             <DollarSign size={24} className="text-primary" />
//           </div>
//           <h3 className="mb-0 fw-semibold">Department Billing Price Management</h3>
//         </div>
//         <Button variant="success" onClick={handleOpenCreateModal} className="rounded-pill px-4 shadow-sm">
//           <PlusCircle size={18} className="me-2" /> Create Billing Item
//         </Button>
//       </div>

//       {/* Main Card: Department selector + Items table */}
//       <Card className="shadow-lg border-0 rounded-4">
//         <Card.Header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-top-4">
//           <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
//             <div className="d-flex align-items-center gap-2">
//               <ListChecks size={20} />
//               <span>Billing Items</span>
//               {selectedDepartmentName && (
//                 <Badge bg="light" text="dark" className="rounded-pill px-3">
//                   <Tag size={14} className="me-1" />
//                   {selectedDepartmentName}
//                 </Badge>
//               )}
//             </div>
//             <div className="d-flex gap-2">
//               {/* Department selector (optional, keep for filtering) */}
//               <Form.Select
//                 value={selectedDepartment}
//                 onChange={(e) => handleDepartmentChange(e.target.value)}
//                 disabled={loading.departments || departments.length === 0}
//                 className="bg-white text-dark py-1 rounded-pill"
//                 style={{ width: "200px", fontSize: "0.9rem" }}
//               >
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </Form.Select>
//               {/* Search box */}
//               <Form.Control
//                 type="text"
//                 placeholder="🔍 Search items..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="bg-white text-dark py-1 ps-3 pe-4 rounded-pill border-0 shadow-sm"
//                 style={{ width: "220px", fontSize: "0.9rem" }}
//               />
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body className="p-0">
//           {!selectedDepartment && departments.length === 0 ? (
//             <div className="text-center text-muted py-5 px-4">
//               <Building size={48} className="mb-3 opacity-25" />
//               <p className="mb-0">No departments available. Please contact your administrator.</p>
//             </div>
//           ) : loading.items ? (
//             <div className="text-center py-5">
//               <Spinner animation="border" variant="warning" />
//             </div>
//           ) : filteredItems.length === 0 ? (
//             <div className="text-center py-5 px-4">
//               <CreditCard size={48} className="mb-3 opacity-25 text-muted" />
//               <Alert variant="light" className="d-inline-block">
//                 {facilityItems.length === 0
//                   ? `No items found for ${selectedDepartmentName}. Click "Create Billing Item" to add one.`
//                   : "No matching items found."}
//               </Alert>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <Table className="table-hover align-middle mb-0">
//                 <thead className="bg-light">
//                   <tr>
//                     <th className="ps-4 py-3">Item Name</th>
//                     <th className="text-end pe-4 py-3">Price (₹)</th>
//                     <th className="text-center pe-4 py-3">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredItems.map((item, idx) => (
//                     <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
//                       <td className="ps-4 py-3 fw-medium">
//                         <div className="d-flex align-items-center gap-2">
//                           <div className="bg-primary bg-opacity-10 p-1 rounded">
//                             <DollarSign size={14} className="text-primary" />
//                           </div>
//                           {item.item_name}
//                         </div>
//                       </td>
//                       <td className="text-end pe-4 py-3 fw-bold text-success">
//                         ₹{item.item_price.toFixed(2)}
//                       </td>
//                       <td className="text-center pe-4">
//                         <div className="d-flex justify-content-center gap-2">
//                           <Button variant="outline-primary" size="sm" onClick={() => handleOpenEditModal(item)}>
//                             <Edit size={14} />
//                           </Button>
//                           <Button variant="outline-danger" size="sm" onClick={() => handleDelete(item.id)}>
//                             <Trash2 size={14} />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </Table>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Modal for Create / Edit */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>{isEditMode ? "Edit Billing Item" : "Create New Billing Item"}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold">Department</Form.Label>
//               <Form.Select
//                 value={modalDepartmentId}
//                 onChange={(e) => setModalDepartmentId(e.target.value)}
//                 disabled={departments.length === 0}
//               >
//                 <option value="">-- Select Department --</option>
//                 {departments.map((dept) => (
//                   <option key={dept.id} value={dept.id}>
//                     {dept.name}
//                   </option>
//                 ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold">Item / Service Name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="e.g., Consultation Fee, X-Ray, Blood Test"
//                 value={modalItemName}
//                 onChange={(e) => setModalItemName(e.target.value)}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label className="fw-semibold">Price (₹)</Form.Label>
//               <Form.Control
//                 type="number"
//                 placeholder="Enter amount"
//                 value={modalItemPrice}
//                 onChange={(e) => setModalItemPrice(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button
//             variant={isEditMode ? "primary" : "success"}
//             onClick={handleSaveItem}
//             disabled={loading.create}
//           >
//             {loading.create ? (
//               <>
//                 <Spinner size="sm" className="me-2" /> Saving...
//               </>
//             ) : (
//               <>{isEditMode ? "Update Item" : "Create Item"}</>
//             )}
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default CreateBilling;

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Spinner,
  Alert,
  Badge,
  Modal,
} from "react-bootstrap";
import {
  PlusCircle,
  DollarSign,
  Building,
  Tag,
  CreditCard,
  ListChecks,
  Edit,
  Trash2,
  Info,
  Calendar,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

// ======================== TYPES ========================
interface Facility {
  id: string;
  facility_name: string;
  address: string | null;
}

interface Department {
  id: string;
  name: string;
}

interface FacilityItem {
  id: string;
  department_id: string;
  item_name: string;
  item_price: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  // add any other fields from your table here
}

interface ItemWithDepartment extends FacilityItem {
  department_name: string;
}

// ======================== COMPONENT ========================
const CreateBilling: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // State
  const [facility, setFacility] = useState<Facility | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allItems, setAllItems] = useState<ItemWithDepartment[]>([]);
  const [loading, setLoading] = useState({
    facility: false,
    departments: false,
    items: false,
    create: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state for Create/Edit
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalItemName, setModalItemName] = useState("");
  const [modalItemPrice, setModalItemPrice] = useState("");
  const [modalDepartmentId, setModalDepartmentId] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [deleteId, setDeleteId] = useState<string | null>(null);
  // Modal state for Details view
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemWithDepartment | null>(null);

  // 1. Fetch facility
  useEffect(() => {
    const fetchFacility = async () => {
      if (!user) return;
      setLoading((prev) => ({ ...prev, facility: true }));
      const { data, error } = await supabase
        .from("facilities")
        .select("id, facility_name, address")
        .eq("admin_user_id", user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Facility not found for this admin.",
          variant: "destructive",
        });
      } else if (data) {
        setFacility(data);
        await fetchDepartments(data.id);
      }
      setLoading((prev) => ({ ...prev, facility: false }));
    };

    fetchFacility();
  }, [user, toast]);

  // 2. Fetch departments and then all items
  const fetchDepartments = async (facilityId: string) => {
    setLoading((prev) => ({ ...prev, departments: true }));
    const { data, error } = await supabase
      .from("departments")
      .select("id, name")
      .eq("facility_id", facilityId)
      .eq("is_active", true)
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load departments.",
        variant: "destructive",
      });
      setDepartments([]);
    } else {
      const deptData = data || [];
setDepartments(deptData);

if (facilityId) {
  await fetchAllItems(facilityId, deptData);
}
    }
    setLoading((prev) => ({ ...prev, departments: false }));
  };

  // 3. Fetch ALL items for the facility (across departments)
  const fetchAllItems = async (facilityId: string, deptList: Department[] = departments) => {
    setLoading((prev) => ({ ...prev, items: true }));
    const { data, error } = await supabase
      .from("facility_items_master")
      .select("id, department_id, item_name, item_price, active, created_at, updated_at")
      .eq("facility_id", facilityId)
      .eq("active", true);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load billing items.",
        variant: "destructive",
      });
      setAllItems([]);
    } else {
      // Join with department names
      const itemsWithDept = (data || []).map((item) => ({
        ...item,
        // department_name: departments.find((d) => d.id === item.department_id)?.name || "Unknown",
        department_name:
  deptList.find((d) => d.id === item.department_id)?.name || "Unknown",
      }));
      setAllItems(itemsWithDept);
    }
    setLoading((prev) => ({ ...prev, items: false }));
  };

  // Refresh items (call after create/update/delete)
const refreshItems = () => {
  if (facility) {
    fetchAllItems(facility.id, departments);
  }
};

  // Open create modal
  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setEditingId(null);
    setModalItemName("");
    setModalItemPrice("");
    setModalDepartmentId(departments[0]?.id || "");
    setShowFormModal(true);
  };

  // Open edit modal
  const handleOpenEditModal = (item: ItemWithDepartment) => {
    setIsEditMode(true);
    setEditingId(item.id);
    setModalItemName(item.item_name);
    setModalItemPrice(item.item_price.toString());
    setModalDepartmentId(item.department_id);
    setShowFormModal(true);
  };

  // Save (create or update)
  const handleSaveItem = async () => {
    if (!facility) {
      toast({ title: "Error", description: "Facility not identified.", variant: "destructive" });
      return;
    }
    if (!modalDepartmentId) {
      toast({ title: "Error", description: "Please select a department.", variant: "destructive" });
      return;
    }
    if (!modalItemName.trim()) {
      toast({ title: "Error", description: "Item name is required.", variant: "destructive" });
      return;
    }
    const price = parseFloat(modalItemPrice);
    if (isNaN(price) || price <= 0) {
      toast({ title: "Error", description: "Enter a valid price greater than 0.", variant: "destructive" });
      return;
    }

    setLoading((prev) => ({ ...prev, create: true }));

    let error;
    if (isEditMode && editingId) {
      const response = await supabase
        .from("facility_items_master")
        .update({
          item_name: modalItemName.trim(),
          item_price: price,
          department_id: modalDepartmentId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);
      error = response.error;
    } else {
      const response = await supabase.from("facility_items_master").insert([
        {
          facility_id: facility.id,
          department_id: modalDepartmentId,
          item_name: modalItemName.trim(),
          item_price: price,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      error = response.error;
    }

    if (error) {
      toast({
        title: isEditMode ? "Update Failed" : "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: isEditMode ? "Billing item updated" : "Billing item created",
      });
      setShowFormModal(false);
      refreshItems();
    }
    setLoading((prev) => ({ ...prev, create: false }));
  };
const handleDeleteClick = (id: string) => {
  setDeleteId(id);
  setShowDeleteModal(true);
};
  // Delete item
const confirmDelete = async () => {
  if (!deleteId) return;

  const { error } = await supabase
    .from("facility_items_master")
    .update({
      active: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", deleteId);

  if (error) {
    toast({
      title: "Delete Failed",
      description: error.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Deleted",
      description: "Billing item removed",
    });

    refreshItems();
  }

  setShowDeleteModal(false);
  setDeleteId(null);
};

  // Open details modal
  const handleViewDetails = (item: ItemWithDepartment) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
  };

  // Filter items by search term (item name or department name)
  const filteredItems = allItems.filter(
    (item) =>
      item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ======================== RENDER ========================
  return (
    <Container fluid className="py-4 px-3 px-md-4">
      {/* Facility Banner */}
      {loading.facility ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : facility ? (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-2xl p-4 md:p-5 mb-6 text-white shadow-lg">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Building size={32} />
            </div>
            <div className="flex-grow-1">
              <h2 className="mb-0 fw-bold">{facility.facility_name}</h2>
              {facility.address && (
                <p className="mb-0 mt-1 opacity-90 small">📍 {facility.address}</p>
              )}
            </div>
            <div className="bg-white/20 px-3 py-2 rounded-full">
              <span className="small">🏥 Healthcare Facility</span>
            </div>
          </div>
        </div>
      ) : (
        <Alert variant="danger" className="rounded-xl">
          No facility associated with your account.
        </Alert>
      )}

      {/* Page Title + Create Button */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
            <DollarSign size={24} className="text-primary" />
          </div>
          <h3 className="mb-0 fw-semibold">All Billing Items</h3>
          <Badge bg="secondary" className="ms-2">
            {allItems.length} items
          </Badge>
        </div>
        <Button variant="success" onClick={handleOpenCreateModal} className="rounded-pill px-4 shadow-sm">
          <PlusCircle size={18} className="me-2" /> Create Billing Item
        </Button>
      </div>

      {/* Main Card: Search + Table */}
      <Card className="shadow-lg border-0 rounded-4">
        <Card.Header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-top-4">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <ListChecks size={20} />
              <span>Item List</span>
            </div>
            <Form.Control
              type="text"
              placeholder="🔍 Search by item or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white text-dark py-1 ps-3 pe-4 rounded-pill border-0 shadow-sm"
              style={{ width: "280px", fontSize: "0.9rem" }}
            />
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {loading.items ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-5 px-4">
              <CreditCard size={48} className="mb-3 opacity-25 text-muted" />
              <Alert variant="light" className="d-inline-block">
                {allItems.length === 0
                  ? "No billing items found. Click 'Create Billing Item' to add one."
                  : "No matching items found."}
              </Alert>
            </div>
          ) : (
            <div className="table-responsive">
              <Table className="table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="ps-4 py-3">Department</th>
                    <th className="py-3">Item Name</th>
                    <th className="text-end py-3">Price (₹)</th>
                    <th className="text-center py-3" style={{ width: "130px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                      <td className="ps-4 py-3">
                        <Badge bg="info" pill className="px-3 py-2">
                          {item.department_name}
                        </Badge>
                      </td>
                      <td className="py-3 fw-medium">{item.item_name}</td>
                      <td className="text-end py-3 fw-bold text-success">
                        ₹{item.item_price.toFixed(2)}
                      </td>
                      <td className="text-center py-3">
                        <div className="d-flex justify-content-center gap-2">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleViewDetails(item)}
                            title="View Details"
                          >
                            <Info size={14} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenEditModal(item)}
                            title="Edit"
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(item.id)}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Modal for Create / Edit */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit Billing Item" : "Create New Billing Item"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Department</Form.Label>
              <Form.Select
                value={modalDepartmentId}
                onChange={(e) => setModalDepartmentId(e.target.value)}
                disabled={departments.length === 0}
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Item / Service Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., Consultation Fee, X-Ray, Blood Test"
                value={modalItemName}
                onChange={(e) => setModalItemName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Price (₹)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={modalItemPrice}
                onChange={(e) => setModalItemPrice(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFormModal(false)}>
            Cancel
          </Button>
          <Button
            variant={isEditMode ? "primary" : "success"}
            onClick={handleSaveItem}
            disabled={loading.create}
          >
            {loading.create ? (
              <>
                <Spinner size="sm" className="me-2" /> Saving...
              </>
            ) : (
              <>{isEditMode ? "Update Item" : "Create Item"}</>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Confirm Delete</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    Are you sure you want to delete this billing item?
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => setShowDeleteModal(false)}
    >
      Cancel
    </Button>

    <Button
      variant="danger"
      onClick={confirmDelete}
    >
      Delete
    </Button>
  </Modal.Footer>
</Modal>
      {/* Modal for Details View */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex align-items-center gap-2">
              <Info size={20} /> Item Details
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div className="p-2">
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Department:</div>
                <div className="col-md-8">{selectedItem.department_name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Item Name:</div>
                <div className="col-md-8">{selectedItem.item_name}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Price:</div>
                <div className="col-md-8 text-success fw-bold">₹{selectedItem.item_price.toFixed(2)}</div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4 fw-semibold">Status:</div>
                <div className="col-md-8">
                  <Badge bg={selectedItem.active ? "success" : "secondary"}>
                    {selectedItem.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              {selectedItem.created_at && (
                <div className="row mb-3">
                  <div className="col-md-4 fw-semibold">
                    <Calendar size={14} className="me-1" /> Created:
                  </div>
                  <div className="col-md-8">
                    {new Date(selectedItem.created_at).toLocaleString()}
                  </div>
                </div>
              )}
              {selectedItem.updated_at && (
                <div className="row mb-3">
                  <div className="col-md-4 fw-semibold">
                    <Calendar size={14} className="me-1" /> Last Updated:
                  </div>
                  <div className="col-md-8">
                    {new Date(selectedItem.updated_at).toLocaleString()}
                  </div>
                </div>
              )}
              {/* Add any other fields from your table here */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CreateBilling;