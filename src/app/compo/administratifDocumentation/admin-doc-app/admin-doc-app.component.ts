import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-doc-app',
  templateUrl: './admin-doc-app.component.html',
  styleUrls: ['./admin-doc-app.component.css']
})
export class AdminDocAppComponent implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit(): void {
  }

}
