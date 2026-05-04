import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notefrais-app',
  templateUrl: './notefrais-app.component.html',
  styleUrls: ['./notefrais-app.component.css']
})
export class NotefraisAppComponent implements OnInit {

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
