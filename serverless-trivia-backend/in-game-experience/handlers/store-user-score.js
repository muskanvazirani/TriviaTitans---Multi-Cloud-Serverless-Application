'use strict';

const util = require("../utils.js");
const { v4: uuidv4 } = require('uuid');
const aws = require("aws-sdk");

aws.config.update({ region: "us-east-1" });
const dynamoDB = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
  try {
    const requestBody = JSON.parse(event.body);

    const params = {
        TableName: 'GamePlayedUserTable',
        Item: {
          game_played_id: requestBody.game_played_id,
          game_id: requestBody.game_id,
          user_id: requestBody.user_id,
          question_id: requestBody.question_id,
          score: requestBody.score,
        },
      };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(params),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      header: util.getResponseHeaders(),
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
