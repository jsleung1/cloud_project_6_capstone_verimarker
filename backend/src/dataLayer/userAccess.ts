import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { User } from '../entities/User';

export class UserAccess {

    private logger = createLogger('UserAccess')

    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly usersTable = process.env.USERS_TABLE,
        private readonly usersUserIdIndex = process.env.USERS_USERID_INDEX,
        private readonly usersEmailIndex = process.env.USERS_EMAIL_INDEX,
        private readonly usersUserTypeIndex = process.env.USERS_USERTYPE_INDEX
      ) {
    }

    async getUserByUserId(userId: string): Promise<User> {
        this.logger.info('getUserByUserId')
    
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.usersUserIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }      
        }).promise()
        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as User
        } else {
            return undefined
        }
    }

    async getUserByUserIdOrEmptyUser(userId: string): Promise<User> {
        this.logger.info('getUserByUserIdOrEmptyUser')
    
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.usersUserIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }      
        }).promise()
        if (result.Count !== 0) { 
            const item = result.Items[0]
            return item as User
        } else {
            return {
                userId: null,
                createdAt: null,
                userType: '',
                email: '',
                userName: ''
            }
        }
    }

    async getUserByUserIdAndUserType(userId: string, userType: string): Promise<User> {
        this.logger.info('getUserByUserIdAndUserType')
    
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.usersUserIdIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
              ':userId': userId
          }      
        }).promise()

        if (result.Count == 0) { 
            return undefined
        }

        const user = result.Items[0] as User
        if ( user.userType === userType ) {
            return user
        } else {
            return undefined
        }
    }

    async getUsersByUserIdAndUserType(userType: string): Promise<User[]> {
        this.logger.info('getUsersByUserIdAndUserType')
    
        const result = await this.docClient.query({
          TableName: this.usersTable,
          IndexName: this.usersUserTypeIndex,
          KeyConditionExpression: 'userType = :userType',
          ExpressionAttributeValues: {
              ':userType': userType
          }      
        }).promise()
  
        const items = result.Items
        return items as User[]
    }

    async getUserByEmail(email: string): Promise<User> {
        this.logger.info('getUserByEmail')
    
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

    async updateUser(user: User): Promise<User> {

        this.logger.info('updateUser: ' + JSON.stringify(user) )    
    
        await this.docClient.update({
            TableName: this.usersTable,
            Key: {
                userId: user.userId,
                createdAt: user.createdAt
            },         
            UpdateExpression: 'set userType = :userType, email = :email',
            ExpressionAttributeValues: {
                ':userType': user.userType,
                ':email': user.email
            }
        }).promise()

          
        return user
    }
}