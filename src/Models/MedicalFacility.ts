
export interface MedicalFacility {
    facilityName: string,
    emailAddress: string;  
    facilityType: string,
    phoneNumber: string,
    address: string,
    city: string,
    state: string,
    pincode: string,
    latitude: number,
    longitude: number,
    licenseNumber: string,
    establishedYear: number,
    totalBeds: number,
    departments: string[],
    emergencyServices: boolean,
    ambulanceService: boolean,
    onlineConsultation: boolean,
    homeVisit: boolean,
    insurancePartners: string,
    operatingHours: string,
    website: string,
    aboutFacility: string
}