export type UserRole = 'patient'; 

export interface Patient {
  firstName: string;
  lastName: string;
  phoneNumber: string;         
  dateOfBirth: string;         
  gender: string;
  bloodGroup: string;
  avatarUrl:string,
  emergencyContactName: string;
  emergencyContactPhone: string; 
  knownAllergies?: string;
  currentMedications?: string;
  userType: UserRole;        
  emailAddress: string;
}