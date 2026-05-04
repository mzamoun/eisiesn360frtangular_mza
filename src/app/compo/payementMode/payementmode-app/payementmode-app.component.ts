import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payementmode-app',
  templateUrl: './payementmode-app.component.html',
  styleUrls: ['./payementmode-app.component.css']
})
export class PayementmodeAppComponent implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
