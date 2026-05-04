import { LoggerService } from 'src/app/service/logger.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit(): void {
  }

}
