'use strict';

const util = require("../utils.js");
const aws = require("aws-sdk");

aws.config.update({ region: "us-east-1" });
const dynamoDB = new aws.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  
  try {
    const requestBody = JSON.parse(event.body);
    console.log('request body', requestBody);
    const params = {
        TableName: 'GamePlayedTeamTable',
        Item: {
            game_played_id: requestBody.game_played_id,
            game_id: requestBody.game_id,
            game_name: requestBody.game_name,
            team_id: requestBody.team_id,
            score: requestBody.score,
            start_time: requestBody.start_time,
            category: requestBody.category
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
