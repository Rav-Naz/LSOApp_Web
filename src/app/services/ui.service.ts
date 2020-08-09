import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UiService {

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
}
