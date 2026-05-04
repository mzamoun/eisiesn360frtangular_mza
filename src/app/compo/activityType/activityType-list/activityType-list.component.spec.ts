import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ConsultantService } from 'src/app/service/consultant.service';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { EsnService } from 'src/app/service/esn.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { ActivityTypeService } from '../../../service/activityType.service';
import { ActivityTypeListComponent } from './activityType-list.component';

describe('ActivityTypeListComponent', () => {
  let component: ActivityTypeListComponent;
  let fixture: ComponentFixture<ActivityTypeListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityTypeListComponent],
      providers: [
        { provide: ActivityTypeService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: UtilsIhmService, useValue: {} },
        { provide: DataSharingService, useValue: { userConnected: { esn: {} }, logger: { debug: () => {} } } },
        { provide: EsnService, useValue: {} },
        { provide: ConsultantService, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(ActivityTypeListComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityTypeListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
