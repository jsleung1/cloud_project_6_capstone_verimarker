import { Injectable, OnDestroy } from '@angular/core';
import { TopMenuItem } from '../veriguide-common-type/top-menu-item';
import { UrlPathConfig } from '../veriguide-common-type/url-path-config';
import { UserService } from './user-service';
import { veriguideInjectors, URL_PATH_CONFIG } from '../veriguide-common-type/veriguide-injectors';
import { LoggedInUser, AuthenticationStateEnum } from '../veriguide-model/models';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserMenuContainer } from '../veriguide-common-type/user-menu-container';
import { ContentMenuItem } from '../veriguide-common-type/content-menu-item';
import { Instructor, Student } from '../veriguide-model/rest-api-response/User';

@Injectable({
    providedIn: 'root'
})
export class MenuBuilderService implements OnDestroy {

    private subscription: Subscription;

    private userMenuContainerObservable = new BehaviorSubject<UserMenuContainer>(new UserMenuContainer() );

    constructor( private userService: UserService ) {

      this.subscription = this.userService.getLoggedInUser().subscribe( loggedInUser => {

          const userMenuContainer = new UserMenuContainer();
          userMenuContainer.loggedInUser = loggedInUser;
          if ( loggedInUser.authenticationState === AuthenticationStateEnum.Authenticated ) {
              userMenuContainer.topMenuItems = this.createTopMenuItems( loggedInUser );
              userMenuContainer.contentMenuItems = this.createContentMenuItems( loggedInUser );
          }

          this.userMenuContainerObservable.next( userMenuContainer );
      });
    }

    getUserMenuContainer(): BehaviorSubject<UserMenuContainer> {
      return this.userMenuContainerObservable;
    }

    private createTopMenuItems( loggedInUser: LoggedInUser ): TopMenuItem[]  {

      const topMenuItems: TopMenuItem[] = new Array();
      if ( loggedInUser.userType === Instructor ) {
        topMenuItems.push({
          name: 'Courses',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userCourses.fullPath
        });

        const parentPath = veriguideInjectors.get(URL_PATH_CONFIG).userMainPage.fullPath;
        const assignmentUrlSubPath = veriguideInjectors.get(URL_PATH_CONFIG).userAssignments.fullPath.replace(':courseId', '0' );

        topMenuItems.push({
          name: 'Assignments',
          url: `${parentPath}/${assignmentUrlSubPath}`
        });

        topMenuItems.push({
          name: 'Submissions',
          url:  veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath.replace(':assignmentId', '0')
        });
      }

      if ( loggedInUser.userType === Student ) {
        topMenuItems.push({
          name: 'Submission',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.fullPath
        });

        topMenuItems.push({
          name: 'History',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath.replace(':assignmentId', 'all' )
        });
        
      }

      topMenuItems.push({
        name: 'User',
        url: veriguideInjectors.get(URL_PATH_CONFIG).userRegistrationPage.fullPath.replace( ':userId', loggedInUser.userId )
      });

      return topMenuItems;
    }

    private createContentMenuItems( loggedInUser: LoggedInUser ): ContentMenuItem[]  {
      const contentMenuItems: ContentMenuItem[] = new Array();

      if ( loggedInUser.userType === Instructor ) {
        contentMenuItems.push({
          name: 'My Courses',
          iconPath: 'assets/images/veriguide-main/info.png',
          description: 'Teaching Courses by Academic Year',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userCourses.fullPath
        } );

        contentMenuItems.push({
          name: 'My Assignments',
          iconPath: 'assets/images/veriguide-main/deadline.png',
          description: 'Assignments in My Teaching Course',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userAssignments.fullPath.replace(':courseId', '0' )
        });

        contentMenuItems.push({
          name: 'My Submissions',
          iconPath: 'assets/images/veriguide-main/upload_2.png',
          description: 'Submissions uploaded to me for My Assignments',
          url:  veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath.replace(':assignmentId', '0')
        });
      }

      if ( loggedInUser.userType === Student ) {
        contentMenuItems.push( {
          name: 'Upload Submission',
          iconPath: 'assets/images/veriguide-main/upload_2.png',
          description: 'To submit your assignment to VeriGuide.',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userSubmissionUpload.fullPath
        });

        contentMenuItems.push({
          name: 'Submission History',
          iconPath: 'assets/images/veriguide-main/history.png',
          description: 'View your submissions that were uploaded to VeriGuide',
          url: veriguideInjectors.get(URL_PATH_CONFIG).userAssignmentSubmissionHistory.fullPath.replace(':assignmentId', 'all' )
        });
      }

      contentMenuItems.push({
        name: 'User Settings',
        iconPath: 'assets/images/veriguide-main/personnel.png',
        description: 'Click here to change user settings',
        url: veriguideInjectors.get(URL_PATH_CONFIG).userRegistrationPage.fullPath.replace( ':userId', loggedInUser.userId )
       } );

      return contentMenuItems;
    }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }
}
