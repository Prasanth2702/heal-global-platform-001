import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, DollarSign, Edit2, Trash2 } from "lucide-react";

interface ServiceScheduleManagementProps {
  facilityId: string;
}

const ServiceScheduleManagement = ({ facilityId }: ServiceScheduleManagementProps) => {
  const [services, setServices] = useState([
    {
      id: "1",
      name: "General Consultation",
      department: "General Medicine",
      duration: 30,
      fee: 500,
      slots: ["09:00", "10:00", "11:00", "14:00", "15:00"],
      status: "active"
    },
    {
      id: "2",
      name: "Cardiology Checkup",
      department: "Cardiology",
      duration: 45,
      fee: 1200,
      slots: ["10:00", "11:30", "14:30", "16:00"],
      status: "active"
    }
  ]);

  const [newService, setNewService] = useState({
    name: "",
    department: "",
    duration: 30,
    fee: 0,
    slots: []
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Service Schedule Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{service.department}</Badge>
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{service.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>₹{service.fee}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">
                        {service.slots.length} slots available
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Schedule management interface coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="service-name">Service Name</Label>
                    <Input id="service-name" placeholder="Enter service name" />
                  </div>
                  <div>
                    <Label htmlFor="base-fee">Base Fee</Label>
                    <Input id="base-fee" type="number" placeholder="0" />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Input id="duration" type="number" placeholder="30" />
                  </div>
                </div>
                <Button>Update Fee Structure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceScheduleManagement;