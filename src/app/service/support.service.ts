import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GenericResponse } from '../model/response/genericResponse';

@Injectable({ providedIn: 'root' })
export class SupportService {

	private supportUrl: string;

	constructor(private http: HttpClient) {
		this.supportUrl = environment.apiUrl + '/support/';
	}

	public findAll(): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.supportUrl);
	}

	public findMyTickets(): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.supportUrl + 'my');
	}

	public findById(id: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.supportUrl + id);
	}

	public addTicket(ticket: any): Observable<GenericResponse> {
		return this.http.post<GenericResponse>(this.supportUrl, ticket);
	}

	public findExchangesByTicketId(ticketId: number): Observable<GenericResponse> {
		return this.http.get<GenericResponse>(this.supportUrl + ticketId + '/echanges');
	}

	public addExchange(ticketId: number, exchange: any): Observable<GenericResponse> {
		return this.http.post<GenericResponse>(this.supportUrl + ticketId + '/echanges', exchange);
	}

	public updateStatus(ticketId: number, payload: any): Observable<GenericResponse> {
		return this.http.put<GenericResponse>(this.supportUrl + ticketId + '/status', payload);
	}
}
