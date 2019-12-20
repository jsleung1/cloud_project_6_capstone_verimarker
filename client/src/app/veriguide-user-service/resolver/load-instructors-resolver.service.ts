import { Injectable } from '@angular/core';
import { User, Instructor } from 'src/app/veriguide-model/rest-api-response/User';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { VeriguideHttpClient } from 'src/app/veriguide-rest-service/veriguide-http-client';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadInstructorsResolverService implements Resolve<User[]> {

  constructor(private veriguideHttpClient: VeriguideHttpClient,
    private spinner: NgxSpinnerService) { 
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): User[] | Observable<User[]> | Promise<User[]> {
    const userType = Instructor

    this.spinner.show();
    const observableResult = this.veriguideHttpClient.get<User[]>(`users/${userType}`); 
    observableResult.subscribe( instructors => {
      this.spinner.hide();
    })
    return observableResult;
  }

}