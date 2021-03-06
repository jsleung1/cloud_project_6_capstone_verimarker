import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { VerimarkerHttpClient } from 'src/app/rest-service/verimarker-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { Submission } from 'src/app/model/rest-api-response/Submission';
import { Observable } from 'rxjs';
import { AssignmentsSubmissionsDTO } from 'src/app/model/assignmentsSubmissionsDTO';
import { Assignment } from 'src/app/model/rest-api-response/Assignment';

@Injectable({
  providedIn: 'root'
})
export class LoadSubmissionsResolverService implements Resolve<AssignmentsSubmissionsDTO>  {

  constructor(
    private verimarkerHttpClient: VerimarkerHttpClient,
    private spinner: NgxSpinnerService  ) {
  }

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):  Promise<AssignmentsSubmissionsDTO> {

    const assignmentId = route.paramMap.get('assignmentId');
    this.spinner.show();

    let assignments: Assignment[] = []
    if ( assignmentId === '0') {
      const submissions = await this.verimarkerHttpClient.get<Submission[]>(`submissions`).toPromise();
      const assignmentsSubmissionsDTO: AssignmentsSubmissionsDTO = {
        assignments,
        submissions
      }
      return assignmentsSubmissionsDTO;
    }

    let urlPath;
    if ( assignmentId && assignmentId !== 'all' ) {
      const assignment = await this.verimarkerHttpClient.get(`assignment/${assignmentId}`).toPromise() as Assignment;
      assignments.push( assignment )
      urlPath = `submissions/assignment/${assignmentId}`; // get submissons of the assignment
    } else {
      urlPath = `submissions`; // get submissions uploaded by user
    }

    const submissions = await this.verimarkerHttpClient.get<Array<Submission>>( urlPath ).toPromise()
    this.spinner.hide()

    const assignmentsSubmissionsDTO: AssignmentsSubmissionsDTO = {
      assignments,
      submissions
    }
    
    return assignmentsSubmissionsDTO;
  }
}
