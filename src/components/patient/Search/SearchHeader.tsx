// // // // // import React from "react";
// // // // // import { Button } from "@/components/ui/button";
// // // // // import { Input } from "@/components/ui/input";
// // // // // import { Label } from "@/components/ui/label";
// // // // // import { Card, CardContent } from "@/components/ui/card";
// // // // // import {
// // // // //   Select,
// // // // //   SelectContent,
// // // // //   SelectItem,
// // // // //   SelectTrigger,
// // // // //   SelectValue,
// // // // // } from "@/components/ui/select";
// // // // // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // // // import { MapPin, Filter, Search } from "lucide-react";

// // // // // interface SearchHeaderProps {
// // // // //   searchQuery: string;
// // // // //   setSearchQuery: (query: string) => void;
// // // // //   locationFilter: string;
// // // // //   setLocationFilter: (location: string) => void;
// // // // //   selectedSpecialty: string;
// // // // //   setSelectedSpecialty: (specialty: string) => void;
// // // // //   activeFilterTab: string;
// // // // //   setActiveFilterTab: (tab: string) => void;
// // // // //   showFilters: boolean;
// // // // //   setShowFilters: (show: boolean) => void;
// // // // //   onSearch: () => void;
// // // // //   onDetectLocation: () => void;
// // // // //   specialties: string[];
// // // // // }

// // // // // const SearchHeader: React.FC<SearchHeaderProps> = ({
// // // // //   searchQuery,
// // // // //   setSearchQuery,
// // // // //   locationFilter,
// // // // //   setLocationFilter,
// // // // //   selectedSpecialty,
// // // // //   setSelectedSpecialty,
// // // // //   activeFilterTab,
// // // // //   setActiveFilterTab,
// // // // //   showFilters,
// // // // //   setShowFilters,
// // // // //   onSearch,
// // // // //   onDetectLocation,
// // // // //   specialties,
// // // // // }) => {
// // // // //   const handleKeyPress = (e: React.KeyboardEvent) => {
// // // // //     if (e.key === 'Enter') {
// // // // //       onSearch();
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <div className="space-y-4">
// // // // //       <div className="flex flex-col md:flex-row gap-4">
// // // // //         <div className="flex-1">
// // // // //           <Label htmlFor="search">Search Doctors, Hospitals, or Specialties</Label>
// // // // //           <div className="flex gap-2 mt-1">
// // // // //             <Input
// // // // //               id="search"
// // // // //               placeholder="Enter doctor name, specialty, or hospital..."
// // // // //               value={searchQuery}
// // // // //               onChange={(e) => setSearchQuery(e.target.value)}
// // // // //               onKeyPress={handleKeyPress}
// // // // //               className="flex-1"
// // // // //             />
// // // // //             <Button onClick={onSearch} className="px-8">
// // // // //               <Search className="mr-2 h-4 w-4" /> Search
// // // // //             </Button>
// // // // //           </div>
// // // // //         </div>

// // // // //         <div className="flex gap-2 items-end">
// // // // //           <Button onClick={onDetectLocation} variant="outline">
// // // // //             <MapPin className="mr-2 h-4 w-4" /> Near Me
// // // // //           </Button>
// // // // //           <Button
// // // // //             variant="outline"
// // // // //             onClick={() => setShowFilters(!showFilters)}
// // // // //           >
// // // // //             <Filter className="mr-2 h-4 w-4" /> Filters
// // // // //           </Button>
// // // // //         </div>
// // // // //       </div>

// // // // //       {showFilters && (
// // // // //         <Card>
// // // // //           <CardContent className="pt-6">
// // // // //             <div className="grid md:grid-cols-2 gap-4">
// // // // //               <div>
// // // // //                 <Label>Filter By</Label>
// // // // //                 <Tabs 
// // // // //                   defaultValue="doctors"
// // // // //                   value={activeFilterTab}
// // // // //                   onValueChange={(value) => {
// // // // //                     setActiveFilterTab(value);
// // // // //                   }}
// // // // //                   className="mt-2"
// // // // //                 >
// // // // //                   <TabsList className="grid w-full grid-cols-2">
// // // // //                     {/* <TabsTrigger value="all">All</TabsTrigger> */}
// // // // //                     <TabsTrigger value="doctors">Doctors</TabsTrigger>
// // // // //                     <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
// // // // //                   </TabsList>
// // // // //                 </Tabs>
// // // // //               </div>

// // // // //               {activeFilterTab !== "doctors" && (
// // // // //                 <div>
// // // // //                   <Label>Specialty</Label>
// // // // //                   <Select
// // // // //                     value={selectedSpecialty}
// // // // //                     onValueChange={setSelectedSpecialty}
// // // // //                   >
// // // // //                     <SelectTrigger className="mt-1">
// // // // //                       <SelectValue placeholder="Select specialty" />
// // // // //                     </SelectTrigger>
// // // // //                     <SelectContent>
// // // // //                       <SelectItem value="all">All Specialties</SelectItem>
// // // // //                       {specialties.map((s) => (
// // // // //                         <SelectItem key={s} value={s}>
// // // // //                           {s}
// // // // //                         </SelectItem>
// // // // //                       ))}
// // // // //                     </SelectContent>
// // // // //                   </Select>
// // // // //                 </div>
// // // // //               )}

// // // // //               <div>
// // // // //                 <Label>Location/Area</Label>
// // // // //                 <Input
// // // // //                   placeholder="Enter area or hospital"
// // // // //                   value={locationFilter}
// // // // //                   onChange={(e) => setLocationFilter(e.target.value)}
// // // // //                   className="mt-1"
// // // // //                 />
// // // // //               </div>
// // // // //             </div>
// // // // //           </CardContent>
// // // // //         </Card>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SearchHeader;

// // // // import React from "react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Label } from "@/components/ui/label";
// // // // import { Card, CardContent } from "@/components/ui/card";
// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue,
// // // // } from "@/components/ui/select";
// // // // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // // import { MapPin, Filter, Search } from "lucide-react";

// // // // interface SearchHeaderProps {
// // // //   searchQuery: string;
// // // //   setSearchQuery: (query: string) => void;
// // // //   locationFilter: string;
// // // //   setLocationFilter: (location: string) => void;
// // // //   selectedSpecialty: string;
// // // //   setSelectedSpecialty: (specialty: string) => void;
// // // //   activeFilterTab: string;
// // // //   setActiveFilterTab: (tab: string) => void;
// // // //   showFilters: boolean;
// // // //   setShowFilters: (show: boolean) => void;
// // // //   onSearch: () => void;
// // // //   onDetectLocation: () => void;
// // // //   doctorSpecialties: string[];
// // // //   hospitalDepartments: string[];
// // // //   cities: string[];
// // // //   specialties: string[];
// // // // }

