import React, { useState, useEffect } from "react";
import { Bill, billingService, FacilityItem } from "@/services/billingService";
import { BillForm } from "./BillForm";
import { ItemManager } from "./ItemManager";
import { BillList } from "./BillList";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useFacilityLimit } from "@/hooks/useFacilityLimit";
import { 
  PhoneIcon, 
  AlertCircle, 
  SubscriptIcon,
  X 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface Facility {
  id: string;
  facility_name: string;
  admin_user_id: string;
}

export const BillingSystem = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"bills" | "create" | "items">(
    "bills",
  );
  const [role, setRole] = useState<string | null>(null);
  const [items, setItems] = useState<FacilityItem[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [facilityId, setFacilityId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    getUserAndFacility();
  }, []);
  const navigate = useNavigate();
const [showLimitMessage, setShowLimitMessage] = useState(true);
const [showContactPopup, setShowContactPopup] = useState(false);
  const [departmentId, setDepartmentId] = useState<string | null>(null);
  const [position, setPosition] = useState<string | null>(null);
  // const getUserAndFacility = async () => {
  //   try {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser()

  //     if (!user) return

  //     setUserId(user.id)

  //     const { data: facility } = await supabase
  //       .from("facilities")
  //       .select("id")
  //       .eq("admin_user_id", user.id)
  //       .single()

  //     if (facility) {
  //       setFacilityId(facility.id)
  //     }

  //   } catch (error) {
  //     console.error("Error fetching facility:", error)
  //   }
  // }
  const getUserAndFacility = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      // Get Role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setRole(profile.role);
      }

      // If Admin → Get Facility from facilities
      if (profile?.role === "hospital_admin") {
        const { data: facility } = await supabase
          .from("facilities")
          .select("id")
          .eq("admin_user_id", user.id)
          .single();

        if (facility) {
          setFacilityId(facility.id);
        }
      }

      // If Staff → Get Facility from staff table
      if (profile?.role === "hospital_staff") {
        const { data: staff } = await supabase
          .from("staff")
          .select("facility_id, department_id, position")
          .eq("user_id", user.id)
          .single();

        if (staff) {
          setFacilityId(staff.facility_id);

          console.log("Staff Department:", staff.department_id);
          console.log("Staff Position:", staff.position);
        }
      }
    } catch (error) {
      console.error("Error fetching facility:", error);
    }
  };
  //   useEffect(() => {
  //     loadBills()
  //   }, [facilityId])
  useEffect(() => {
    if (facilityId && role) {
      loadBills();
    }
  }, [facilityId, role]);

  useEffect(() => {
    loadItems();
    loadBills();
  }, [facilityId]);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await billingService.getItems(facilityId);
      setItems(data);
    } catch (error) {
      console.error("Error loading items:", error);
      toast({
        title: "Error",
        description: "Failed to load items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const [isBillingBlocked, setIsBillingBlocked] = useState(false);
  const [billingMessage, setBillingMessage] = useState("");
  const { checkLimit, limits, loading: limitLoading } = useFacilityLimit();
  useEffect(() => {
    const checkBillingAccess = async () => {
      if (!facilityId) return;

      const result = await checkLimit(facilityId, "all");

      console.log("LIMIT RESULT:", result);

      // 🔥 MAIN CONDITION
      if (result?.billingFeatureEnabled === false) {
        setIsBillingBlocked(true);
        setBillingMessage(
          "Subscription Required: Billing feature is not enabled for your plan.",
        );
      } else {
        setIsBillingBlocked(false);
      }
    };

    checkBillingAccess();
  }, [facilityId]);

  //   const loadBills = async () => {
  //       const data = await billingService.getBills(facilityId)
  //       setBills(data)
  //   }
  const loadBills = async () => {
    setLoading(true);

    try {
      let data;

      if (role === "hospital_staff") {
        data = await billingService.getBillsStaff(facilityId, userId, role);
      } else {
        data = await billingService.getBills(facilityId);
      }

      setBills(data);
    } catch (error) {
      console.error("Error loading bills:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateBill = async (billData: any) => {
    setLoading(true);
    try {
      await billingService.createBill({
        ...billData,
        facility_id: facilityId,
        created_by: userId,
      });
      toast({
        title: "Success",
        description: "Bill created successfully!",
      });
      setActiveTab("bills");
      loadBills();
    } catch (error: any) {
      console.error("Error creating bill:", error);
      toast({
        title: "Error Creating Bill",
        description:
          error?.message ?? "Unable to create bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // if (isBillingBlocked) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <div className="bg-white p-6 rounded-xl shadow-md text-center">
  //         <h2 className="text-xl font-semibold text-red-600 mb-2">
  //           Subscription Required
  //         </h2>
  //         <p className="text-gray-600 mb-4">{billingMessage}</p>

  //         <ul className="text-sm text-gray-500 mb-4">
  //           <li>• Upgrade your plan to enable billing</li>
  //           <li>• Contact administrator</li>
  //         </ul>

  //         <p className="text-sm text-muted-foreground">
  //           Contact us to update your number
  //         </p>

  //         <p className="flex items-center justify-center">
  //           <PhoneIcon size={18} className="text-primary mr-2 flex-shrink-0" />
  //           <span className="text-primary">+91 98868 81149</span>
  //         </p>

  //         <button
  //           className="bg-indigo-600 text-white px-4 py-2 rounded"
  //           onClick={() => window.location.reload()}
  //         >
  //           Refresh
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  if (limitLoading) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>

        <p className="mt-4 text-muted-foreground">
          Checking billing access...
        </p>
      </div>
    </div>
  );
}

  if (isBillingBlocked ) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        <div className="mb-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle>Billing Feature Locked</CardTitle>

                <CardDescription>
                  Your current subscription plan does not include billing access.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLimitMessage(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent>
              <div className="text-center py-8 space-y-4 border rounded-lg bg-amber-50 border-amber-200">
                <AlertCircle className="h-12 w-12 text-amber-600 mx-auto" />

                <h3 className="text-lg font-semibold text-amber-800">
                  Billing Access Not Available
                </h3>

                <p className="text-amber-700 max-w-md mx-auto">
                  Please upgrade your subscription plan or contact support
                  to enable billing management features.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowContactPopup(true)}
                  >
                    <PhoneIcon className="mr-2 h-4 w-4" />
                    Contact Support
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate("/dashboard/facility/subscription")
                    }
                  >
                    <SubscriptIcon className="mr-2 h-4 w-4" />
                    Subscription
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Popup */}
          <Dialog
            open={showContactPopup}
            onOpenChange={setShowContactPopup}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  Contact Support for Billing
                </DialogTitle>

                <DialogDescription>
                  Our support team will help you activate
                  billing features for your facility.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center justify-center space-x-2 py-6">
                <PhoneIcon className="h-5 w-5 text-primary" />

                <a
                  href={`tel:${import.meta.env.VITE_SUPPORT_PHONE_NUMBER}`}
                  className="text-xl font-medium text-primary underline"
                >
                  {import.meta.env.VITE_SUPPORT_PHONE_NUMBER}
                </a>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowContactPopup(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="border-b border-gray-200">
            {/* <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('bills')}
                className={`${
                  activeTab === 'bills'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                View Bills
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`${
                  activeTab === 'create'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Create New Bill
              </button>
              <button
                onClick={() => setActiveTab('items')}
                className={`${
                  activeTab === 'items'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Manage Items
              </button>
            </nav> */}
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("bills")}
                className={`${
                  activeTab === "bills"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                View Bills
              </button>

              {/* Admin + Staff */}
              <button
                onClick={() => setActiveTab("create")}
                className={`${
                  activeTab === "create"
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Create New Bill
              </button>

              {/* Only Admin */}
              {role === "hospital_admin" && (
                <button
                  onClick={() => setActiveTab("items")}
                  className={`${
                    activeTab === "items"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Manage Items
                </button>
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "bills" && (
              <BillList
                facilityId={facilityId}
                userId={userId}
                userRole={role}
              />
            )}
            {activeTab === "create" && (
              //   <BillForm
              //     items={items}
              //     onSubmit={handleCreateBill}
              //     loading={loading}
              //   />
              <BillForm
                facilityId={facilityId}
                userId={userId}
                onSuccess={() => {
                  loadBills();
                  setActiveTab("bills");
                }}
                onCancel={() => setActiveTab("bills")}
                // loading={loading}
              />
            )}
            {activeTab === "items" && (
              <ItemManager
                facilityId={facilityId}
                items={items}
                onItemsChange={loadItems}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
