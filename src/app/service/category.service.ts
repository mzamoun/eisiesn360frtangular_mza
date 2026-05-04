import { LoggerService } from './logger.service';



import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Category} from '../model/category';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {GenericResponse} from '../model/response/genericResponse';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
@Injectable({providedIn:'root'})
export class CategoryService {
  private categoryUrl: string;
  private category: Category;

  public setCategory(category: Category) {
    this.category = category;
  }

  public getCategorie(): Category {
    return this.category;
  }

  constructor(private logger: LoggerService, private http: HttpClient) {
    this.categoryUrl = environment.apiUrl + '/category/';
  }

  public findAll(): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.categoryUrl);
  }


  public findById(id: number): Observable<GenericResponse> {
    return this.http.get<GenericResponse>(this.categoryUrl + id);
  }

  public save(category: Category): Observable<GenericResponse> {
    // //////////this.logger.debug("save id=" + category.id + ".");
    if (category.id > 0) {
      // //////////this.logger.debug("put update")
      return this.http.put<GenericResponse>(this.categoryUrl, category);
    } else {
      // //////////this.logger.debug("post add")
      return this.http.post<GenericResponse>(this.categoryUrl, category);
    }
  }

  public deleteById(id: number): Observable<GenericResponse> {
    return this.http.delete<GenericResponse>(this.categoryUrl + id);
  }

}