// // // // const SearchHeader: React.FC<SearchHeaderProps> = ({
// // // //   searchQuery,
// // // //   setSearchQuery,
// // // //   locationFilter,
// // // //   setLocationFilter,
// // // //   selectedSpecialty,
// // // //   setSelectedSpecialty,
// // // //   activeFilterTab,
// // // //   setActiveFilterTab,
// // // //   showFilters,
// // // //   setShowFilters,
// // // //   onSearch,
// // // //   onDetectLocation,
// // // //   doctorSpecialties,
// // // //   hospitalDepartments,
// // // //   cities,
// // // //   specialties
// // // // }) => {
// // // //   const handleKeyPress = (e: React.KeyboardEvent) => {
// // // //     if (e.key === 'Enter') {
// // // //       onSearch();
// // // //     }
// // // //   };

// // // //   // Predefined hospital departments if none provided
// // // //   const defaultHospitalDepartments = [
// // // //     "General Medicine",
// // // //     "Cardiology",
// // // //     "Neurology",
// // // //     "Orthopedics",
// // // //     "Pediatrics",
// // // //     "Gynecology",
// // // //     "Surgery",
// // // //     "Emergency",
// // // //     "ICU",
// // // //     "Radiology",
// // // //     "Pathology",
// // // //     "Dermatology",
// // // //     "ENT",
// // // //     "Ophthalmology",
// // // //     "Psychiatry",
// // // //     "Physiotherapy",
// // // //     "Dental",
// // // //     "Ayurveda",
// // // //     "Homeopathy",
// // // //     "Dietetics"
// // // //   ];

// // // //   const departments = hospitalDepartments.length > 0 ? hospitalDepartments : defaultHospitalDepartments;

// // // //   // Get the current placeholder based on active tab
// // // //   const getPlaceholder = () => {
// // // //     if (activeFilterTab === "doctors") {
// // // //       return "Enter doctor name or specialty...";
// // // //     } else if (activeFilterTab === "hospitals") {
// // // //       return "Enter hospital name or department...";
// // // //     }
// // // //     return "Enter doctor name, specialty, or hospital...";
// // // //   };

// // // //   // Get the label for the specialty/department field
// // // //   const getSpecialtyLabel = () => {
// // // //     return activeFilterTab === "doctors" ? "Doctor Specialty" : "Hospital Department";
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       <div className="flex flex-col md:flex-row gap-4">
// // // //         <div className="flex-1">
// // // //           <Label htmlFor="search">
// // // //             {activeFilterTab === "doctors" ? "Search Doctors" : 
// // // //              activeFilterTab === "hospitals" ? "Search Hospitals" : "Search"}
// // // //           </Label>
// // // //           <div className="flex gap-2 mt-1">
// // // //             <Input
// // // //               id="search"
// // // //               placeholder={getPlaceholder()}
// // // //               value={searchQuery}
// // // //               onChange={(e) => setSearchQuery(e.target.value)}
// // // //               onKeyPress={handleKeyPress}
// // // //               className="flex-1"
// // // //             />
// // // //             <Button onClick={onSearch} className="px-8">
// // // //               <Search className="mr-2 h-4 w-4" /> Search
// // // //             </Button>
// // // //           </div>
// // // //         </div>

// // // //         <div className="flex gap-2 items-end">
// // // //           <Button onClick={onDetectLocation} variant="outline">
// // // //             <MapPin className="mr-2 h-4 w-4" /> Near Me
// // // //           </Button>
// // // //           <Button
// // // //             variant="outline"
// // // //             onClick={() => setShowFilters(!showFilters)}
// // // //           >
// // // //             <Filter className="mr-2 h-4 w-4" /> Filters
// // // //           </Button>
// // // //         </div>
// // // //       </div>

// // // //       {showFilters && (
// // // //         <Card>
// // // //           <CardContent className="pt-6">
// // // //             <div className="grid md:grid-cols-3 gap-4">
// // // //               {/* Filter Type Tabs */}
// // // //               <div>
// // // //                 <Label>Filter By</Label>
// // // //                 <Tabs 
// // // //                   defaultValue="doctors"
// // // //                   value={activeFilterTab}
// // // //                   onValueChange={(value) => {
// // // //                     setActiveFilterTab(value);
// // // //                     // Reset specialty when switching tabs
// // // //                     setSelectedSpecialty("");
// // // //                   }}
// // // //                   className="mt-2"
// // // //                 >
// // // //                   <TabsList className="grid w-full grid-cols-2">
// // // //                     <TabsTrigger value="doctors">Doctors</TabsTrigger>
// // // //                     <TabsTrigger value="hospitals">Hospitals</TabsTrigger>
// // // //                   </TabsList>
// // // //                 </Tabs>
// // // //               </div>

// // // //               {/* Specialty/Department Dropdown */}
// // // //               <div>
// // // //                 <Label>{getSpecialtyLabel()}</Label>
// // // //                 <Select
// // // //                   value={selectedSpecialty}
// // // //                   onValueChange={setSelectedSpecialty}
// // // //                 >
// // // //                   <SelectTrigger className="mt-1">
// // // //                     <SelectValue placeholder={`Select ${activeFilterTab === "doctors" ? "specialty" : "department"}`} />
// // // //                   </SelectTrigger>
// // // //                   <SelectContent>
// // // //                     <SelectItem value="all">
// // // //                       {activeFilterTab === "doctors" ? "All Specialties" : "All Departments"}
// // // //                     </SelectItem>
// // // //                     {activeFilterTab === "doctors" 
// // // //                       ? doctorSpecialties.map((s) => (
// // // //                           <SelectItem key={s} value={s}>
// // // //                             {s}
// // // //                           </SelectItem>
// // // //                         ))
// // // //                       : departments.map((d) => (
// // // //                           <SelectItem key={d} value={d}>
// // // //                             {d}
// // // //                           </SelectItem>
// // // //                         ))
// // // //                     }
// // // //                   </SelectContent>
// // // //                 </Select>
// // // //                 {activeFilterTab === "hospitals" && (
// // // //                   <p className="text-xs text-muted-foreground mt-1">
// // // //                     Select a department to filter hospitals
// // // //                   </p>
// // // //                 )}
// // // //               </div>

// // // //               {/* City/Location Filter */}
// // // //               <div>
                
// // // //                 <Label>City</Label>
// // // //                 <Select
// // // //                   value={locationFilter}
// // // //                   onValueChange={setLocationFilter}
// // // //                 >
// // // //                   <SelectTrigger className="mt-1">
// // // //                     <SelectValue placeholder="Select city" />
// // // //                   </SelectTrigger>
// // // //                   <SelectContent>
// // // //                     <SelectItem value="all">All Cities</SelectItem>
// // // //                     {cities.map((city) => (
// // // //                       <SelectItem key={city} value={city}>
// // // //                         {city}
// // // //                       </SelectItem>
// // // //                     ))}
// // // //                   </SelectContent>
// // // //                 </Select>
// // // //               </div>

// // // //               {/* Area/Location Input (optional) */}
// // // //               <div className="md:col-span-3">
// // // //                 <Label>Area/Locality</Label>
// // // //                 <Input
// // // //                   placeholder="Enter specific area or landmark (optional)"
// // // //                   value={locationFilter === "all" ? "" : locationFilter}
// // // //                   onChange={(e) => setLocationFilter(e.target.value)}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           </CardContent>
// // // //         </Card>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SearchHeader;
// // // import React from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Card, CardContent } from "@/components/ui/card";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import { MapPin, Filter, Search, X } from "lucide-react";

