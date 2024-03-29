import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'


import { deleteAssignment } from '../../../businessLogic/assignmentService';
import { createLogger } from '../../../utils/logger';
import { getJwtToken } from '../../utils';
import { parseUserId } from '../../../auth/utils';

const logger = createLogger('deleteAssignmentHandler')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  logger.info('Processing event: ', event)
  
  const assignmentId = event.pathParameters.queryId

  const jwtToken = getJwtToken( event.headers.Authorization )
  const userId = parseUserId(jwtToken)
  
  let deletedAssignment = null

  try {
    deletedAssignment = await deleteAssignment( assignmentId, userId )
  } catch (e) {
    logger.error(e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: e.message
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(deletedAssignment)
  }
}