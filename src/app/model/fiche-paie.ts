import { Consultant } from './consultant';

export class FichePaie {
  id: number;
  createdDate: Date;

  countryCode: string;
  payrollProfileCode: string;
  conventionCollective: string;
  statut: string;
  currency: string;

  periodYear: number;
  periodMonth: number;

  baseBrut: number;
  primeAnciennete: number;
  primeVariable: number;
  avantagesNature: number;

  totalBrut: number;
  employeeContributionRate: number;
  employerContributionRate: number;
  employeeContributionAmount: number;
  employerContributionAmount: number;

  pasRate: number;
  pasAmount: number;

  netImposable: number;
  netAPayer: number;
  coutEmployeur: number;

  commentaire: string;
  sourceCraId: number;

  bulletinNumber: string;

  companyName: string;
  companyStreet: string;
  companyZipCode: string;
  companyCity: string;
  companySiret: string;
  companyCodeNaf: string;
  companyUrssaf: string;

  employeeSocialSecurityNumber: string;
  employeeJobTitle: string;
  employeeProfessionalStatus: string;
  employeeLevel: string;
  employeeCoefficient: string;
  employeeEntryDate: Date;
  employeeAnciennete: string;
  employeeStreet: string;
  employeeZipCode: string;
  employeeCity: string;

  monthlyHours: number;
  monthlyOvertimeHours: number;
  plafondSs: number;
  allegements: number;
  annualBrut: number;
  annualNetImposable: number;
  annualEmployeeContributionAmount: number;
  annualEmployerContributionAmount: number;
  annualCoutEmployeur: number;
  annualNetAPayer: number;

  congesAcquis: number;
  congesPris: number;
  congesSolde: number;

  paymentDate: Date;
  paymentMode: string;

  consultant: Consultant;
  consultantId: number;
  consultantFirstName: string;
  consultantLastName: string;
}
