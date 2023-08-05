'use strict';
const axios = require('axios');
const util = require("../utils.js");
exports.handler = async (event) => {
  const { game_id } = event.queryStringParameters;
  
  try {
    const joinTimeResponse = await axios.post(
        'https://u0ubbqcm00.execute-api.us-east-1.amazonaws.com/Dev/paticipants',
        { "gameId": game_id }
      );
  
     // Extract JoinTime and EmailId from the response
     const joinTime = joinTimeResponse.data.value[0]?.JoinTime;

     // Make the second API call to get game details
    const gameDetailsResponse = await axios.get(
        `https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games/id/${game_id}`
      );

    // Extract game details from the response
    const { category, game_name } = gameDetailsResponse.data;

    // Prepare the final response object
    const responseData = {
      game_name: game_name,
      start_time: joinTime,
      Category: category,
    };

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(responseData),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      header: util.getResponseHeaders(),
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
