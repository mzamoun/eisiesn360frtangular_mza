import { LoggerService } from 'src/app/service/logger.service';



import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-app',
  templateUrl: './category-app.component.html',
  styleUrls: ['./category-app.component.css']
})
export class CategoryAppComponent implements OnInit {

  title: string = "Category"

  constructor(private logger: LoggerService, ) { }

  ngOnInit() {
  }

}
