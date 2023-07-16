/**
 * Route: POST /user
 * {
    "item": {
        "name": "Shaik Saifuddin",
        "email": "saif@gmail.com"
    }
}
 */

const aws = require('aws-sdk');
const uuid = require('uuid');
aws.config.update({region: 'us-east-1'});

const util = require('../utils.js')

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.USER_TABLE;

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).item;
        item.user_id = uuid.v4();

        await dynamodb.put({
            TableName: tableName,
            Item: item
        }).promise()

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(item)
        }

    } catch(err) {
        return {
            statusCode: err.statusCode ? err.statusCode: 500,
            header: util.getResponseHeaders(),
            body: JSON.stringify({
                error: err.name ? err.name: "Exception",
                message: err.message ? err.message: "Unknown error"
            })
        }
    }
}