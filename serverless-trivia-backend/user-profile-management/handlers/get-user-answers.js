/**
 * Route: GET http://localhost:3000/dev/user-answers?email=saif@gmail.com&user_id=Shaik%20Saifuddin
}
 */

const aws = require("aws-sdk");
aws.config.update({ region: "us-east-1" });

const util = require("../utils.js");

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.USER_QUS_ANS_TABLE;

exports.handler = async (event) => {
  try {
    const email = event.queryStringParameters.email;
    const user_id = event.queryStringParameters.user_id;

    let data = await dynamodb
      .query({
        TableName: tableName,
        KeyConditionExpression: "email = :emailId and user_id = :user_id",
        ExpressionAttributeValues: {
          ":emailId": email,
          ":user_id": user_id,
        },
        Limit: 1,
      })
      .promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      header: util.getResponseHeaders(),
      body: JSON.stringify({
        error: err.name ? err.name : "Exception",
        message: err.message ? err.message : "Unknown error",
      }),
    };
  }
};
