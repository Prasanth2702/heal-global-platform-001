// types/facility.ts
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  phone_number: string;
  role: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  full_name?: string;
}

export interface Ward {
  id: string;
  facility_id: string;
  ward_code: string;
  name: string;
  description: string;
  ward_type: string;
  floor_number: number;
  wing: string;
  phone_extension: string;
  head_nurse_id: string;
  total_beds: number;
  available_beds: number;
  reserved_beds: number;
  is_active: boolean;
  is_operational: boolean;
  emergency_contact: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  head_nurse?: Profile;
  occupancyRate?: number;
  operatingHours?: {
    start: string;
    end: string;
  };
}

export type BedType =
  | "ICU"
  | "CCU"
  | "NICU"
  | "PICU"
  | "GENERAL"
  | "PRIVATE"
  | "SEMI_PRIVATE"
  | "ISOLATION"
  | "BURN_UNIT"
  | "CARDIAC"
  | "NEURO"
  | "MATERNITY"
  | "PEDIATRIC"
  | "PSYCHIATRIC"
  | "REHABILITATION"
  | "STEP_DOWN"
  | "EMERGENCY";

export type BedStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "MAINTENANCE"
  | "CLEANING"
  | "RESERVED"
  | "OUT_OF_SERVICE";

export interface Bed {
  id: string;
  facility_id: string;
  ward_id: string;
  bed_number: string;
  bed_label: string;
  bed_type: BedType;
  room_number: string;
  floor_number: number;
  wing: string;
  current_status: BedStatus;
  status_notes: string;
  has_oxygen: boolean;
  has_suction: boolean;
  has_monitor: boolean;
  has_ventilator: boolean;
  has_cpip: boolean;
  has_infusion_pump: boolean;
  is_bariatric: boolean;
  is_isolation: boolean;
  is_negative_pressure: boolean;
  is_wheelchair_accessible: boolean;
  width_cm: number;
  length_cm: number;
  max_weight_kg: number;
  electrical_outlets: number;
  is_active: boolean;
  last_maintenance_date: string;
  next_maintenance_date: string;
  maintenance_notes: string;
  purchase_date: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  booking?: BedBooking;
  ward?: Ward;
  isOccupied?: boolean;
  equipment?: string[];
  maintenance?: boolean;
}

export interface Patient {
  id: string;
  user_id: string;
  date_of_birth: string;
  gender: "Male" | "Female" | "Other";
  emergency_contact_name: string;
  blood_group: string;
  emergency_contact_number: string;
  known_allergies: string;
  current_medications: string;
  created_at: string;
  updated_at: string;
  patient_profile_id: string;
  profile?: Profile;
  age?: number;
  name?: string;
  admissionDate?: string;
  diagnosis?: string;
  doctor?: string;
  contact?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  allergies?: string[];
  status?: "Admitted" | "Discharged" | "Critical" | "Pending";
  priority?: "low" | "medium" | "high" | "emergency";
  insurance?: string;
  roomPreferences?: string[];
}

export interface BedBooking {
  id: string;
  booking_reference: string;
  facility_id: string;
  patient_id: string;
  admission_type: string;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  allergies: string;
  special_instructions: string;
  required_bed_type: BedType;
  special_requirements: string[];
  referring_doctor_id: string;
  attending_doctor_id: string;
  primary_nurse_id: string;
  assigned_bed_id: string;
  assigned_ward_id: string;
  expected_admission_date: string;
  expected_discharge_date: string;
  actual_admission_time: string;
  actual_discharge_time: string;
  status: string;
  patient_type: string;
  priority: string;
  cancellation_reason: string;
  insurance_provider: string;
  insurance_policy_number: string;
  insurance_verified_by: string;
  insurance_verified_at: string;
  estimated_cost: number;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
  bed?: Bed;
  ward?: Ward;
  referring_doctor?: Profile;
  attending_doctor?: Profile;
  primary_nurse?: Profile;
}

// components/facility/types.ts
export interface Ward {
  id: string;
  facility_id: string;
  ward_code: string;
  name: string;
  description: string;
  ward_type: string;
  floor_number: number;
  wing: string;
  phone_extension: string;
  head_nurse_id: string;
  total_beds: number;
  available_beds: number;
  reserved_beds: number;
  is_active: boolean;
  is_operational: boolean;
  emergency_contact: string;
  created_at: string;
  updated_at: string;
}





export interface Bed {
  id: string;
  facility_id: string;
  ward_id: string;
  bed_number: string;
  bed_label: string;
  bed_type: BedType;
  room_number: string;
  floor_number: number;
  wing: string;
  current_status: BedStatus;
  status_notes: string;
  has_oxygen: boolean;
  has_suction: boolean;
  has_monitor: boolean;
  has_ventilator: boolean;
  has_cpip: boolean;
  has_infusion_pump: boolean;
  is_bariatric: boolean;
  is_isolation: boolean;
  is_negative_pressure: boolean;
  is_wheelchair_accessible: boolean;
  width_cm: number;
  length_cm: number;
  max_weight_kg: number;
  electrical_outlets: number;
  is_active: boolean;
  last_maintenance_date: string;
  next_maintenance_date: string;
  maintenance_notes: string;
  purchase_date: string;
  created_at: string;
  updated_at: string;
}

export interface BedBooking {
  id: string;
  booking_reference: string;
  facility_id: string;
  patient_id: string;
  admission_type: string;
  primary_diagnosis: string;
  secondary_diagnosis: string;
  allergies: string;
  special_instructions: string;
  required_bed_type: BedType;
  special_requirements: string[];
  assigned_bed_id: string;
  assigned_ward_id: string;
  expected_admission_date: string;
  expected_discharge_date: string;
  actual_admission_time: string;
  actual_discharge_time: string;
  status: string;
  patient_type: string;
  priority: string;
  insurance_provider: string;
  insurance_policy_number: string;
  created_at: string;
  updated_at: string;
}