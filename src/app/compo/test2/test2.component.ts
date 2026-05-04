import { LoggerService } from 'src/app/service/logger.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test2',
  templateUrl: './test2.component.html',
  styleUrls: ['./test2.component.css']
})
export class Test2Component implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
