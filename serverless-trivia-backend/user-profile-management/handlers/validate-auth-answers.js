/**
 * Route: POST /validate-user
 * {{
    "item": {
        "user_id": "Shaik Saifuddin",
        "email": "saif@gmail.com",
        "answer1": "sdfsd",
        "answer2": "adfsad",
        "answer3": "adsfad"
    }
}
}
 */

const aws = require("aws-sdk");
const uuid = require("uuid");
aws.config.update({ region: "us-east-1" });

const util = require("../utils.js");

const dynamodb = new aws.DynamoDB.DocumentClient();
const tableName = process.env.USER_QUS_ANS_TABLE;

exports.handler = async (event) => {
  try {
    let {
      email,
      answer1: userAnswer1,
      answer2: userAnswer2,
      answer3: userAnswer3,
    } = JSON.parse(event.body).item;

    let {
      Items: [{ answer1, answer2, answer3 }],
    } = await dynamodb
      .query({
        TableName: tableName,
        KeyConditionExpression: "email = :emailId",
        ExpressionAttributeValues: {
          ":emailId": email,
        },
        Limit: 1,
      })
      .promise();
    let res = {};
    if (
      answer1 === userAnswer1 &&
      answer2 === userAnswer2 &&
      answer3 === userAnswer3
    ) {
      res.validate = true;
    } else {
      res.validate = false;
    }

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(res),
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
