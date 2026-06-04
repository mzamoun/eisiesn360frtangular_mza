import { Abonnement } from "./abonnement";
import { ActivityType } from "./activityType";
import { Address } from "./address";
import { Client } from "./client";
import { Consultant } from "./consultant";

export class Esn {
  createdDate: Date;
  id: number;
  name: string;
  metier: string;
  address: Address = new Address();
  tel: string;
  webSite: string;
  email: string;
  payrollSiret: string;
  payrollCodeNaf: string;
  payrollUrssaf: string;
  payrollConventionCollective: string;

  listResp : Consultant[];
  
  listConsultant : Consultant[];
  listConsultantIds : number[];

  listClientIds: number[];
  listClient: Client[];

  listActivityType : ActivityType[]
  listActivityTypeIds : number[]

  abonnement: Abonnement = new Abonnement();
}
