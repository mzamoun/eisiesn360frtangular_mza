import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-client-app',
  templateUrl: './client-app.component.html',
  styleUrls: ['./client-app.component.css']
})
export class ClientAppComponent implements OnInit {

	title: string = "Clients"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
