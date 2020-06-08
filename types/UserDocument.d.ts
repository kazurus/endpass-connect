type UserDocument = {
  id: string;
  createdAt: number;
  status: string;
  documentType: string;
  areaType: string;
  description: string;
  firstName: string;
  lastName: string;
  number: number;
  dateOfBirth: number;
  dateOfIssue: number;
  dateOfExpiry: number;
  issuingCountry: string;
  issuingAuthority: string;
  issuingPlace: string;
  address: string;
  imgPath: string;
  rejectReason?: string;
};
