import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Course } from '../models/Course';

export class CourseAccess {

    private logger = createLogger('CourseAccess')

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly coursesTable = process.env.COURSES_TABLE,
        private readonly coursesInstructorIdIndex = process.env.COURSES_INSTRUCTORID_INDEX,
        private readonly coursesAcadYearIndex = process.env.COURSES_ACADYEAR_INDEX,
        
         ) {
    }

    async getAllCoursesByAcadYear(acadYear: number): Promise<Course[]> {
      this.logger.info('getAllCoursesByInstructorId')
  
      const result = await this.docClient.query({
        TableName: this.coursesTable,
        IndexName: this.coursesAcadYearIndex,
        KeyConditionExpression: 'acadYear = :acadYear',
        ExpressionAttributeValues: {
            ':acadYear': acadYear
        }      
      }).promise()
  
      const items = result.Items
      return items as Course[]
  }

    async getAllCoursesByInstructorId(instructorId: string): Promise<Course[]> {
        this.logger.info('getAllCoursesByInstructorId')
    
        const result = await this.docClient.query({
          TableName: this.coursesTable,
          IndexName: this.coursesInstructorIdIndex,
          KeyConditionExpression: 'instructorId = :instructorId',
          ExpressionAttributeValues: {
              ':instructorId': instructorId
          }      
        }).promise()
    
        const items = result.Items
        return items as Course[]
    }
    

    async getCourse(courseId: string): Promise<Course> {
        
        this.logger.info('getCourse')
        const result = await this.docClient.query({
            TableName: this.coursesTable,
            IndexName: this.coursesInstructorIdIndex,
            KeyConditionExpression: 'courseId = :courseId',
            ExpressionAttributeValues: {
                ':courseId': courseId
            }      
        }).promise()

        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as Course
        } else {
            return undefined
        }
    }

    async createCourse(course: Course): Promise<Course> {

        this.logger.info('createCourse: ' + JSON.stringify(course) )    
        await this.docClient.put({
          TableName: this.coursesTable,
          Item: course
        }).promise()
    
        return course
    }

    async updateCourse(course: Course): Promise<Course> {

        this.logger.info('updating Course: ' + JSON.stringify(course) )
    
        await this.docClient.update({
          TableName: this.coursesTable,
          Key: {
            courseId: course.courseId,
            createdAt: course.createdAt
          },         
          UpdateExpression: 'set acadYear = :acadYear, term = :term, courseName = :courseName, courseDescription = :courseDescription',
          ExpressionAttributeValues: {
            ':acadYear': course.acadYear,
            ':term': course.term,
            ':courseName': course.courseName,
            ':courseDescription': course.courseDescription
          }
        }).promise()
    
        return course
    }


    async deleteCourse(course: Course ): Promise<Course> {

        this.logger.info(`deleteCourse with courseId:${course.courseId}`)
        const data = await this.docClient.delete({
          TableName: this.coursesTable,
          Key: {
            courseId: course.courseId,
            createdAt: course.createdAt
          }
        }).promise()
    
        this.logger.info("Delete course successful:", JSON.stringify(data) );
        return course;
    }
}