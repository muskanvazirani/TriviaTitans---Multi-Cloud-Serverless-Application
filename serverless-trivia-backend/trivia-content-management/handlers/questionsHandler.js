"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();

//get question from a particular category API
// GET: https://api_gateway_url.com/questions/{category}
// GET: https://api_gateway_url.com/questions/Science
// {
// empty json body
// }
module.exports.getCategoryQuestions = async (event) => {
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    KeyConditionExpression: "category = :category",
    ExpressionAttributeValues: {
      ":category": event.pathParameters.category,
    },
  };

  try {
    const result = await db.query(params).promise();
    return { statusCode: 200, body: JSON.stringify(result.Items) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

// post questions  > creates new question and puts in questions table
// POST: https://api_gateway_url.com/questions
// {
//     "id": "123",
//     "category": "Science",
//     "difficulty": "medium",
//     "question": "What is the symbol for the chemical element Hydrogen?",
//     "correct_answer": "H",
//     "wrong_answers": ["He", "Hg", "Ho"]
//   }

module.exports.createQuestion = async (event) => {
  const { id, category, difficulty, question, correct_answer, wrong_answers } =
    JSON.parse(event.body);
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Item: { id, category, difficulty, question, correct_answer, wrong_answers },
  };

  try {
    await db.put(params).promise();
    return { statusCode: 200, body: JSON.stringify(params.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

// put : updates an existing question in the questions table
//   PUT: https://api_gateway_url.com/questions
// {
//     "id": "123",
//     "category": "Science",
//     "difficulty": "medium",
//     "question": "What is the symbol for the chemical element Helium?",
//     "correct_answer": "He",
//     "wrong_answers": ["H", "Hg", "Ho"]
//   }

module.exports.updateQuestion = async (event) => {
  const { id, category, difficulty, question, correct_answer, wrong_answers } =
    JSON.parse(event.body);
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Key: { id, category },
    UpdateExpression:
      "set difficulty = :difficulty, question = :question, correct_answer = :correct_answer, wrong_answers = :wrong_answers",
    ExpressionAttributeValues: {
      ":difficulty": difficulty,
      ":question": question,
      ":correct_answer": correct_answer,
      ":wrong_answers": wrong_answers,
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

// delete : deletes a question
//   DELETE: https://api_gateway_url.com/questions
//   {
//     "id": "123",
//     "category": "Science"
//   }
//

module.exports.deleteQuestion = async (event) => {
  const { id, category } = JSON.parse(event.body);
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Key: { id, category },
  };

  try {
    await db.delete(params).promise();
    return { statusCode: 200, body: JSON.stringify({ id, category }) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