// // // interface SearchHeaderProps {
// // //   searchQuery: string;
// // //   setSearchQuery: (query: string) => void;
// // //   locationFilter: string;
// // //   setLocationFilter: (location: string) => void;
// // //   selectedSpecialty: string;
// // //   setSelectedSpecialty: (specialty: string) => void;
// // //   activeFilterTab: string;
// // //   setActiveFilterTab: (tab: string) => void;
// // //   showFilters: boolean;
// // //   setShowFilters: (show: boolean) => void;
// // //   onSearch: () => void;
// // //   onDetectLocation: () => void;
// // //   doctorSpecialties: string[];
// // //   hospitalDepartments: string[];
// // //   cities: string[];
// // // }

// // // const SearchHeader: React.FC<SearchHeaderProps> = ({
// // //   searchQuery,
// // //   setSearchQuery,
// // //   locationFilter,
// // //   setLocationFilter,
// // //   selectedSpecialty,
// // //   setSelectedSpecialty,
// // //   activeFilterTab,
// // //   setActiveFilterTab,
// // //   showFilters,
// // //   setShowFilters,
// // //   onSearch,
// // //   onDetectLocation,
// // //   doctorSpecialties,
// // //   hospitalDepartments,
// // //   cities,
// // // }) => {
// // //   const handleKeyPress = (e: React.KeyboardEvent) => {
// // //     if (e.key === 'Enter') {
// // //       onSearch();
// // //     }
// // //   };

// // //   const clearSearch = () => {
// // //     setSearchQuery("");
// // //     onSearch();
// // //   };

// // //   // Predefined hospital departments if none provided
// // //   const defaultHospitalDepartments = [
// // //     "General Medicine",
// // //     "Cardiology",
// // //     "Neurology",
// // //     "Orthopedics",
// // //     "Pediatrics",
// // //     "Gynecology",
// // //     "Surgery",
// // //     "Emergency",
// // //     "ICU",
// // //     "Radiology",
// // //     "Pathology",
// // //     "Dermatology",
// // //     "ENT",
// // //     "Ophthalmology",
// // //     "Psychiatry",
// // //     "Physiotherapy",
// // //     "Dental",
// // //     "Ayurveda",
// // //     "Homeopathy",
// // //     "Dietetics"
// // //   ];

// // //   const departments = hospitalDepartments.length > 0 ? hospitalDepartments : defaultHospitalDepartments;

// // //   // Get the current placeholder based on active tab
// // //   const getPlaceholder = () => {
// // //     if (activeFilterTab === "doctors") {
// // //       return "Search by doctor name, specialty, hospital, or location...";
// // //     } else if (activeFilterTab === "hospitals") {
// // //       return "Search by hospital name, department, city, or services...";
// // //     }
// // //     return "Search doctors, hospitals, departments, or locations...";
// // //   };

// // //   // Get the label for the specialty/department field
// // //   const getSpecialtyLabel = () => {
// // //     return activeFilterTab === "doctors" ? "Search Specialty" : "Hospital Department";
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       <div className="flex flex-col md:flex-row gap-4">
// // //         <div className="flex-1">
// // //           <Label htmlFor="search" className="text-lg font-semibold">
// // //             {activeFilterTab === "doctors" ? "Search Doctors" : 
// // //              activeFilterTab === "hospitals" ? "Search Hospitals" : "Search Healthcare"}
// // //           </Label>
// // //           <div className="flex gap-2 mt-1">
// // //             <div className="relative flex-1">
// // //               <Input
// // //                 id="search"
// // //                 placeholder={getPlaceholder()}
// // //                 value={searchQuery}
// // //                 onChange={(e) => setSearchQuery(e.target.value)}
// // //                 onKeyPress={handleKeyPress}
// // //                 className="flex-1 pr-10"
// // //               />
// // //               {searchQuery && (
// // //                 <button
// // //                   onClick={clearSearch}
// // //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
// // //                 >
// // //                   <X className="h-4 w-4" />
// // //                 </button>
// // //               )}
// // //             </div>
// // //             <Button onClick={onSearch} className="px-8 bg-blue-600 hover:bg-blue-700">
// // //               <Search className="mr-2 h-4 w-4" /> Search
// // //             </Button>
// // //           </div>
// // //         </div>

// // //         {/* <div className="flex gap-2 items-end">
// // //           <Button onClick={onDetectLocation} variant="outline" className="border-blue-200 hover:bg-blue-50">
// // //             <MapPin className="mr-2 h-4 w-4 text-blue-600" /> Near Me
// // //           </Button>
// // //           <Button
// // //             variant="outline"
// // //             onClick={() => setShowFilters(!showFilters)}
// // //             className={showFilters ? "bg-blue-50 border-blue-300" : ""}
// // //           >
// // //             <Filter className="mr-2 h-4 w-4" /> Filters
// // //           </Button>
// // //         </div> */}
// // //       </div>

// // //       {/* {showFilters && ( */}
// // //         <Card className="border-blue-200 shadow-md">
// // //           <CardContent className="pt-6">
// // //             <div className="grid md:grid-cols-3 gap-6">
// // //               {/* Filter Type Tabs */}
// // //               {/* <div>
// // //                 <Label className="text-sm font-semibold">Filter By</Label>
// // //                 <Tabs 
// // //                   defaultValue="doctors"
// // //                   value={activeFilterTab}
// // //                   onValueChange={(value) => {
// // //                     setActiveFilterTab(value);
// // //                     setSelectedSpecialty("all");
// // //                   }}
// // //                   className="mt-2"
// // //                 >
// // //                   <TabsList className="grid w-full grid-cols-2">
// // //                     <TabsTrigger value="doctors" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
// // //                       Doctors
// // //                     </TabsTrigger>
// // //                     <TabsTrigger value="hospitals" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
// // //                       Hospitals
// // //                     </TabsTrigger>
// // //                   </TabsList>
// // //                 </Tabs>
// // //               </div> */}
// // //               {activeFilterTab === "hospitals" && (
// // // <div>
// // //               <label className="block text-sm font-medium text-gray-700 mb-1">Facility Type</label>
// // //               <select
// // //                 value={filters.facilityType}
// // //                 onChange={(e) => handleFilterChange('facilityType', e.target.value)}
// // //                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //               >
// // //                 <option value="">All Types</option>
// // //                 {availableFacilityTypes.map(type => (
// // //                   <option key={type} value={type}>{type}</option>
// // //                 ))}
// // //               </select>
// // //             </div>)}
// // //               {/* Specialty/Department Dropdown */}
// // //               <div>
// // //                 <Label className="text-sm font-semibold">{getSpecialtyLabel()}</Label>
// // //                 <Select
// // //                   value={selectedSpecialty}
// // //                   onValueChange={setSelectedSpecialty}
// // //                 >
// // //                   <SelectTrigger className="mt-2">
// // //                     <SelectValue placeholder={`Select ${activeFilterTab === "doctors" ? "specialty" : "department"}`} />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">
// // //                       {activeFilterTab === "doctors" ? "All Specialties" : "All Departments"}
// // //                     </SelectItem>
// // //                     {activeFilterTab === "doctors" 
// // //                       ? doctorSpecialties.map((s) => (
// // //                           <SelectItem key={s} value={s}>
// // //                             {s}
// // //                           </SelectItem>
// // //                         ))
// // //                       : departments.map((d) => (
// // //                           <SelectItem key={d} value={d}>
// // //                             {d}
// // //                           </SelectItem>
// // //                         ))
// // //                     }
// // //                   </SelectContent>
// // //                 </Select>
// // //                 {activeFilterTab === "hospitals" && (
// // //                   <p className="text-xs text-muted-foreground mt-1">
// // //                     Filter hospitals by department
// // //                   </p>
// // //                 )}
// // //               </div>

