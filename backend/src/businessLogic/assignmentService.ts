import { UpdateAssignmentRequest } from './../requests/assignment/UpdateAssignmentRequest';
import { CourseAccess } from './../dataLayer/courseAccess';
import * as uuid from 'uuid'


import { UserAccess } from './../dataLayer/userAccess';
import { AssignmentAccess } from './../dataLayer/assignmentAccess';

import { createLogger } from '../utils/logger';
import { Assignment } from '../models/Assignment';
import { CreateAssignmentRequest } from '../requests/assignment/CreateAssignmentRequest';
import { SubmissionAccess } from '../dataLayer/submissionAccess';

const logger = createLogger('assigmentService')

const courseAccess = new CourseAccess()
const assignmentAccess = new AssignmentAccess()
const submissionAccess = new SubmissionAccess()
const userAccess = new UserAccess()

// get all submissions uploaded to the Assigment Id
export async function getAllAssignmentsByCourseId( courseId: string ): Promise<Assignment[]> {
    return await assignmentAccess.getAllAssignmentsByCourseId( courseId );
}

export async function createAssignment( createAssignmentRequest: CreateAssignmentRequest, instructorId: string ) : Promise<Assignment> {

    const course = await courseAccess.getCourseByCourseId( createAssignmentRequest.courseId )
    if ( !course ) {
        throw new Error('Cannot find course to create assignment')
    }
    const instructorUser = await userAccess.getUserByUserId( instructorId )
    if ( !instructorUser ) {
        throw new Error('Cannot find the registered instructor to create the assignment')
    }

    if ( course.instructorId !== instructorUser.userId ) {
        throw new Error('Cannot create assignment because corresponding course does not belong to the instructor')
    }

    const assignment = await assignmentAccess.getAssignmentByAssigmentName( createAssignmentRequest.assignmentName)
    if ( assignment && assignment.courseId == course.courseId ) {
        throw new Error('Cannot create assignment because the assignment name already been used by existing assignment under the same course')   
    }

    const assignmentId: string = uuid.v4()

    const savedAssignment = await assignmentAccess.createAssignment({
        assignmentId,
        courseId: course.courseId,
        createdAt: new Date().toISOString(),

        courseName: course.courseName,
        instructorId: instructorUser.userId,
        assignmentName: createAssignmentRequest.assignmentName,
        assignmentDescription: createAssignmentRequest.assignmentDescription,
        dueDate: createAssignmentRequest.dueDate
    })

    logger.info('Create assignment successful:' + JSON.stringify( savedAssignment ))
    return savedAssignment;
}

export async function updateAssignment( updateAssignmentRequest: UpdateAssignmentRequest, assigmentId: string, instructorId: string  ) : Promise<Assignment> {

    const assignment = await assignmentAccess.getAssignmentByAssigmentId( assigmentId)
    if ( !assignment) {
        throw new Error('Cannot find assignment to update')
    }

    if ( assignment.instructorId !== instructorId) {
        throw new Error('Cannot update the assignment because it belongs to another instructor')
    }

    assignment.assignmentDescription = updateAssignmentRequest.assignmentDescription;
    assignment.dueDate = updateAssignmentRequest.dueDate

    const updatedAssigment = await assignmentAccess.updateAssignment( assignment )
    return updatedAssigment;
}

export async function deleteAssignment( assignmentId: string, instructorId: string ): Promise<Assignment> {

    const assignment = await assignmentAccess.getAssignmentByAssigmentId( assignmentId )
    if ( !assignment) {
        throw new Error('Cannot find assignment to delete')
    }

    if ( assignment.instructorId !== instructorId) {
        throw new Error('Cannot delete the assignment because it belongs to another instructor')
    }

    const submissionsInAssigment = await submissionAccess.getAllSubmissionsByAssignmentId( assignmentId )
    if ( submissionsInAssigment.length > 0) {
        throw new Error('Cannot delete the assignment because there are existing submissions in the assigment')
    }

    const deletedAssignment = await assignmentAccess.deleteAssignment( assignment )
    return deletedAssignment
}
