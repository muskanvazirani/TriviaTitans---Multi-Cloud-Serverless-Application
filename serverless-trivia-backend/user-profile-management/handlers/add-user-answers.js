/**
 * Route: POST /user
 * {
    "item": {
        "user_id": "id",
        "email": "saif@gmail.com",
        "answer1": "",
        "answer2": "",
        "answer3": "",
    }
}
 */

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

const util = require('../utils.js')

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.USER_QUS_ANS_TABLE;

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).item;

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