// // //               {/* City/Location Filter */}
// // //               {activeFilterTab === "hospitals" && (
// // //               <div>
// // //                 <Label className="text-sm font-semibold">City</Label>
// // //                 <Select
// // //                   value={locationFilter}
// // //                   onValueChange={setLocationFilter}
// // //                 >
// // //                   <SelectTrigger className="mt-2">
// // //                     <SelectValue placeholder="Select city" />
// // //                   </SelectTrigger>
// // //                   <SelectContent>
// // //                     <SelectItem value="all">All Cities</SelectItem>
// // //                     {cities.map((city) => (
// // //                       <SelectItem key={city} value={city}>
// // //                         {city}
// // //                       </SelectItem>
// // //                     ))}
// // //                   </SelectContent>
// // //                 </Select>
// // //               </div>)}

// // //               {/* Area/Locality Input */}
// // //               {/* <div className="md:col-span-3">
// // //                 <Label className="text-sm font-semibold">Area/Locality (Optional)</Label>
// // //                 <Input
// // //                   placeholder="Enter specific area, landmark, or pincode"
// // //                   value={locationFilter === "all" ? "" : locationFilter}
// // //                   onChange={(e) => setLocationFilter(e.target.value)}
// // //                   className="mt-2"
// // //                 />
// // //               </div> */}

// // //               {/* Active Filters Display */}
// // //               {(searchQuery || (selectedSpecialty && selectedSpecialty !== "all") || (locationFilter && locationFilter !== "all")) && (
// // //                 <div className="md:col-span-3 mt-2 p-3 bg-blue-50 rounded-lg">
// // //                   <div className="flex items-center justify-between">
// // //                     <span className="text-sm font-medium text-blue-700">Active Filters:</span>
// // //                     <Button
// // //                       variant="ghost"
// // //                       size="sm"
// // //                       onClick={() => {
// // //                         setSearchQuery("");
// // //                         setSelectedSpecialty("all");
// // //                         setLocationFilter("all");
// // //                         onSearch();
// // //                       }}
// // //                       className="text-blue-600 hover:text-blue-800"
// // //                     >
// // //                       Clear All
// // //                     </Button>
// // //                   </div>
// // //                   <div className="flex flex-wrap gap-2 mt-2">
// // //                     {searchQuery && (
// // //                       <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
// // //                         Search: {searchQuery}
// // //                         <button onClick={() => { setSearchQuery(""); onSearch(); }} className="ml-1">
// // //                           <X className="h-3 w-3" />
// // //                         </button>
// // //                       </span>
// // //                     )}
// // //                     {selectedSpecialty && selectedSpecialty !== "all" && (
// // //                       <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
// // //                         {activeFilterTab === "doctors" ? "Specialty" : "Dept"}: {selectedSpecialty}
// // //                         <button onClick={() => setSelectedSpecialty("all")} className="ml-1">
// // //                           <X className="h-3 w-3" />
// // //                         </button>
// // //                       </span>
// // //                     )}
// // //                     {locationFilter && locationFilter !== "all" && (
// // //                       <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
// // //                         Location: {locationFilter}
// // //                         <button onClick={() => setLocationFilter("all")} className="ml-1">
// // //                           <X className="h-3 w-3" />
// // //                         </button>
// // //                       </span>
// // //                     )}
// // //                   </div>
// // //                 </div>
// // //               )}
// // //             </div>
// // //           </CardContent>
// // //         </Card>
// // //       {/* )} */}
// // //     </div>
// // //   );
// // // };

// // // export default SearchHeader;

// // import React, { useState, useEffect } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Search, X } from "lucide-react";
// // import { Country, State, City } from "country-state-city";
// // import {
// //   Command,
// //   CommandInput,
// //   CommandItem,
// //   CommandList,
// //   CommandEmpty,
// // } from "@/components/ui/command";
// // import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { supabase } from "@/integrations/supabase/client";

// // interface SearchHeaderProps {
// //   searchQuery: string;
// //   setSearchQuery: (query: string) => void;
// //   locationFilter: string;
// //   setLocationFilter: (location: string) => void;
// //   selectedSpecialty: string;
// //   setSelectedSpecialty: (specialty: string) => void;
// //   activeFilterTab: string;
// //   setActiveFilterTab: (tab: string) => void;
// //   showFilters: boolean;
// //   setShowFilters: (show: boolean) => void;
// //   onSearch: () => void;
// //   onDetectLocation: () => void;
// //   doctorSpecialties: string[];
// //   hospitalDepartments: string[];
// //   cities: string[];
// //   selectedDate?: string;
// // setSelectedDate?: (date: string) => void;
// //   // New props for facility type
// //   facilityType?: string;
// //   setFacilityType?: (type: string) => void;
// // }

// // const SearchHeader: React.FC<SearchHeaderProps> = ({
// //   searchQuery,
// //   setSearchQuery,
// //   locationFilter,
// //   setLocationFilter,
// //   selectedSpecialty,
// //   setSelectedSpecialty,
// //   activeFilterTab,
// //   setActiveFilterTab,
// //   showFilters,
// //   setShowFilters,
// //   onSearch,
// //   onDetectLocation,
// //   doctorSpecialties,
// //   hospitalDepartments,
// //   cities,
// //   selectedDate,
// // setSelectedDate,
// //   facilityType = "all",
// //   setFacilityType = () => {},
// // }) => {
// //   const [indianCities, setIndianCities] = useState<string[]>([]);
// //   const [search, setSearch] = useState("");

// //     const [user, setUser] = useState<any>(null); // Add user state
// // useEffect(() => {
// //   setActiveFilterTab("doctors");
// // }, []);

// //   // Get user on component mount
// //   useEffect(() => {
// //     const getUser = async () => {
// //       const { data: { user } } = await supabase.auth.getUser();
// //       setUser(user);
// //     };
// //     getUser();

// //     // Listen for auth changes
// //     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
// //       setUser(session?.user || null);
// //     });

// //     return () => {
// //       subscription?.unsubscribe();
// //     };
// //   }, []);

// // const filteredCities = indianCities.filter((city) =>
// //   city.toLowerCase().includes(search.toLowerCase())
// // );
// //   const handleKeyPress = (e: React.KeyboardEvent) => {
// //     if (e.key === 'Enter') {
// //       onSearch();
// //     }
// //   };

// //   const clearSearch = () => {
// //     setSearchQuery("");
// //     onSearch();
// //   };

// //   const handleFilterChange = (field: string, value: string) => {
// //     if (field === 'facilityType' && setFacilityType) {
// //       setFacilityType(value);
// //     }
// //   };


