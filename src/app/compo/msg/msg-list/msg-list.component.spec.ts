import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MsgService } from '../../../service/msg.service';
import { MsgListComponent } from './msg-list.component';

describe('MsgListComponent', () => {
  let component: MsgListComponent;
  let fixture: ComponentFixture<MsgListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MsgListComponent],
      providers: [
        { provide: MsgService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: UtilsIhmService, useValue: {} },
        { provide: DataSharingService, useValue: { userConnected: {}, logger: { debug: () => {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(MsgListComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
