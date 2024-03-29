import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VerimarkerHttpClient } from 'src/app/rest-service/verimarker-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/model/rest-api-response/User';

@Injectable({
  providedIn: 'root'
})
export class LoadUserResolverService implements Resolve<User> {
  
  constructor(private verimarkerHttpClient: VerimarkerHttpClient,
              private spinner: NgxSpinnerService) { 
        
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Promise<User> {
    
    const userId = route.paramMap.get('userId');
    if ( userId === '0' ) {
      return null;
    }

    this.spinner.show();
    const observableResult = this.verimarkerHttpClient.get<User>(`user`);    
    observableResult.subscribe( user => {
      this.spinner.hide();
    });

    return observableResult;
  }


}