// //   // Get Indian cities on component mount
// //   useEffect(() => {
// //     const india = Country.getAllCountries().find(country => country.isoCode === 'IN');
// //     if (india) {
// //       const allIndianCities = City.getCitiesOfCountry('IN') || [];
// //       const cityNames = allIndianCities.map(city => city.name).sort();
// //       setIndianCities(cityNames);
// //     }
// //   }, []);

// //   // Predefined facility types
// //   const availableFacilityTypes = [
// //     "Hospital",
// //     "Clinic",
// //     "Diagnostic Center",
// //     "Pharmacy",
// //     "Nursing Home",
// //     "Medical Store",
// //     "Blood Bank",
// //     "Eye Care Center",
// //     "Dental Clinic",
// //     "Physiotherapy Center",
// //     "Physiotherapy", // Add this if database uses "Physiotherapy"
// //   "Physiotherapy Clinic", // Add this if database uses this format
// //   "Physical Therapy", // Add this if database uses this format
// //   "Rehabilitation Center", // Add if applicable
// //   "Wellness Center" // Add if applicable
// //   ];

// //   // Predefined hospital departments if none provided
// //   const defaultHospitalDepartments = [
// //     "General Medicine",
// //     "Cardiology",
// //     "Neurology",
// //     "Orthopedics",
// //     "Pediatrics",
// //     "Gynecology",
// //     "Surgery",
// //     "Emergency",
// //     "ICU",
// //     "Radiology",
// //     "Pathology",
// //     "Dermatology",
// //     "ENT",
// //     "Ophthalmology",
// //     "Psychiatry",
// //     "Physiotherapy",
// //     "Dental",
// //     "Ayurveda",
// //     "Homeopathy",
// //     "Dietetics"
// //   ];

// //   const departments = hospitalDepartments.length > 0 ? hospitalDepartments : defaultHospitalDepartments;
// // const getDayOfWeek = (dateStr: string) => {
// //   const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
// //   const d = new Date(dateStr);
// //   return days[d.getDay()];
// // };
// //   // Get the current placeholder based on active tab
// //   const getPlaceholder = () => {
// //     if (activeFilterTab === "doctors") {
// //       return "Search by doctor name, specialty, hospital, or location...";
// //     } else if (activeFilterTab === "hospitals") {
// //       return "Search by hospital name, department, city, or services...";
// //     }
// //     return "Search doctors, hospitals, departments, or locations...";
// //   };

// //   // Get the label for the specialty/department field
// //   const getSpecialtyLabel = () => {
// //     return activeFilterTab === "doctors" ? "Search Specialty" : "Hospital Department";
// //   };

// //   return (
// //     <div className="space-y-4">
// // <div>
// //   {user && (  // Fixed: removed the extra parentheses and used proper syntax
// //     <Tabs 
// //       defaultValue="doctors"
// //       value={activeFilterTab}
// //       onValueChange={(value) => {
// //         setActiveFilterTab(value);
// //         setSelectedSpecialty("all");
// //       }}
// //       className="mt-2"
// //     >
// //       <TabsList className="grid w-full grid-cols-2">
// //         <TabsTrigger value="doctors" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
// //           Doctors
// //         </TabsTrigger>
// //         <TabsTrigger value="hospitals" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
// //           Hospitals / Facility
// //         </TabsTrigger>
// //       </TabsList>
// //     </Tabs>
// //   )}
// // </div>
// //       <div className="flex flex-col md:flex-row gap-4">
// //         <div className="flex-1">
// //           <Label htmlFor="search" className="text-lg font-semibold">
// //             {activeFilterTab === "doctors" ? "Search Doctors" : 
// //              activeFilterTab === "hospitals" ? "Search Hospitals" : "Search Healthcare"}
// //           </Label>
// //           <div className="flex gap-2 mt-1">
// //             <div className="relative flex-1">
// //               <Input
// //                 id="search"
// //                 placeholder={getPlaceholder()}
// //                 value={searchQuery}
// //                 onChange={(e) => setSearchQuery(e.target.value)}
// //                 onKeyPress={handleKeyPress}
// //                 className="flex-1 pr-10"
// //               />
// //               {searchQuery && (
// //                 <button
// //                   onClick={clearSearch}
// //                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
// //                 >
// //                   <X className="h-4 w-4" />
// //                 </button>
// //               )}
// //             </div>
// //             <Button onClick={onSearch} className="px-8 bg-blue-600 hover:bg-blue-700">
// //               <Search className="mr-2 h-4 w-4" /> Search
// //             </Button>
// //           </div>
// //         </div>
// //       </div>

// //       <Card className="border-blue-200 shadow-md">
// //         <CardContent className="pt-6">
          
// //           <div className="grid md:grid-cols-3 gap-6">
// //             {/* Facility Type Filter - Only for hospitals */}
// //             {activeFilterTab === "hospitals" && (
// //               <div>
// //                 <Label className="text-sm font-semibold">Facility Type</Label>
// //                 <Select
// //                   value={facilityType}
// //                   onValueChange={(value) => handleFilterChange('facilityType', value)}
// //                 >
// //                   <SelectTrigger className="mt-2">
// //                     <SelectValue placeholder="All Types" />
// //                   </SelectTrigger>
// //                   <SelectContent>
// //                     <SelectItem value="all">All Types</SelectItem>
// //                     {availableFacilityTypes.map(type => (
// //                       <SelectItem key={type} value={type}>{type}</SelectItem>
// //                     ))}
// //                   </SelectContent>
// //                 </Select>
// //               </div>
// //             )}

// //             {/* Specialty/Department Dropdown */}
// //             <div>
// //               <Label className="text-sm font-semibold">{getSpecialtyLabel()}</Label>
// //               <Select
// //                 value={selectedSpecialty}
// //                 onValueChange={setSelectedSpecialty}
// //               >
// //                 <SelectTrigger className="mt-2">
// //                   <SelectValue placeholder={`Select ${activeFilterTab === "doctors" ? "specialty" : "department"}`} />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="all">
// //                     {activeFilterTab === "doctors" ? "All Specialties" : "All Departments"}
// //                   </SelectItem>
// //                   {activeFilterTab === "doctors" 
// //                     ? doctorSpecialties.map((s) => (
// //                         <SelectItem key={s} value={s}>
// //                           {s}
// //                         </SelectItem>
// //                       ))
// //                     : departments.map((d) => (
// //                         <SelectItem key={d} value={d}>
// //                           {d}
// //                         </SelectItem>
// //                       ))
// //                   }
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div>
// //   <Label className="text-sm font-semibold">Select Date</Label>
// //   <Input
// //     type="date"
// //     value={selectedDate}
// //     onChange={(e) => setSelectedDate?.(e.target.value)}
// //     className="mt-2"
// //   />
// // </div>

