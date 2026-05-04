import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-msg-app',
  templateUrl: './msg-app.component.html',
  styleUrls: ['./msg-app.component.css']
})
export class MsgAppComponent implements OnInit {

	title: string = "Msgs"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
