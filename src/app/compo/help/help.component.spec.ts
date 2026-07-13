import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { DataSharingService } from 'src/app/service/data-sharing.service';
import { SupportService } from 'src/app/service/support.service';
import { UtilsIhmService } from 'src/app/service/utilsIhm.service';
import { TradService } from 'src/app/service/trad.service';
import { HelpComponent } from './help.component';

describe('HelpComponent', () => {
  let component: HelpComponent;
  let fixture: ComponentFixture<HelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: DataSharingService,
          useValue: {
            userConnected: { id: 1, username: 'john', email: 'john@test.local', fullName: 'John Doe', role: 'CONSULTANT', esn: { id: 2, name: 'ESN' } },
            userConnected$: of({ id: 1, username: 'john', email: 'john@test.local', fullName: 'John Doe', role: 'CONSULTANT', esn: { id: 2, name: 'ESN' } }),
            addErrorTxt: () => {},
            clearErrors: () => {}
          }
        },
        {
          provide: SupportService,
          useValue: {
            findMyTickets: () => of({ body: { result: [] } }),
            findById: () => of({ body: { result: null } }),
            addTicket: () => of({ body: { result: true } }),
            addExchange: () => of({ body: { result: true } })
          }
        },
        {
          provide: UtilsIhmService,
          useValue: { infoDialog: () => {} }
        },
        {
          provide: TradService,
          useValue: { tr: (key: string) => key, get: (key: string) => key }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