// //             {/* City/Location Filter with Search */}
// //             <div>
// //               <Label className="text-sm font-semibold">City</Label>
// //               <Select
// //                 value={locationFilter}
// //                 onValueChange={setLocationFilter}
// //               >
// //                 <SelectTrigger className="mt-2">
// //                   <SelectValue placeholder="Select city" />
// //                 </SelectTrigger>
// //                 <SelectContent className="max-h-[300px]">
// //                   <SelectItem value="all">All Cities</SelectItem>
// //                   {indianCities.map((city) => (
// //                     <SelectItem key={city} value={city}>
// //                       {city}
// //                     </SelectItem>
// //                   ))}
// //                 </SelectContent>
// //               </Select>
// //               <p className="text-xs text-muted-foreground mt-1">
// //                 Showing cities in India only
// //               </p>
// //             </div>
// //             {/* <div>
// //   <Label className="text-sm font-semibold">City</Label>

// //   <Select value={locationFilter} onValueChange={setLocationFilter}>
// //     <SelectTrigger className="mt-2">
// //       <SelectValue placeholder="Select city" />
// //     </SelectTrigger>

// //     <SelectContent className="p-0">
// //       <Command>
// //         <CommandInput placeholder="Search city..." />

// //         <CommandList>
// //           <CommandEmpty>No city found.</CommandEmpty>

// //           <CommandItem onSelect={() => setLocationFilter("all")}>
// //             All Cities
// //           </CommandItem>

// //           {indianCities.map((city) => (
// //             <CommandItem
// //               key={city}
// //               value={city}
// //               onSelect={() => setLocationFilter(city)}
// //             >
// //               {city}
// //             </CommandItem>
// //           ))}
// //         </CommandList>
// //       </Command>
// //     </SelectContent>
// //   </Select>

// //   <p className="text-xs text-muted-foreground mt-1">
// //     Showing cities in India only
// //   </p>
// // </div> */}
  

// //             {/* Active Filters Display */}
// //             {(searchQuery || (selectedSpecialty && selectedSpecialty !== "all") || 
// //               (locationFilter && locationFilter !== "all") || (facilityType && facilityType !== "all")) && (
// //               <div className="md:col-span-3 mt-2 p-3 bg-blue-50 rounded-lg">
// //                 <div className="flex items-center justify-between">
// //                   <span className="text-sm font-medium text-blue-700">Active Filters:</span>
// //                   <Button
// //                     variant="ghost"
// //                     size="sm"
// //                     onClick={() => {
// //                       setSearchQuery("");
// //                       setSelectedSpecialty("all");
// //                       setLocationFilter("all");
// //                       if (setFacilityType) setFacilityType("all");
// //                       onSearch();
// //                     }}
// //                     className="text-blue-600 hover:text-blue-800"
// //                   >
// //                     Clear All
// //                   </Button>
// //                 </div>
// //                 <div className="flex flex-wrap gap-2 mt-2">
// //                   {searchQuery && (
// //                     <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
// //                       Search: {searchQuery}
// //                       <button onClick={() => { setSearchQuery(""); onSearch(); }} className="ml-1">
// //                         <X className="h-3 w-3" />
// //                       </button>
// //                     </span>
// //                   )}
// //                   {selectedSpecialty && selectedSpecialty !== "all" && (
// //                     <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
// //                       {activeFilterTab === "doctors" ? "Specialty" : "Dept"}: {selectedSpecialty}
// //                       <button onClick={() => setSelectedSpecialty("all")} className="ml-1">
// //                         <X className="h-3 w-3" />
// //                       </button>
// //                     </span>
// //                   )}
// //                   {locationFilter && locationFilter !== "all" && (
// //                     <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
// //                       City: {locationFilter}
// //                       <button onClick={() => setLocationFilter("all")} className="ml-1">
// //                         <X className="h-3 w-3" />
// //                       </button>
// //                     </span>
// //                   )}
// //                   {facilityType && facilityType !== "all" && activeFilterTab === "hospitals" && (
// //                     <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
// //                       Type: {facilityType}
// //                       <button onClick={() => setFacilityType("all")} className="ml-1">
// //                         <X className="h-3 w-3" />
// //                       </button>
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>
// //             )}
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };

// // export default SearchHeader;

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Search, X } from "lucide-react";
// import { Country, State, City } from "country-state-city";
// import {
//   Command,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandEmpty,
// } from "@/components/ui/command";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { supabase } from "@/integrations/supabase/client";

// interface SearchHeaderProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   locationFilter: string;
//   setLocationFilter: (location: string) => void;
//   selectedSpecialty: string;
//   setSelectedSpecialty: (specialty: string) => void;
//   activeFilterTab: string;
//   setActiveFilterTab: (tab: string) => void;
//   showFilters: boolean;
//   setShowFilters: (show: boolean) => void;
//   onSearch: () => void;
//   onDetectLocation: () => void;
//   doctorSpecialties: string[];
//   hospitalDepartments: string[];
//   cities: string[];
//   selectedDate?: string;
//   setSelectedDate?: (date: string) => void;
//   facilityType?: string;
//   setFacilityType?: (type: string) => void;
// }

// const SearchHeader: React.FC<SearchHeaderProps> = ({
//   searchQuery,
//   setSearchQuery,
//   locationFilter,
//   setLocationFilter,
//   selectedSpecialty,
//   setSelectedSpecialty,
//   activeFilterTab,
//   setActiveFilterTab,
//   showFilters,
//   setShowFilters,
//   onSearch,
//   onDetectLocation,
//   doctorSpecialties,
//   hospitalDepartments,
//   cities,
//   selectedDate,
//   setSelectedDate,
//   facilityType = "all",
//   setFacilityType = () => {},
// }) => {
//   const [indianCities, setIndianCities] = useState<string[]>([]);
//   const [search, setSearch] = useState("");
//   const [user, setUser] = useState<any>(null);

//   // Get user on component mount
//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     getUser();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null);
//     });

//     return () => {
//       subscription?.unsubscribe();
//     };
//   }, []);
  
//   // If you want to fetch facility types from database dynamically
// useEffect(() => {
//   const fetchFacilityTypes = async () => {
//     const { data } = await supabase
//       .from("facilities")
//       .select("facility_type")
//       .not("facility_type", "is", null);
    
//     if (data) {
//       const uniqueTypes = [...new Set(data.map(f => f.facility_type))];
//       setFacilityTypes(uniqueTypes);
//     }
//   };
//   fetchFacilityTypes();
// }, []);

//   const filteredCities = indianCities.filter((city) =>
//     city.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       onSearch();
//     }
//   };

//   const clearSearch = () => {
//     setSearchQuery("");
//     onSearch();
//   };

//   const handleFilterChange = (field: string, value: string) => {
//     if (field === 'facilityType' && setFacilityType) {
//       setFacilityType(value);
//     }
//   };

//   // Get Indian cities on component mount
//   useEffect(() => {
//     const india = Country.getAllCountries().find(country => country.isoCode === 'IN');
//     if (india) {
//       const allIndianCities = City.getCitiesOfCountry('IN') || [];
//       const cityNames = allIndianCities.map(city => city.name).sort();
//       setIndianCities(cityNames);
//     }
//   }, []);

//   const availableFacilityTypes = [
//     "Hospital",
//     "Clinic",
//     "Diagnostic Center",
//     "Pharmacy",
//     "Nursing Home",
//     "Medical Store",
//     "Blood Bank",
//     "Eye Care Center",
//     "Dental Clinic",
//     "Physiotherapy Center",
//     "Physiotherapy",
//     "Physiotherapy Clinic",
//     "Physical Therapy",
//     "Rehabilitation Center",
//     "Wellness Center",
//       "Ayurveda Center" 
//   ];

