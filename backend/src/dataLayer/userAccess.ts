import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { User } from '../models/User';

export class UserAccess {

    private logger = createLogger('UserAccess')

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly usersTable = process.env.USERS_TABLE,
        private readonly usersUserIdIndex = process.env.USERS_USERID_INDEX,
        private readonly usersEmailIndex = process.env.USERS_EMAIL_INDEX
      ) {
    }

    async getUserByUserId(userId: string): Promise<User> {
        this.logger.info('getUser')
    
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.usersUserIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }      
        }).promise()
        console.log('count=' + result.Count)
        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as User
        } else {
            return undefined
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        this.logger.info('getUser')
    
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.usersEmailIndex,
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
              ':email': email
          }      
        }).promise()
    
        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as User
        } else {
            return undefined
        }
    }

    async createUser(user: User): Promise<User> {

        this.logger.info('createUser: ' + JSON.stringify(user) )    
        await this.docClient.put({
          TableName: this.usersTable,
          Item: user
        }).promise()
    
        return user
    }
}