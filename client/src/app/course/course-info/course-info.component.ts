import { Component, OnInit, OnDestroy } from '@angular/core';
import { VerimarkerHttpClient } from '../../rest-service/verimarker-http-client';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/model/rest-api-response/Course';
import { UpdateCourseRequest } from 'src/app/model/rest-api-request/course/UpdateCourseRequest';
import { AlertDialogService } from 'src/app/common-ui/dialog/alert-dialog/alert-dialog-service';
import { AcadYearsString } from 'src/app/model/clientConstants';
import { verimarkerInjectors, URL_PATH_CONFIG } from 'src/app/common-type/verimarker-injectors';

@Component({
  selector: 'app-course-info',
  templateUrl: './course-info.component.html',
  styleUrls: ['./course-info.component.scss']
})
export class CourseInfoComponent implements OnInit {

  private courses: Array<Course> = [];
  private filteredCourses: Array<Course> = [];

  private acadYears = AcadYearsString;
  private selectedAcadYear = 'All';

  constructor( private activatedRoute: ActivatedRoute,
               private verimarkerHttpClient: VerimarkerHttpClient,
               private alertDialogService: AlertDialogService,
               private spinner: NgxSpinnerService,
               private route: ActivatedRoute,
               private router: Router  ) {

    this.activatedRoute.data.subscribe( data => {
      this.courses =  data.resolverService;
      this.filterCourse();
    })
  }

  ngOnInit() {
  }

  onAcadYearSelection() {
    this.filterCourse();
  }

  onCreateCourse() {

    const acadYearToUse = this.selectedAcadYear === 'All' ? '2019' : this.selectedAcadYear;
    let url = verimarkerInjectors.get(URL_PATH_CONFIG).userCreateCourse.fullPath;
    url = url.replace(':acadYear', acadYearToUse )
    this.router.navigate( [ url ] );
  }

  openCourse(course: Course) {
    const url =  `${course.courseId}/${verimarkerInjectors.get(URL_PATH_CONFIG).userAssignments.relativePath}`;
    this.router.navigate( [ url ], { relativeTo: this.route } );
  }

  async onUpdateCourse(course: Course) {

    const updateCourseRequest: UpdateCourseRequest = {
      courseDescription: course.courseDescription
    };

    this.spinner.show();
    try {
      const updatedCourse = await this.verimarkerHttpClient.patch(`courses/${course.courseId}`, updateCourseRequest ).toPromise() as Course;
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Update Course',
        message: 'Successfully updated the course.',
        dialogType: 'OKDialog'
      }).then( res => {
      });
    } 
    catch(err) {
      this.spinner.hide();
      console.error(err);
    }

  }

  async onDeleteCourse(course: Course) {
    this.spinner.show();
    try {
      const deletedCourse = await this.verimarkerHttpClient.delete(`courses/${course.courseId}`).toPromise() as Course;
      await this.reloadCourses();
      this.spinner.hide();
      this.alertDialogService.openDialog({
        title: 'Delete Course',
        message: 'Successfully deleted the course.',
        dialogType: 'OKDialog'
      }).then( res => {
      });
    } 
    catch(err) {
      this.spinner.hide();
      console.error(err);
    }
  }

  filterCourse() {
    if ( this.selectedAcadYear === 'All') {
      this.filteredCourses = this.courses.filter( c => { return true; });
    } else {
      this.filteredCourses = this.courses.filter( c => c.acadYear == Number(this.selectedAcadYear) );
    }
  }

  async reloadCourses() {
    this.courses = await this.verimarkerHttpClient.get<Array<Course>>(`courses`).toPromise();
    this.filterCourse();
  }
}