//   const defaultHospitalDepartments = [
//     "General Medicine",
//     "Cardiology",
//     "Neurology",
//     "Orthopedics",
//     "Pediatrics",
//     "Gynecology",
//     "Surgery",
//     "Emergency",
//     "ICU",
//     "Radiology",
//     "Pathology",
//     "Dermatology",
//     "ENT",
//     "Ophthalmology",
//     "Psychiatry",
//     "Physiotherapy",
//     "Dental",
//     "Ayurveda",
//     "Homeopathy",
//     "Dietetics"
//   ];

//   const departments = hospitalDepartments.length > 0 ? hospitalDepartments : defaultHospitalDepartments;

//   const getPlaceholder = () => {
//     if (activeFilterTab === "doctors") {
//       return "Search by doctor name, specialty, hospital, or location...";
//     } else if (activeFilterTab === "hospitals") {
//       return "Search by hospital name, department, city, or services...";
//     }
//     return "Search doctors, hospitals, departments, or locations...";
//   };

//   const getSpecialtyLabel = () => {
//     return activeFilterTab === "doctors" ? "Search Specialty" : "Hospital Department";
//   };

//   return (
//     <div className="space-y-4">
//       <div>
//         {/* Always show tabs, but keep the current activeFilterTab value */}
//         {user &&(
//         <Tabs 
//           value={activeFilterTab}
//           onValueChange={(value) => {
//             setActiveFilterTab(value);
//             setSelectedSpecialty("all");
//           }}
//           className="mt-2"
//         >
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger 
//               value="doctors" 
//               className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
//             >
//               Doctors
//             </TabsTrigger>
//             <TabsTrigger 
//               value="hospitals" 
//               className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
//             >
//               Hospitals / Facility
//             </TabsTrigger>
//           </TabsList>
//         </Tabs>)}
//       </div>
      
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <Label htmlFor="search" className="text-lg font-semibold">
//             {activeFilterTab === "doctors" ? "Search Doctors" : 
//              activeFilterTab === "hospitals" ? "Search Hospitals" : "Search Healthcare"}
//           </Label>
//           <div className="flex gap-2 mt-1">
//             <div className="relative flex-1">
//               <Input
//                 id="search"
//                 placeholder={getPlaceholder()}
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-1 pr-10"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={clearSearch}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               )}
//             </div>
//             <Button onClick={onSearch} className="px-8 bg-blue-600 hover:bg-blue-700">
//               <Search className="mr-2 h-4 w-4" /> Search
//             </Button>
//           </div>
//         </div>
//       </div>

//       <Card className="border-blue-200 shadow-md">
//         <CardContent className="pt-6">
//           <div className="grid md:grid-cols-3 gap-6">
//             {/* Facility Type Filter - Only for hospitals */}
//             {activeFilterTab === "hospitals" && (
//               <div>
//                 <Label className="text-sm font-semibold">Facility Type</Label>
//                 <Select
//                   value={facilityType}
//                   onValueChange={(value) => handleFilterChange('facilityType', value)}
//                 >
//                   <SelectTrigger className="mt-2">
//                     <SelectValue placeholder="All Types" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Types</SelectItem>
//                     {availableFacilityTypes.map(type => (
//                       <SelectItem key={type} value={type}>{type}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {/* Specialty/Department Dropdown */}
//             <div>
//               <Label className="text-sm font-semibold">{getSpecialtyLabel()}</Label>
//               <Select
//                 value={selectedSpecialty}
//                 onValueChange={setSelectedSpecialty}
//               >
//                 <SelectTrigger className="mt-2">
//                   <SelectValue placeholder={`Select ${activeFilterTab === "doctors" ? "specialty" : "department"}`} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">
//                     {activeFilterTab === "doctors" ? "All Specialties" : "All Departments"}
//                   </SelectItem>
//                   {activeFilterTab === "doctors" 
//                     ? doctorSpecialties.map((s) => (
//                         <SelectItem key={s} value={s}>
//                           {s}
//                         </SelectItem>
//                       ))
//                     : departments.map((d) => (
//                         <SelectItem key={d} value={d}>
//                           {d}
//                         </SelectItem>
//                       ))
//                   }
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div>
//               <Label className="text-sm font-semibold">Select Date</Label>
//               <Input
//                 type="date"
//                 value={selectedDate}
//                 onChange={(e) => setSelectedDate?.(e.target.value)}
//                 className="mt-2"
//               />
//             </div>

//             {/* City/Location Filter with Search */}
//             <div>
//               <Label className="text-sm font-semibold">City</Label>
//               <Select
//                 value={locationFilter}
//                 onValueChange={setLocationFilter}
//               >
//                 <SelectTrigger className="mt-2">
//                   <SelectValue placeholder="Select city" />
//                 </SelectTrigger>
//                 <SelectContent className="max-h-[300px]">
//                   <SelectItem value="all">All Cities</SelectItem>
//                   {indianCities.map((city) => (
//                     <SelectItem key={city} value={city}>
//                       {city}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Showing cities in India only
//               </p>
//             </div>

