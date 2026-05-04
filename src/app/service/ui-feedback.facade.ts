import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MyError } from 'src/app/resource/MyError';
import { LoggerService } from './logger.service';

/**
 * UiFeedbackFacade — extraite de DataSharingService (refactor progressif).
 * Gère les flux de messages d'information et d'erreurs partagés entre composants.
 * Injectez cette facade directement dans les composants qui n'ont pas besoin du reste de DataSharingService.
 */
@Injectable({ providedIn: 'root' })
export class UiFeedbackFacade {

  private infosSource = new BehaviorSubject<string[]>([]);
  private errorsSource = new BehaviorSubject<MyError[]>([]);

  infos$ = this.infosSource.asObservable();
  errors$ = this.errorsSource.asObservable();

  constructor(private logger: LoggerService) {}

  addInfo(info: string): void {
    const current = this.infosSource.value;
    this.infosSource.next([...current, info]);
  }

  delInfo(info: string): void {
    const current = this.infosSource.value;
    const index = current.indexOf(info);
    if (index >= 0) {
      const updated = [...current];
      updated.splice(index, 1);
      this.infosSource.next(updated);
    }
  }

  clearInfos(): void {
    this.infosSource.next([]);
  }

  addErrorTxt(errorTxt: string): void {
    this.addError(new MyError('', errorTxt));
  }

  addError(error: MyError): void {
    this.logger.debug('UiFeedbackFacade addError', error);
    if (!error || !error.msg) return;
    if (error.title) {
      const title = error.title.toUpperCase();
      if (title === 'ERREUR 401' || title === 'ERROR 401') {
        error.msg += '\n. Il est recommandé de se reconnecter.';
      }
    }
    const current = this.errorsSource.value;
    this.errorsSource.next([...current, error]);
  }

  delError(error: MyError): void {
    const current = this.errorsSource.value;
    const index = current.findIndex(e => e.msg === error.msg && e.title === error.title);
    if (index >= 0) {
      const updated = [...current];
      updated.splice(index, 1);
      this.errorsSource.next(updated);
    }
  }

  clearErrors(): void {
    this.errorsSource.next([]);
  }

  clearInfosErrors(): void {
    this.clearInfos();
    this.clearErrors();
  }
}
