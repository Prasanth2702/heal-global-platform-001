// // CreateBilling.tsx
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
// } from "react-bootstrap";
// import { PlusCircle, DollarSign, Building, Layers, Save, Tag } from "lucide-react";

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
//   const [itemName, setItemName] = useState("");
//   const [itemPrice, setItemPrice] = useState("");
//   const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
//   const [loading, setLoading] = useState({
//     facility: false,
//     departments: false,
//     items: false,
//     create: false,
//   });

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
//         fetchDepartments(data.id);
//       }
//       setLoading((prev) => ({ ...prev, facility: false }));
//     };

//     fetchFacility();
//   }, [user, toast]);

//   // 2. Fetch departments for the facility
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
//     } else {
//       setDepartments(data || []);
//     }
//     setLoading((prev) => ({ ...prev, departments: false }));
//   };

//   // 3. Fetch existing items for selected department
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

//   // Handle department change
//   const handleDepartmentChange = (deptId: string) => {
//     setSelectedDepartment(deptId);
//     setItemName("");
//     setItemPrice("");
//     // Find department name
//     const dept = departments.find(d => d.id === deptId);
//     setSelectedDepartmentName(dept?.name || "");
//     if (deptId) {
//       fetchDepartmentItems(deptId);
//     } else {
//       setFacilityItems([]);
//       setSelectedDepartmentName("");
//     }
//   };

//   // 4. Create new billing item
//   const handleCreateItem = async () => {
//     if (!facility) {
//       toast({
//         title: "Error",
//         description: "Facility not identified.",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!selectedDepartment) {
//       toast({
//         title: "Error",
//         description: "Please select a department.",
//         variant: "destructive",
//       });
//       return;
//     }
//     if (!itemName.trim()) {
//       toast({
//         title: "Error",
//         description: "Item name is required.",
//         variant: "destructive",
//       });
//       return;
//     }
//     const price = parseFloat(itemPrice);
//     if (isNaN(price) || price <= 0) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid price greater than 0.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading((prev) => ({ ...prev, create: true }));
//     const { error } = await supabase.from("facility_items_master").insert([
//       {
//         facility_id: facility.id,
//         department_id: selectedDepartment,
//         item_name: itemName.trim(),
//         item_price: price,
//         active: true,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//       },
//     ]);

//     if (error) {
//       toast({
//         title: "Creation Failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } else {
//       toast({
//         title: "Success",
//         description: `"${itemName}" has been added.`,
//       });
//       setItemName("");
//       setItemPrice("");
//       fetchDepartmentItems(selectedDepartment);
//     }
//     setLoading((prev) => ({ ...prev, create: false }));
//   };

//   return (
//     <Container fluid className="py-4">
//       {/* Facility Header Card */}
//       {loading.facility ? (
//         <div className="text-center py-3">
//           <Spinner animation="border" />
//         </div>
//       ) : facility ? (
//         <Card className="shadow-sm mb-4 border-0 bg-light">
//           <Card.Body className="d-flex align-items-center gap-3">
//             <Building size={32} className="text-primary" />
//             <div>
//               <h4 className="mb-0">{facility.facility_name}</h4>
//               {facility.address && <small className="text-muted">{facility.address}</small>}
//             </div>
//           </Card.Body>
//         </Card>
//       ) : (
//         <Alert variant="danger">No facility associated with your account.</Alert>
//       )}

//       <h3 className="mb-4 d-flex align-items-center gap-2">
//         <DollarSign size={28} className="text-primary" />
//         Department Billing Price Management
//       </h3>

//       <Row>
//         {/* Left Column: Create New Item */}
//         <Col lg={5}>
//           <Card className="shadow-sm border-0 h-100">
//             <Card.Header className="bg-primary text-white d-flex align-items-center gap-2">
//               <PlusCircle size={18} /> Create New Billing Item
//             </Card.Header>
//             <Card.Body>
//               {/* Department Selector */}
//               <Form.Group className="mb-3">
//                 <Form.Label>
//                   <Layers size={16} className="me-1" /> Department
//                 </Form.Label>
//                 <Form.Select
//                   value={selectedDepartment}
//                   onChange={(e) => handleDepartmentChange(e.target.value)}
//                   disabled={loading.departments || departments.length === 0}
//                 >
//                   <option value="">-- Select Department --</option>
//                   {departments.map((dept) => (
//                     <option key={dept.id} value={dept.id}>
//                       {dept.name}
//                     </option>
//                   ))}
//                 </Form.Select>
//                 {departments.length === 0 && !loading.departments && (
//                   <Alert variant="warning" className="mt-2">
//                     No active departments found for this facility.
//                   </Alert>
//                 )}
//               </Form.Group>

//               {/* Item Name */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Item / Service Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   placeholder="e.g., Consultation Fee, X-Ray, Blood Test"
//                   value={itemName}
//                   onChange={(e) => setItemName(e.target.value)}
//                   disabled={!selectedDepartment}
//                 />
//               </Form.Group>

