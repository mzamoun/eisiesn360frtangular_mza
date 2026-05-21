import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  today = new Date();
	dateCommit = "Last Commit : 2026-05-21 11:41:59"
  dateFooter = "";

  constructor(private logger: LoggerService, public utils: UtilsService) { }

  ngOnInit() {
    this.dateFooter = this.dateCommit || formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'fr-FR');
  }

}
