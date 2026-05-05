import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.component.html',
  styleUrls: ['./loading-page.component.css']
})
export class LoadingPageComponent implements OnInit {

  constructor(private logger: LoggerService, public utils: UtilsService) { }

  ngOnInit(): void {
  }

}
