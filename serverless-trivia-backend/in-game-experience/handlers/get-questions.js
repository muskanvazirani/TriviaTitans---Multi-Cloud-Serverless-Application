'use strict';
const axios = require('axios');
const util = require("../utils.js");
exports.handler = async (event) => {
  const { game_id } = event.queryStringParameters;
  
  try {
    const gameResponse = await axios.get(`https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games/id/${game_id}`);
    const questionsResponse = await axios.get(`https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/questions/${gameResponse.data.category}/${gameResponse.data.difficulty_level}`);
    
    const data = questionsResponse.data.map((question, index) => {
      const options = [question.correct_answer, ...question.wrong_answers];
      shuffleArray(options); // Randomize the options
      return {
        questionNo: index+1,
        id: question.id,
        question: question.question,
        options: options,
        correct_answer: question.correct_answer,
      };
    });
    
    // Sort the data array based on the 'id' field
    data.sort((a, b) => a.id - b.id);

    return {
      statusCode: 200,
      headers: util.getResponseHeaders(),
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      header: util.getResponseHeaders(),
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// Function to shuffle an array in-place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
