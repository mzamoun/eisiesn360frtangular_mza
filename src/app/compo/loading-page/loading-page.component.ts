import { LoggerService } from 'src/app/service/logger.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit(): void {
  }

}
