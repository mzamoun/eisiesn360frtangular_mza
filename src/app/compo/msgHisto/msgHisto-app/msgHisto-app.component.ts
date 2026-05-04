import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-msgHisto-app',
  templateUrl: './msgHisto-app.component.html',
  styleUrls: ['./msgHisto-app.component.css']
})
export class MsgHistoAppComponent implements OnInit {

	title: string = "MsgHistos"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
