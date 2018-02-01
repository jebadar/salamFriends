import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpServicesService } from '../app-services/http-services.service';
import { LocStoreService } from '../app-services/loc-store.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Injectable()
export class FeedService {
  returnUrl: string;
  loading = false;
  private accessTokken;
  private _userInfo: Array<string> = [];

  constructor(
    private httpServicesService: HttpServicesService,
    private locStoreService: LocStoreService,
    private toastr: ToastsManager
  ) {
    if (locStoreService.get('userTokken')) {
      this.accessTokken = locStoreService.get('userTokken');
      this._userInfo.push(JSON.parse(locStoreService.get('userDetail')));
      this.httpServicesService.setTokken(this.accessTokken);
    }
  }
  getTImeline(limit,offset) {
    let tempStr = "?limit="+limit+"&&offset="+offset;
    let observable = this.httpServicesService.get('userhome',tempStr)
    return observable;
  }

}

