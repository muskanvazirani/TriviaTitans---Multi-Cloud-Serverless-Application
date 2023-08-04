"use strict";

const AWS = require("aws-sdk");
const axios = require("axios");
const db = new AWS.DynamoDB.DocumentClient();
// id is not a string > id is a number
function validateInput(input) {
  const validKeys = [
    "id",
    "category",
    "difficulty",
    "question",
    "correct_answer",
    "wrong_answers",
  ];
  return Object.keys(input).every((key) => validKeys.includes(key));
}

// GET: https://api/questions/{category}/id/{question_id}

module.exports.getQuestionById = async (event) => {
  const id = event.pathParameters.question_id;
  const category = event.pathParameters.category;
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    Key: {
      category: category,
      id: Number(id),
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
        },
        body: JSON.stringify({ error: "Question not found" }),
      };
    }
    const question = {
      id: data.Item.id,
      category: data.Item.category,
      difficulty: data.Item.difficulty,
      question: data.Item.question,
      correct_answer: data.Item.correct_answer,
      wrong_answers: data.Item.wrong_answers,
      tags: data.Item.tags,
    };
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(question),
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

// GET: https://api/questions/{category}

module.exports.getCategoryQuestions = async (event) => {
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
    KeyConditionExpression: "#category = :category",
    ExpressionAttributeNames: {
      "#category": "category",
    },
    ExpressionAttributeValues: {
      ":category": event.pathParameters.category,
    },
  };

  try {
    console.log("params: ", params);
    const result = await db.query(params).promise();
    console.log("result: ", result);
    const questions = result.Items.map((item) => ({
      id: item.id,
      category: item.category,
      difficulty: item.difficulty,
      question: item.question,
      correct_answer: item.correct_answer,
      wrong_answers: item.wrong_answers,
    }));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(questions),
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

// POST: https://api/questions
// {
//     "category": "Science",
//     "difficulty": "medium",
//     "question": "What is the symbol for the chemical element Hydrogen?",
//     "correct_answer": "H",
//     "wrong_answers": ["He", "Hg", "Ho"]
// }

module.exports.createQuestion = async (event) => {
  try {
    const data = JSON.parse(event.body);
    console.log("Received data: ", data);
    const newItem = {
      id: Date.now(),
      category: data.category,
      difficulty: data.difficulty,
      question: data.question,
      correct_answer: data.correct_answer,
      wrong_answers: data.wrong_answers,
    };
    console.log("Validation result: ", validateInput(newItem));
    if (!validateInput(newItem)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Invalid input data",
      };
    }

    const response = await axios.post(
      "https://us-central1-automated-question-tagging.cloudfunctions.net/getTags",
      {
        text: data.question,
      }
    );
    const tags = response.data;

    newItem.tags = tags;

    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Item: newItem,
    };

    await db.put(params).promise();
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

// PUT: https://api/questions
// {
//     "id": 123,
//     "category": "Science",
//     "difficulty": "medium",
//     "question": "What is the symbol for the chemical element Helium?",
//     "correct_answer": "He",
//     "wrong_answers": ["H", "Hg", "Ho"],
// "tags" : ["tag1", "tag2"]
// }
module.exports.updateQuestion = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: { id: data.id, category: data.category },
      UpdateExpression:
        "set difficulty = :difficulty, question = :question, correct_answer = :correct_answer, wrong_answers = :wrong_answers, tags = :tags",
      ExpressionAttributeValues: {
        ":difficulty": data.difficulty,
        ":question": data.question,
        ":correct_answer": data.correct_answer,
        ":wrong_answers": data.wrong_answers,
        ":tags": data.tags,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await db.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(result.Attributes),
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

// DELETE: https://api/questions
// {
//     "id": 123,
//     "category": "Science"
// }
module.exports.deleteQuestion = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: { id: data.id, category: data.category },
    };

    const response = await db.delete(params).promise();
    if (!response) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: "Resource not found",
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ id: data.id, category: data.category }),
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
// GET: https://api/questions

module.exports.getAllQuestions = async () => {
  const params = {
    TableName: process.env.QUESTIONS_TABLE,
  };

  try {
    const result = await db.scan(params).promise();
    const questions = result.Items.map((item) => ({
      id: item.id,
      category: item.category,
      difficulty: item.difficulty,
      question: item.question,
      correct_answer: item.correct_answer,
      wrong_answers: item.wrong_answers,
      tags: item.tags,
    }));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(questions),
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
