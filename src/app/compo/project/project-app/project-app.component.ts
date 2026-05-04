import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-project-app',
  templateUrl: './project-app.component.html',
  styleUrls: ['./project-app.component.css']
})
export class ProjectAppComponent implements OnInit {

	title: string = "Projects"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
