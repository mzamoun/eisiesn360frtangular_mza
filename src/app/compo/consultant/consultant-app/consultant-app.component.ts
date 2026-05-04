import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-consultant-app',
  templateUrl: './consultant-app.component.html',
  styleUrls: ['./consultant-app.component.css']
})
export class ConsultantAppComponent implements OnInit {

	title: string = "Consultants"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
