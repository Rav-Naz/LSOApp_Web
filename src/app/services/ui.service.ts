import { ConfirmComponent } from './../shared/confirm/confirm.component';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private loading: Array<boolean> = [];

  confirmComponent: ConfirmComponent;
  windowSizeObs: Observable<any>;


  constructor(private toasterService: ToastrService) { }

  showFeedback(typ: 'succes' | 'warning' | 'error' | 'loading', tresc: string, czas: number)
  {
     switch (typ) {
       case 'succes':
        this.toasterService.success(tresc, 'Sukces!', {timeOut: czas * 1000});
        break;
       case 'warning':
        this.toasterService.warning(tresc, 'Uwaga!', {timeOut: czas * 1000});
        break;
       case 'error':
        this.toasterService.error(tresc, 'Błąd!', {timeOut: czas * 1000});
        break;
       case 'loading':
        this.toasterService.info(tresc, 'Sukces!', {timeOut: czas * 1000});
        break;
     }
  }

  setConfirmComponent(component: ConfirmComponent)
  {
    this.confirmComponent = component;
  }

  async wantToContinue(context: string, change?: boolean)
  {
    return new Promise<boolean>((resolve) => {
      if (change === undefined || (change !== undefined && change === true))
      {
        this.confirmComponent.awaitToDecision(context).then(res => {
          resolve(res);
        });
      }
      else
      {
          resolve(true);
      }
    });
  }

  resetLoadingEvents()
  {
    this.loading = [];
  }

  addLoadingEvent()
  {
    this.loading.push(true);
  }

  removeLoadingEvent()
  {
    if (this.loading.length > 0)
    {
      this.loading.pop();
    }
  }

  get isLoading()
  {
    return this.loading.length > 0;
  }
}
