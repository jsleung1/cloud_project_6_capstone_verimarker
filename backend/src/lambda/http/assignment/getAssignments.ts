import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { parseUserId } from '../../../auth/utils'
import { getJwtToken } from '../../utils'
import { createLogger } from '../../../utils/logger'
import { getAssignmentsForInstructorOrStudent } from '../../../businessLogic/assignmentService';

const logger = createLogger('getAssignmentsHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)
 
  let courseId = event.pathParameters.courseId  
  logger.info('courseId = ' + courseId)

  let assignments = []

  try {
    assignments = await getAssignmentsForInstructorOrStudent( courseId, userId )
  } catch (e) {
    logger.error(e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: e.message
      })
    }
  }
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: assignments
    })
  }
}