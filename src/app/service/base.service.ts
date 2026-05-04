import { LoggerService } from './logger.service';



import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  constructor(private logger: LoggerService, ) { }
}
