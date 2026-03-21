export type UserRole = 'medicalProfessional'; 

export interface MedicalProfessional {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;         
  medicalSpeciality: string;         
  licenseNumber: string;
  graduationYear: number;
  medicalSchool:string,
  yearsOfExperience: number;
  consultationFees: number; 
  additionalQualifications?: string;
  aboutYourself?: string;
  kycVerified: boolean; 
  languagesKnown:string;
  isVerified:boolean;
   address: string,
    city: string,
    state: string,
    pincode: string,
    country_code:string,

}