/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Sex = 'Male' | 'Female';
export type MemberType = 'Principal Member' | 'Dependent';
export type RegistrationStatus = 'New Registration' | 'Reactivation';
export type HDType = 'Low flux' | 'High flux' | 'Others';
export type PDSystem = 'CAPD' | 'CIPD-C' | 'CIPD-M' | 'CCPD' | 'NIPD';
export type RecordStatus = 'Active' | 'Pending' | 'Archived';

export interface PatientName {
  last: string;
  first: string;
  extension: string;
  middle: string;
}

export interface Address {
  unit: string;
  building: string;
  lot: string;
  street: string;
  subdivision: string;
  barangay: string;
  city: string;
  province: string;
  country: string;
  zip: string;
}

export interface ContactInfo {
  email: string;
  mobile: string;
  landline: string;
}

export interface ZBenefits {
  pdFirstPolicy: boolean;
  kidneyTransplant: boolean;
}

export interface PreviousAvailment {
  kidneyTransplant: boolean;
}

export interface HDDetails {
  type: HDType;
  othersDetail?: string;
}

export interface PDDetails {
  system: PDSystem | '';
}

export interface RegistrationAdmin {
  pddRegNo: string;
  registeredBy: string;
  accreditationNo: string;
  registrationDate: string;
}

export interface PDDRegistration {
  id: string;
  regType: RegistrationStatus;
  pin: string;
  patientName: PatientName;
  memberType: MemberType;
  dob: string;
  sex: Sex;
  civilStatus: string;
  address: Address;
  contact: ContactInfo;
  zBenefits: ZBenefits;
  previousAvailment: PreviousAvailment;
  dialysisStartDate: string;
  hdDetails: HDDetails;
  pdDetails: PDDetails;
  admin: RegistrationAdmin;
  recordStatus: RecordStatus;
  createdAt: string;
}
