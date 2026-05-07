export type AbonnementStatus = 'free' | 'payed' | 'not_payed';
export type AbonnementPeriod = 'month' | 'year';

export class AbonnementPayement {
  date_pay: Date;
  montant: number;
}

export class Abonnement {
  status: AbonnementStatus;
  date_pay_start: Date;
  date_pay_end: Date;
  period_abonnement: AbonnementPeriod;
  montant: number;
  devise: string;
  list_payements: AbonnementPayement[];

  constructor() {
    this.status = 'free';
    this.period_abonnement = 'month';
    this.list_payements = [];
  }
}
