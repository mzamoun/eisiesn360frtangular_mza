import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-activityType-app',
  templateUrl: './activityType-app.component.html',
  styleUrls: ['./activityType-app.component.css']
})
export class ActivityTypeAppComponent implements OnInit {

	title: string = "ActivityTypes"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
