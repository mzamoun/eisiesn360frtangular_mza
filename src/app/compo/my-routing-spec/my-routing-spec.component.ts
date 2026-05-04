import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggerService } from 'src/app/service/logger.service';

@Component({
  selector: 'app-my-routing-spec',
  templateUrl: './my-routing-spec.component.html',
  styleUrls: ['./my-routing-spec.component.css']
})
export class MyRoutingSpecComponent implements OnInit {

  constructor(private logger: LoggerService,   private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    const r = this.route
    this.logger.debug("MyRoutingSpecComponent: route=", r)

    const path = this.route.snapshot.paramMap.get('path')
    this.logger.debug("MyRoutingSpecComponent: path=", path)

    if(path)  this.router.navigate([path]);

  }

}