//             {/* Active Filters Display */}
//             {(searchQuery || (selectedSpecialty && selectedSpecialty !== "all") || 
//               (locationFilter && locationFilter !== "all") || (facilityType && facilityType !== "all")) && (
//               <div className="md:col-span-3 mt-2 p-3 bg-blue-50 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium text-blue-700">Active Filters:</span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setSearchQuery("");
//                       setSelectedSpecialty("all");
//                       setLocationFilter("all");
//                       if (setFacilityType) setFacilityType("all");
//                       onSearch();
//                     }}
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     Clear All
//                   </Button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {searchQuery && (
//                     <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
//                       Search: {searchQuery}
//                       <button onClick={() => { setSearchQuery(""); onSearch(); }} className="ml-1">
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   )}
//                   {selectedSpecialty && selectedSpecialty !== "all" && (
//                     <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
//                       {activeFilterTab === "doctors" ? "Specialty" : "Dept"}: {selectedSpecialty}
//                       <button onClick={() => setSelectedSpecialty("all")} className="ml-1">
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   )}
//                   {locationFilter && locationFilter !== "all" && (
//                     <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
//                       City: {locationFilter}
//                       <button onClick={() => setLocationFilter("all")} className="ml-1">
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   )}
//                   {facilityType && facilityType !== "all" && activeFilterTab === "hospitals" && (
//                     <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
//                       Type: {facilityType}
//                       <button onClick={() => setFacilityType("all")} className="ml-1">
//                         <X className="h-3 w-3" />
//                       </button>
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SearchHeader;

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Country, State, City } from "country-state-city";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationFilter: string;
  setLocationFilter: (location: string) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  activeFilterTab: string;
  setActiveFilterTab: (tab: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  onSearch: () => void;
  onDetectLocation: () => void;
  doctorSpecialties: string[];
  hospitalDepartments: string[];
  cities: string[];
  selectedDate?: string;
  setSelectedDate?: (date: string) => void;
  facilityType?: string;
  setFacilityType?: (type: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  locationFilter,
  setLocationFilter,
  selectedSpecialty,
  setSelectedSpecialty,
  activeFilterTab,
  setActiveFilterTab,
  showFilters,
  setShowFilters,
  onSearch,
  onDetectLocation,
  doctorSpecialties,
  hospitalDepartments,
  cities,
  selectedDate,
  setSelectedDate,
  facilityType = "all",
  setFacilityType = () => {},
}) => {
  const [indianCities, setIndianCities] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [dynamicFacilityTypes, setDynamicFacilityTypes] = useState<string[]>([]);

  // Get user on component mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  // Fetch facility types from database dynamically
  useEffect(() => {
    const fetchFacilityTypes = async () => {
      const { data, error } = await supabase
        .from("facilities")
        .select("facility_type")
        .not("facility_type", "is", null);
      
      if (data && !error) {
        const uniqueTypes = [...new Set(data.map(f => f.facility_type))];
        setDynamicFacilityTypes(uniqueTypes);
      }
    };
    fetchFacilityTypes();
  }, []);

  const filteredCities = indianCities.filter((city) =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch();
  };

  const handleFilterChange = (field: string, value: string) => {
    if (field === 'facilityType' && setFacilityType) {
      setFacilityType(value);
    }
  };

  // Get Indian cities on component mount
  useEffect(() => {
    const india = Country.getAllCountries().find(country => country.isoCode === 'IN');
    if (india) {
      const allIndianCities = City.getCitiesOfCountry('IN') || [];
      const cityNames = allIndianCities.map(city => city.name).sort();
      setIndianCities(cityNames);
    }
  }, []);

  // Combine static and dynamic facility types
  // const staticFacilityTypes = [
  //   "Hospital",
  //   "Clinic",
  //   "Diagnostic Center",
  //   "Pharmacy",
  //   "Nursing Home",
  //   "Medical Store",
  //   "Blood Bank",
  //   "Eye Care Center",
  //   "Dental Clinic",
  //   "Physiotherapy Center",
  //   "Physiotherapy",
  //   "Physiotherapy Clinic",
  //   "Physical Therapy",
  //   "Rehabilitation Center",
  //   "Wellness Center",
  //   "Ayurveda Center"
  // ];
  const staticFacilityTypes = [
  "hospital",
  "clinic",
  "diagnostic-center",
  "pharmacy",
  "nursing-home",
  "medical-store",
  "blood-bank",
  "eye-care-center",
  "dental-clinic",
  "physiotherapy-center",
  "rehabilitation-center",
  "wellness-center",
  "ayurveda-center"
];

const formatFacilityType = (type) => {
  return type
    .replace(/-/g, " ")                // replace - with space
    .replace(/\b\w/g, c => c.toUpperCase()); // capitalize each word
};
  // Use dynamic types if available, otherwise use static types
  const availableFacilityTypes = dynamicFacilityTypes.length > 0 
    ? [...new Set([...staticFacilityTypes, ...dynamicFacilityTypes])] 
    : staticFacilityTypes;

  const defaultHospitalDepartments = [
    "General Medicine",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Surgery",
    "Emergency",
    "ICU",
    "Radiology",
    "Pathology",
    "Dermatology",
    "ENT",
    "Ophthalmology",
    "Psychiatry",
    "Physiotherapy",
    "Dental",
    "Ayurveda",
    "Homeopathy",
    "Dietetics"
  ];

  const departments = hospitalDepartments.length > 0 ? hospitalDepartments : defaultHospitalDepartments;

  const getPlaceholder = () => {
    if (activeFilterTab === "doctors") {
      return "Search by doctor name, specialty, hospital, or location...";
    } else if (activeFilterTab === "hospitals") {
      return "Search by hospital name, department, city, or services...";
    }
    return "Search doctors, hospitals, departments, or locations...";
  };

  const getSpecialtyLabel = () => {
    return activeFilterTab === "doctors" ? "Search Specialty" : "Hospital Department";
  };

  return (
    <div className="space-y-4">
      <div>
        {/* Always show tabs, but keep the current activeFilterTab value */}
        {user &&(
        <Tabs 
          value={activeFilterTab}
          onValueChange={(value) => {
            setActiveFilterTab(value);
            setSelectedSpecialty("all");
          }}
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger 
              value="doctors" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Doctors
            </TabsTrigger>
            <TabsTrigger 
              value="hospitals" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Hospitals / Facility
            </TabsTrigger>
          </TabsList>
        </Tabs>)}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="text-lg font-semibold">
            {activeFilterTab === "doctors" ? "Search Doctors" : 
             activeFilterTab === "hospitals" ? "Search Hospitals" : "Search Healthcare"}
          </Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <Input
                id="search"
                placeholder={getPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={onSearch} className="px-8 bg-blue-600 hover:bg-blue-700">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-blue-200 shadow-md">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Facility Type Filter - Only for hospitals */}
            {activeFilterTab === "hospitals" && (
              <div>
                <Label className="text-sm font-semibold">Facility Type</Label>
                <Select
                  value={facilityType}
                  onValueChange={(value) => handleFilterChange('facilityType', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {/* {availableFacilityTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))} */}
                    {availableFacilityTypes.map(type => (
  <SelectItem key={type} value={type}>
    {formatFacilityType(type)}
  </SelectItem>
))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Specialty/Department Dropdown */}
            <div>
              <Label className="text-sm font-semibold">{getSpecialtyLabel()}</Label>
              <Select
                value={selectedSpecialty}
                onValueChange={setSelectedSpecialty}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={`Select ${activeFilterTab === "doctors" ? "specialty" : "department"}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {activeFilterTab === "doctors" ? "All Specialties" : "All Departments"}
                  </SelectItem>
                  {activeFilterTab === "doctors" 
                    ? doctorSpecialties.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))
                    : departments.map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-semibold">Select Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate?.(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* City/Location Filter with Search */}
            <div>
              <Label className="text-sm font-semibold">City</Label>
              <Select
                value={locationFilter}
                onValueChange={setLocationFilter}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all">All Cities</SelectItem>
                  {indianCities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Showing cities in India only
              </p>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || (selectedSpecialty && selectedSpecialty !== "all") || 
              (locationFilter && locationFilter !== "all") || (facilityType && facilityType !== "all")) && (
              <div className="md:col-span-3 mt-2 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Active Filters:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSpecialty("all");
                      setLocationFilter("all");
                      if (setFacilityType) setFacilityType("all");
                      onSearch();
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchQuery && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Search: {searchQuery}
                      <button onClick={() => { setSearchQuery(""); onSearch(); }} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedSpecialty && selectedSpecialty !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {activeFilterTab === "doctors" ? "Specialty" : "Dept"}: {selectedSpecialty}
                      <button onClick={() => setSelectedSpecialty("all")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {locationFilter && locationFilter !== "all" && (
                    <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                      City: {locationFilter}
                      <button onClick={() => setLocationFilter("all")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {facilityType && facilityType !== "all" && activeFilterTab === "hospitals" && (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                      Type: {facilityType}
                      <button onClick={() => setFacilityType("all")} className="ml-1">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchHeader;