import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DataSharingService } from 'src/app/service/data-sharing.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { MsgHistoService } from '../../../service/msgHisto.service';
import { MsgHistoListComponent } from './msgHisto-list.component';

describe('MsgHistoListComponent', () => {
  let component: MsgHistoListComponent;
  let fixture: ComponentFixture<MsgHistoListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MsgHistoListComponent],
      providers: [
        { provide: MsgHistoService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: UtilsIhmService, useValue: {} },
        { provide: DataSharingService, useValue: { userConnected: {}, logger: { debug: () => {} } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideTemplate(MsgHistoListComponent, '')
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsgHistoListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
