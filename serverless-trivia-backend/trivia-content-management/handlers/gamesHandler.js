"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

//post: creates a game
//   POST: https://api_gateway_url.com/games
// {
//     "game_id": "001",
//     "categories": ["Science", "Math"],
//     "difficulty_levels": ["easy", "medium"],
//     "time_frame": "30"
//   }
//

module.exports.createGame = async (event) => {
  const { game_id, categories, difficulty_levels, time_frame } = JSON.parse(
    event.body
  );
  const params = {
    TableName: process.env.GAMES_TABLE,
    Item: { game_id, categories, difficulty_levels, time_frame },
  };

  try {
    await db.put(params).promise();
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

//get : get game details
//   GET: https://api_gateway_url.com/games
// {
//     empty json body
//   }
module.exports.getGameDetails = async (event) => {
  const params = {
    TableName: process.env.GAMES_TABLE,
  };

  try {
    const data = await db.scan(params).promise();
    return { statusCode: 200, body: JSON.stringify(data.Items) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

// updates a game - updates in the games table
//   PUT: https://api_gateway_url.com/games
//   {
//     "game_id": "001",
//     "categories": ["Science", "Math", "History"],
//     "difficulty_levels": ["easy", "medium", "hard"],
//     "time_frame": "45"
//   }

module.exports.updateGame = async (event) => {
  const { game_id, categories, difficulty_levels, time_frame } = JSON.parse(
    event.body
  );
  const params = {
    TableName: process.env.GAMES_TABLE,
    Key: { game_id },
    UpdateExpression:
      "set categories = :categories, difficulty_levels = :difficulty_levels, time_frame = :time_frame",
    ExpressionAttributeValues: {
      ":categories": categories,
      ":difficulty_levels": difficulty_levels,
      ":time_frame": time_frame,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await db.update(params).promise();
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

// delete: deletes a game
//   DELETE: https://api_gateway_url.com/games
//   {
//     "game_id": "001"
//   }

module.exports.deleteGame = async (event) => {
  const { game_id } = JSON.parse(event.body);
  const params = {
    TableName: process.env.GAMES_TABLE,
    Key: { game_id },
  };

  try {
    await db.delete(params).promise();
    return { statusCode: 200, body: JSON.stringify({ game_id }) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
