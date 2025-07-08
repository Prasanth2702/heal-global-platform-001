import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Package, AlertTriangle, Calendar, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, addDays } from "date-fns";

interface InventoryItem {
  id: string;
  name: string;
  category: "medicines" | "equipment" | "supplies" | "disposables";
  department: string;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  purchasePrice: number;
  supplier: string;
  purchaseDate: Date;
  expiryDate?: Date;
  batchNumber?: string;
  location: string;
  status: "in_stock" | "low_stock" | "out_of_stock" | "expired";
}

interface UsageRecord {
  id: string;
  itemId: string;
  itemName: string;
  department: string;
  quantity: number;
  usageDate: Date;
  usedBy: string;
  purpose: string;
}

const InventoryManagement = () => {
  const { toast } = useToast();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Paracetamol 500mg",
      category: "medicines",
      department: "Pharmacy",
      currentStock: 50,
      minStockLevel: 100,
      maxStockLevel: 1000,
      unit: "tablets",
      purchasePrice: 2.5,
      supplier: "MedSupply Co.",
      purchaseDate: subDays(new Date(), 30),
      expiryDate: addDays(new Date(), 365),
      batchNumber: "PAR2024001",
      location: "Shelf A-12",
      status: "low_stock"
    },
    {
      id: "2",
      name: "X-Ray Films",
      category: "supplies",
      department: "Radiology",
      currentStock: 25,
      minStockLevel: 50,
      maxStockLevel: 200,
      unit: "pieces",
      purchasePrice: 45,
      supplier: "RadTech Supplies",
      purchaseDate: subDays(new Date(), 15),
      location: "Storage Room B",
      status: "low_stock"
    },
    {
      id: "3",
      name: "Surgical Gloves",
      category: "disposables",
      department: "Surgery",
      currentStock: 500,
      minStockLevel: 200,
      maxStockLevel: 2000,
      unit: "pairs",
      purchasePrice: 5,
      supplier: "SafeMed Inc.",
      purchaseDate: subDays(new Date(), 10),
      location: "Storage Room A",
      status: "in_stock"
    },
    {
      id: "4",
      name: "Blood Test Tubes",
      category: "supplies",
      department: "Pathology Lab",
      currentStock: 15,
      minStockLevel: 100,
      maxStockLevel: 500,
      unit: "pieces",
      purchasePrice: 3,
      supplier: "LabTech Solutions",
      purchaseDate: subDays(new Date(), 20),
      location: "Lab Storage",
      status: "low_stock"
    }
  ]);

  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([
    {
      id: "1",
      itemId: "1",
      itemName: "Paracetamol 500mg",
      department: "General OPD",
      quantity: 100,
      usageDate: subDays(new Date(), 1),
      usedBy: "Dr. Rajesh Kumar",
      purpose: "Patient prescription"
    },
    {
      id: "2",
      itemId: "2",
      itemName: "X-Ray Films",
      department: "Radiology",
      quantity: 5,
      usageDate: subDays(new Date(), 2),
      usedBy: "Tech. Amit Singh",
      purpose: "Chest X-ray procedures"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "medicines" as InventoryItem["category"],
    department: "",
    currentStock: 0,
    minStockLevel: 0,
    maxStockLevel: 0,
    unit: "",
    purchasePrice: 0,
    supplier: "",
    purchaseDate: "",
    expiryDate: "",
    batchNumber: "",
    location: ""
  });

  const categories = ["medicines", "equipment", "supplies", "disposables"];
  const departments = ["Pharmacy", "Radiology", "Pathology Lab", "Surgery", "General OPD", "Emergency", "ICU"];

  // Calculate stock status
  const getStockStatus = (item: InventoryItem): InventoryItem["status"] => {
    if (item.currentStock === 0) return "out_of_stock";
    if (item.expiryDate && item.expiryDate < new Date()) return "expired";
    if (item.currentStock <= item.minStockLevel) return "low_stock";
    return "in_stock";
  };

  // Filter items
  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesDepartment = selectedDepartment === "all" || item.department === selectedDepartment;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = !showLowStock || item.status === "low_stock" || item.status === "out_of_stock";
    
    return matchesCategory && matchesDepartment && matchesSearch && matchesLowStock;
  });

  // Get low stock alerts
  const lowStockItems = inventoryItems.filter(item => 
    item.status === "low_stock" || item.status === "out_of_stock"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      setInventoryItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...formData, 
              purchaseDate: new Date(formData.purchaseDate),
              expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
              status: getStockStatus({ ...item, ...formData } as InventoryItem)
            }
          : item
      ));
      toast({
        title: "Item Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      setEditingItem(null);
    } else {
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData,
        purchaseDate: new Date(formData.purchaseDate),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
        status: "in_stock"
      };
      newItem.status = getStockStatus(newItem as InventoryItem);
      setInventoryItems(prev => [...prev, newItem]);
      toast({
        title: "Item Added",
        description: `${formData.name} has been added to inventory.`,
      });
    }
    
    setFormData({
      name: "",
      category: "medicines",
      department: "",
      currentStock: 0,
      minStockLevel: 0,
      maxStockLevel: 0,
      unit: "",
      purchasePrice: 0,
      supplier: "",
      purchaseDate: "",
      expiryDate: "",
      batchNumber: "",
      location: ""
    });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      department: item.department,
      currentStock: item.currentStock,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      unit: item.unit,
      purchasePrice: item.purchasePrice,
      supplier: item.supplier,
      purchaseDate: format(item.purchaseDate, "yyyy-MM-dd"),
      expiryDate: item.expiryDate ? format(item.expiryDate, "yyyy-MM-dd") : "",
      batchNumber: item.batchNumber || "",
      location: item.location
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const item = inventoryItems.find(i => i.id === id);
    setInventoryItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Item Deleted",
      description: `${item?.name} has been removed from inventory.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "bg-green-100 text-green-800";
      case "low_stock":
        return "bg-yellow-100 text-yellow-800";
      case "out_of_stock":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medicines":
        return "bg-blue-100 text-blue-800";
      case "equipment":
        return "bg-purple-100 text-purple-800";
      case "supplies":
        return "bg-green-100 text-green-800";
      case "disposables":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">
            Track and manage hospital inventory with automated alerts
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? "Update inventory item information" : "Add a new item to hospital inventory"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Item Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter item name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as InventoryItem["category"] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={formData.supplier}
                      onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
                      placeholder="Supplier name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={formData.currentStock}
                      onChange={(e) => setFormData(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="minStockLevel">Min Stock</Label>
                    <Input
                      id="minStockLevel"
                      type="number"
                      value={formData.minStockLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, minStockLevel: parseInt(e.target.value) || 0 }))}
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxStockLevel">Max Stock</Label>
                    <Input
                      id="maxStockLevel"
                      type="number"
                      value={formData.maxStockLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxStockLevel: parseInt(e.target.value) || 0 }))}
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., tablets, pieces"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Storage location"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="batchNumber">Batch Number</Label>
                    <Input
                      id="batchNumber"
                      value={formData.batchNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                      placeholder="Batch/Lot number"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Inventory Alert:</strong> {lowStockItems.length} items are running low or out of stock.
            <Button 
              variant="link" 
              className="p-0 ml-2 h-auto"
              onClick={() => setShowLowStock(!showLowStock)}
            >
              {showLowStock ? "Show all items" : "View low stock items"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Inventory Items
          </CardTitle>
          <CardDescription>
            {filteredItems.length} items {showLowStock && "(showing low stock items only)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Levels</TableHead>
                <TableHead>Purchase Info</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.department}</p>
                      {item.batchNumber && (
                        <p className="text-xs text-muted-foreground">Batch: {item.batchNumber}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(item.category)} variant="outline">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.currentStock} {item.unit}</p>
                      <p className="text-xs text-muted-foreground">
                        Min: {item.minStockLevel} | Max: {item.maxStockLevel}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            item.currentStock <= item.minStockLevel ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ 
                            width: `${Math.min((item.currentStock / item.maxStockLevel) * 100, 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">₹{item.purchasePrice}/{item.unit}</p>
                      <p className="text-xs text-muted-foreground">{item.supplier}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(item.purchaseDate, "MMM d, yyyy")}
                      </div>
                      {item.expiryDate && (
                        <p className="text-xs text-orange-600">
                          Expires: {format(item.expiryDate, "MMM d, yyyy")}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{item.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManagement;