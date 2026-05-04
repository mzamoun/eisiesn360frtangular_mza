import { LoggerService } from 'src/app/service/logger.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-msg-histo',
  templateUrl: './msg-histo.component.html',
  styleUrls: ['./msg-histo.component.css']
})
export class MsgHistoComponent implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
