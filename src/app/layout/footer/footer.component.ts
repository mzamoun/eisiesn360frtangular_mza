import { LoggerService } from 'src/app/service/logger.service';
import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  today = new Date();
	dateCommit = "Last Commit : 2026-05-04 15:02:59"
  dateFooter = "";

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
    this.dateFooter = this.dateCommit || formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'fr-FR');
  }

}
