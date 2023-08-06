"use strict";
const util = require("../utils.js");
const AWS = require('aws-sdk');
AWS.config.update({ region: "us-east-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();
exports.handler = async (event) => {

  try {
    const { user_id } = event.queryStringParameters;
    console.log('user_id', user_id)
    const queryParams = {
      TableName: "GamePlayedUserTable",
      FilterExpression: "user_id = :userId",
      ExpressionAttributeValues: {
        ":userId": user_id,
      },
    };

    const queryResult = await dynamodb.scan(queryParams).promise();
    console.log('query result', queryResult);
    // Calculate the sum of the scores
    let totalScore = 0;
    queryResult.Items.forEach((item) => {
      totalScore += item.score;
    });

    // Prepare the response object
    const responseData = {
      user_id: user_id,
      score: totalScore,
      data: queryResult.Items,
    };

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(responseData),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: util.getResponseHeaders(),
      body: JSON.stringify({ error: err }),
    };
  }
};
