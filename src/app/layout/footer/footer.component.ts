import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/service/logger.service';
import { UtilsService } from 'src/app/service/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  // today = new Date();
	dateCommitFront = "2026-07-20 16:47:46"
  dateCommitServer = ""

  // dateFooter = "";

  constructor(private logger: LoggerService, public utils: UtilsService, private http: HttpClient) { }

  ngOnInit() {
    // this.dateFooter = this.dateCommit || formatDate(this.today, 'yyyy-MM-dd HH:mm:ss', 'fr-FR');

    this.fetchDateCommitServer()
  }

  fetchDateCommitServer() {
    let label = "fetchDateCommitServer"
    let url = environment.divUrl + "/LastCommitServer"
    this.logger.debug(label + " url ", url )

    this.http.get(
      url,
      { responseType: 'text' }
    ).subscribe(
      (html) => {
      this.logger.debug(label + " html ", html )
      this.dateCommitServer = html;
    }, (error) => {
      this.logger.debug(label + " error ", error )
    }
  );

  }

}