//               {/* Item Price */}
//               <Form.Group className="mb-4">
//                 <Form.Label>Price (₹)</Form.Label>
//                 <Form.Control
//                   type="number"
//                   placeholder="Enter amount"
//                   value={itemPrice}
//                   onChange={(e) => setItemPrice(e.target.value)}
//                   disabled={!selectedDepartment}
//                 />
//               </Form.Group>

//               {/* Submit Button */}
//               <Button
//                 variant="success"
//                 className="w-100"
//                 onClick={handleCreateItem}
//                 disabled={
//                   !selectedDepartment ||
//                   !itemName.trim() ||
//                   !itemPrice ||
//                   loading.create
//                 }
//               >
//                 {loading.create ? (
//                   <>
//                     <Spinner size="sm" className="me-2" /> Creating...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} className="me-2" /> Save Billing Item
//                   </>
//                 )}
//               </Button>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right Column: Existing Items List */}
//         <Col lg={7}>
//           <Card className="shadow-sm border-0">
//             <Card.Header className="bg-info text-white d-flex align-items-center gap-2">
//               <DollarSign size={18} /> Department Billing List
//               {selectedDepartmentName && (
//                 <Badge bg="light" text="dark" className="ms-2">
//                   <Tag size={14} className="me-1" />
//                   {selectedDepartmentName}
//                 </Badge>
//               )}
//             </Card.Header>
//             <Card.Body>
//               {!selectedDepartment ? (
//                 <Alert variant="secondary">
//                   Please select a department from the left to view its billing items.
//                 </Alert>
//               ) : loading.items ? (
//                 <div className="text-center py-4">
//                   <Spinner animation="border" />
//                 </div>
//               ) : facilityItems.length === 0 ? (
//                 <Alert variant="light">
//                   No items found for <strong>{selectedDepartmentName}</strong>. 
//                   Create your first billing item using the form.
//                 </Alert>
//               ) : (
//                 <div className="table-responsive">
//                   <Table striped hover>
//                     <thead>
//                       <tr>
//                         <th>Item Name</th>
//                         <th className="text-end">Price (₹)</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {facilityItems.map((item) => (
//                         <tr key={item.id}>
//                           <td>{item.item_name}</td>
//                           <td className="text-end fw-bold">
//                             ₹{item.item_price.toFixed(2)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default CreateBilling;

// CreateBilling.tsx
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
  Alert,
  Badge,
} from "react-bootstrap";
import { PlusCircle, DollarSign, Building, Layers, Save, Tag, CreditCard, ListChecks } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/hooks/useUser";

// ======================== TYPES (unchanged) ========================
interface Facility {
  id: string;
  facility_name: string;
  address: string | null;
}

interface Department {
  id: string;
  name: string;
  is_active: boolean;
}

interface FacilityItem {
  id: string;
  department_id: string;
  item_name: string;
  item_price: number;
  active: boolean;
}

