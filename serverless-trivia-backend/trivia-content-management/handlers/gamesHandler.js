"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

// post: creates a game
//   POST: https://api/games
// {
//     "game_name": "name",
//     "category": "Science",
//     "difficulty_level": "easy",
//     "time_frame": "30"
// }

module.exports.createGame = async (event) => {
  const game_id = Date.now();
  const { game_name, category, difficulty_level, time_frame } = JSON.parse(
    event.body
  );

  const params = {
    TableName: process.env.GAMES_TABLE,
    Item: { game_id, game_name, category, difficulty_level, time_frame },
  };
  try {
    await db.put(params).promise();

    const questionEvent = {
      pathParameters: {
        category: category,
        difficulty: difficulty_level,
      },
    };
    const questionData = await this.getQuesByCatAndDiff(questionEvent);
    const questions = JSON.parse(questionData.body);

    for (let question of questions) {
      const gameQuestionParams = {
        TableName: process.env.GAMEQUESTIONS_TABLE,
        Item: {
          game_id: game_id,
          question_id: question.id,
        },
      };
      await db.put(gameQuestionParams).promise();
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(error),
    };
  }
};

// get : get game details
//   GET: https://api/games
// {
//     empty json body
// }

module.exports.getGameDetails = async (event) => {
  const params = {
    TableName: process.env.GAMES_TABLE,
  };

  try {
    const data = await db.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data.Items),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};

// updates a game - updates in the games table
//   PUT: https://api/games
//   {
//     "game_id": "001",
//     "category": "Science",
//     "difficulty_level": "easy",
//     "time_frame": "45"
// }

module.exports.updateGame = async (event) => {
  const { game_id, game_name, category, difficulty_level, time_frame } =
    JSON.parse(event.body);
  const params = {
    TableName: process.env.GAMES_TABLE,
    Key: { game_id },
    UpdateExpression:
      "set game_name = :game_name, category = :category, difficulty_level = :difficulty_level, time_frame = :time_frame",
    ExpressionAttributeValues: {
      ":game_name": game_name,
      ":category": category,
      ":difficulty_level": difficulty_level,
      ":time_frame": time_frame,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const data = await db.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(data.Attributes),
    };
  } catch (dbError) {
    console.log("Error in update:  ", dbError);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(dbError),
    };
  }
};

// delete: deletes a game
//   DELETE: https://api/games
//   {
//     "game_id": "001"
// }

module.exports.deleteGame = async (event) => {
  const { game_id } = JSON.parse(event.body);
  const params = {
    TableName: process.env.GAMES_TABLE,
    Key: { game_id },
  };

  try {
    await db.delete(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ game_id }),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};

// get : get game details by game_name
//   GET: https://api/games/{game_name}

module.exports.getGameDetailsByGameName = async (event) => {
  const game_name = event.pathParameters.game_name;
  const params = {
    TableName: process.env.GAMES_TABLE,
    FilterExpression: "#game_name = :game_name",
    ExpressionAttributeNames: {
      "#game_name": "game_name",
    },
    ExpressionAttributeValues: {
      ":game_name": game_name,
    },
  };

  try {
    const data = await db.scan(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(data.Items),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(dbError),
    };
  }
};

// GET: https://api/games/{game_id}

module.exports.getGameDetailsByGameId = async (event) => {
  const game_id = event.pathParameters.game_id;

  const params = {
    TableName: process.env.GAMES_TABLE,
    Key: {
      game_id: Number(game_id),
    },
  };

  try {
    const data = await db.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
        },
        body: "Game not found",
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(data.Item),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(dbError),
    };
  }
};

// get : get game details by game_name
//   GET: https://api_gateway_url.com/games/{category}/{difficulty}

module.exports.getQuesByCatAndDiff = async (event, context) => {
  const category = event.pathParameters.category;
  const difficulty = event.pathParameters.difficulty;

  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    FilterExpression: "category = :category AND difficulty = :difficulty",
    ExpressionAttributeValues: {
      ":category": category,
      ":difficulty": difficulty,
    },
  };

  try {
    const data = await db.scan(params).promise(); // replace dynamoDb with db here
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.log("Error", error);
    return {
      statusCode: error.statusCode || 501,
      headers: { "Content-Type": "text/plain" },
      body: "Couldn't fetch the questions.",
    };
  }
};
