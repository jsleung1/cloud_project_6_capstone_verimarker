import { Injectable } from '@angular/core';
import { Resolve,
         RouterStateSnapshot,
         ActivatedRouteSnapshot
} from '@angular/router';
import { VerimarkerHttpClient } from '../../rest-service/verimarker-http-client';
import { Observable, Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Course } from '../../model/rest-api-response/Course';


@Injectable({
  providedIn: 'root'
})
export class LoadCourseResolverService implements Resolve<Course> {
  constructor( private verimarkerHttpClient: VerimarkerHttpClient,
               private spinner: NgxSpinnerService  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> | Observable<never> {
    this.spinner.show();

    const courseId = route.paramMap.get('courseId');
    console.log(courseId);
    
    const observableResult = this.verimarkerHttpClient.get<Course>(`course/${courseId}`);    
    observableResult.subscribe( course => {
      this.spinner.hide();
    });

    return observableResult;
  }
}