// ======================== COMPONENT ========================
const CreateBilling: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // State (exactly as before)
  const [facility, setFacility] = useState<Facility | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string>("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [facilityItems, setFacilityItems] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState({
    facility: false,
    departments: false,
    items: false,
    create: false,
  });

  // 1. Fetch facility based on admin_user_id (unchanged)
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
        fetchDepartments(data.id);
      }
      setLoading((prev) => ({ ...prev, facility: false }));
    };

    fetchFacility();
  }, [user, toast]);

  // 2. Fetch departments for the facility (unchanged)
  const fetchDepartments = async (facilityId: string) => {
    setLoading((prev) => ({ ...prev, departments: true }));
    const { data, error } = await supabase
      .from("departments")
      .select("id, name, is_active")
      .eq("facility_id", facilityId)
      .eq("is_active", true)
      .order("name");

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load departments.",
        variant: "destructive",
      });
    } else {
      setDepartments(data || []);
    }
    setLoading((prev) => ({ ...prev, departments: false }));
  };

  // 3. Fetch existing items for selected department (unchanged)
  const fetchDepartmentItems = async (deptId: string) => {
    if (!facility) return;
    setLoading((prev) => ({ ...prev, items: true }));
    const { data, error } = await supabase
      .from("facility_items_master")
      .select("id, department_id, item_name, item_price, active")
      .eq("facility_id", facility.id)
      .eq("department_id", deptId)
      .eq("active", true);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load items.",
        variant: "destructive",
      });
      setFacilityItems([]);
    } else {
      setFacilityItems(data || []);
    }
    setLoading((prev) => ({ ...prev, items: false }));
  };

  // Handle department change (unchanged)
  const handleDepartmentChange = (deptId: string) => {
    setSelectedDepartment(deptId);
    setItemName("");
    setItemPrice("");
    const dept = departments.find(d => d.id === deptId);
    setSelectedDepartmentName(dept?.name || "");
    if (deptId) {
      fetchDepartmentItems(deptId);
    } else {
      setFacilityItems([]);
      setSelectedDepartmentName("");
    }
  };

  // 4. Create new billing item (unchanged)
  const handleCreateItem = async () => {
    if (!facility) {
      toast({
        title: "Error",
        description: "Facility not identified.",
        variant: "destructive",
      });
      return;
    }
    if (!selectedDepartment) {
      toast({
        title: "Error",
        description: "Please select a department.",
        variant: "destructive",
      });
      return;
    }
    if (!itemName.trim()) {
      toast({
        title: "Error",
        description: "Item name is required.",
        variant: "destructive",
      });
      return;
    }
    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, create: true }));
    const { error } = await supabase.from("facility_items_master").insert([
      {
        facility_id: facility.id,
        department_id: selectedDepartment,
        item_name: itemName.trim(),
        item_price: price,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `"${itemName}" has been added.`,
      });
      setItemName("");
      setItemPrice("");
      fetchDepartmentItems(selectedDepartment);
    }
    setLoading((prev) => ({ ...prev, create: false }));
  };

  // ======================== MAIN RENDER (Redesigned) ========================
  return (
    <Container fluid className="py-4 px-3 px-md-4">
      {/* Facility Banner - Modern Gradient */}
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
                <p className="mb-0 mt-1 opacity-90 small">
                  📍 {facility.address}
                </p>
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

      {/* Page Title */}
      <div className="d-flex align-items-center gap-2 mb-4">
        <div className="bg-primary bg-opacity-10 p-2 rounded-lg">
          <DollarSign size={24} className="text-primary" />
        </div>
        <h3 className="mb-0 fw-semibold">Department Billing Price Management</h3>
      </div>

      <Row className="g-4">
        {/* Left Column: Create New Item */}
        <Col lg={5}>
          <Card className="shadow-lg border-0 rounded-4 h-100">
            <Card.Header className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-top-4 d-flex align-items-center gap-2">
              <PlusCircle size={20} /> Create New Billing Item
            </Card.Header>
            <Card.Body className="p-4">
              {/* Department Selector */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold d-flex align-items-center gap-1">
                  <Layers size={16} /> Department
                </Form.Label>
                <Form.Select
                  value={selectedDepartment}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  disabled={loading.departments || departments.length === 0}
                  className="py-2 rounded-lg"
                >
                  <option value="">-- Select Department --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </Form.Select>
                {departments.length === 0 && !loading.departments && (
                  <Alert variant="warning" className="mt-2 small">
                    No active departments found for this facility.
                  </Alert>
                )}
              </Form.Group>

              {/* Item Name */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Item / Service Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g., Consultation Fee, X-Ray, Blood Test"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  disabled={!selectedDepartment}
                  className="py-2 rounded-lg"
                />
              </Form.Group>

              {/* Item Price */}
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  disabled={!selectedDepartment}
                  className="py-2 rounded-lg"
                />
              </Form.Group>

              {/* Submit Button */}
              <Button
                variant="success"
                className="w-100 py-2 fw-semibold rounded-pill shadow-sm"
                onClick={handleCreateItem}
                disabled={
                  !selectedDepartment ||
                  !itemName.trim() ||
                  !itemPrice ||
                  loading.create
                }
              >
                {loading.create ? (
                  <>
                    <Spinner size="sm" className="me-2" /> Creating...
                  </>
                ) : (
                  <>
                     Save Billing Item
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Existing Items List */}
        <Col lg={7}>
          <Card className="shadow-lg border-0 rounded-4 h-100">
            <Card.Header className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-3 rounded-top-4 d-flex flex-wrap align-items-center gap-2">
              <ListChecks size={20} /> Department Billing List
              {selectedDepartmentName && (
                <Badge bg="light" text="dark" className="ms-2 rounded-pill px-3">
                  <Tag size={14} className="me-1" />
                  {selectedDepartmentName}
                </Badge>
              )}
            </Card.Header>
            <Card.Body className="p-0">
              {!selectedDepartment ? (
                <div className="text-center text-muted py-5 px-4">
                  <Building size={48} className="mb-3 opacity-25" />
                  <p className="mb-0">Select a department from the left to view its billing items.</p>
                </div>
              ) : loading.items ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                </div>
              ) : facilityItems.length === 0 ? (
                <div className="text-center py-5 px-4">
                  <CreditCard size={48} className="mb-3 opacity-25 text-muted" />
                  <Alert variant="light" className="d-inline-block">
                    No items found for <strong>{selectedDepartmentName}</strong>. 
                    Create your first billing item using the form.
                  </Alert>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table className="table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="ps-4 py-3">Item Name</th>
                        <th className="text-end pe-4 py-3">Price (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {facilityItems.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-light"}>
                          <td className="ps-4 py-3 fw-medium">
                            <div className="d-flex align-items-center gap-2">
                              <div className="bg-primary bg-opacity-10 p-1 rounded">
                                <DollarSign size={14} className="text-primary" />
                              </div>
                              {item.item_name}
                            </div>
                          </td>
                          <td className="text-end pe-4 py-3 fw-bold text-success">
                            ₹{item.item_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateBilling;