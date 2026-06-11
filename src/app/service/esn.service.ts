import { LoggerService } from './logger.service';



import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivityType } from '../model/activityType';
import { Client } from '../model/client';
import { Consultant } from '../model/consultant';
import { Esn } from '../model/esn';
import { GenericResponse } from "../model/response/genericResponse";

@Injectable({ providedIn: 'root' })
export class EsnService {

  private esnUrl: string;
  private esnUrlPub: string;
  private esn: Esn;
  public setEsn(esn: Esn) {
    this.esn = esn;
  }

  public getEsn(): Esn {
    return this.esn;
  }

  constructor(private logger: LoggerService, private http: HttpClient) {
    this.esnUrl = environment.apiUrl + '/esn/';
    this.esnUrlPub = environment.divUrl + '/esn/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl);
  }

  public refreshEsn(esn: Esn): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl + 'refreshLists/' + esn.id);
  }

  public getListClients(esn: Esn): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl + 'listClient/' + esn.id);
  }

  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.esnUrl + id);
  }

  public findByName(name: string, isPub: boolean = false): Observable<GenericResponse> {
    let url = isPub ? this.esnUrlPub : this.esnUrl
    return this.http.post<GenericResponse>(url + "findByName/", name);
  }

  public save(esn: Esn, isPub: boolean = false): Observable<GenericResponse> {
    ////////////this.logger.debug("save id=" + esn.id + ".");
    let url = isPub ? this.esnUrlPub : this.esnUrl
    if (esn.id > 0) {
      ////////////this.logger.debug("put update")
      return this.http.put<GenericResponse>(url, esn);
    } else {
      ////////////this.logger.debug("post add")
      return this.http.post<GenericResponse>(url, esn);
    }
  }

  public deleteById(id: number, isPub: boolean = false): Observable<GenericResponse> {
    let url = isPub ? this.esnUrlPub : this.esnUrl
    return this.http.delete<GenericResponse>(url + id);
  }

  public deleteAll(): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.esnUrl);
  }

  public addEsnDemo(): Observable<GenericResponse> {
    return this.http.post<GenericResponse>(this.esnUrl + "demo", "demo");
  }

  ///////////////////

  majEsnOnConsultants(list: Consultant[], fct: Function = null, fctErr: Function) {
    if (list && list.length > 0) {
      for (let c of list) {
        this.majEsnOnConsultant(c, fct, fctErr)
      }
    }
  }

  majEsnOnConsultant(myObj: Consultant, fct: Function = null, fctErr: Function) {
    this.logger.debug("majEsnOnConsultant myObj, esnId, myObj.esn : ", myObj, myObj?.esnId, myObj?.esn)
    if (myObj && myObj.esnId && !myObj.esn) {
      this.logger.debug("majEsnOnConsultant DEB find esn by id=" + myObj.esnId);
      let esnId = myObj.esnId
      let label = "majEsnOnConsultant find esn by id=" + esnId;
      this.logger.debug(label)
      this.findById(esnId).subscribe(
        data => {
          this.logger.debug("majEsnOnConsultant setEsnOnConsultant : data :", data)
          myObj.esn = data.body != null ? data.body.result : null;
          this.logger.debug("majEsnOnConsultant setEsnOnConsultant : myObj.esn :", myObj.esn)
          myObj.esnName = myObj.esn?.name
          if (fct) fct(myObj.esn)
        },
        error => {
          this.logger.debug("majEsnOnConsultant ERROR setEsnOnConsultant consultant, err", myObj, error)
          if (fctErr) fctErr(error)
        }
      );
    } else {
      if (fct) fct(myObj?.esn);
    }
  }

  majActivityType(myObj: ActivityType) {
    ////////////////
    let id = myObj.esnId
    let label = "find esn by id=" + id;
    let obj = myObj.esn

    if (myObj && id && !obj) {
      this.findById(id).subscribe(
        data => {
          this.logger.debug(label, data)
          myObj.esn = data.body.result;
        },
        error => {
          this.logger.debug("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    /////////////////
  }

  majClient(myObj: Client) {
    ////////////////
    let id = myObj.esnId
    let label = "find esn by id=" + id;
    let obj = myObj.esn

    if (myObj && id && !obj) {
      this.findById(id).subscribe(
        data => {
          this.logger.debug(label, data)
          myObj.esn = data.body.result;
        },
        error => {
          this.logger.debug("ERROR label myObj, err", label, myObj, error)
        }
      );
    }
    ////////////////
  }

}
