import { SupportExchange } from './support-exchange';

export class SupportTicket {

	id: number;
	createdDate: Date;
	date_ticket: Date;
	email_sender: string;
	type: 'erreur' | 'aide' | 'proposition';
	sujet: string;
	actions_before_error: string;
	fichiers_ticket: string[] = [];
	is_resolu: boolean;
	is_closed: boolean;
	senderConsultantId: number;
	echanges: SupportExchange[] = [];
}
