// "use strict";

// const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient();

// //get question from a particular category API
// // GET: https://api_gateway_url.com/questions/{category}
// // GET: https://api_gateway_url.com/questions/Science
// // {
// // empty json body
// // }
// module.exports.getCategoryQuestions = async (event) => {
//   const params = {
//     TableName: process.env.QUESTIONS_TABLE,
//     KeyConditionExpression: "category = :category",
//     ExpressionAttributeValues: {
//       ":category": event.pathParameters.category,
//     },
//   };

//   try {
//     const result = await db.query(params).promise();
//     return { statusCode: 200, body: JSON.stringify(result.Items) };
//   } catch (dbError) {
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };

// // post questions  > creates new question and puts in questions table
// // POST: https://api_gateway_url.com/questions
// // {
// //     "id": "123",
// //     "category": "Science",
// //     "difficulty": "medium",
// //     "question": "What is the symbol for the chemical element Hydrogen?",
// //     "correct_answer": "H",
// //     "wrong_answers": ["He", "Hg", "Ho"]
// //   }

// module.exports.createQuestion = async (event) => {
//   const { id, category, difficulty, question, correct_answer, wrong_answers } =
//     JSON.parse(event.body);
//   const params = {
//     TableName: process.env.QUESTIONS_TABLE,
//     Item: { id, category, difficulty, question, correct_answer, wrong_answers },
//   };

//   try {
//     await db.put(params).promise();
//     return { statusCode: 200, body: JSON.stringify(params.Item) };
//   } catch (dbError) {
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };

// // put : updates an existing question in the questions table
// //   PUT: https://api_gateway_url.com/questions
// // {
// //     "id": "123",
// //     "category": "Science",
// //     "difficulty": "medium",
// //     "question": "What is the symbol for the chemical element Helium?",
// //     "correct_answer": "He",
// //     "wrong_answers": ["H", "Hg", "Ho"]
// //   }

// module.exports.updateQuestion = async (event) => {
//   const { id, category, difficulty, question, correct_answer, wrong_answers } =
//     JSON.parse(event.body);
//   const params = {
//     TableName: process.env.QUESTIONS_TABLE,
//     Key: { id, category },
//     UpdateExpression:
//       "set difficulty = :difficulty, question = :question, correct_answer = :correct_answer, wrong_answers = :wrong_answers",
//     ExpressionAttributeValues: {
//       ":difficulty": difficulty,
//       ":question": question,
//       ":correct_answer": correct_answer,
//       ":wrong_answers": wrong_answers,
//     },
//     ReturnValues: "UPDATED_NEW",
//   };

//   try {
//     await db.update(params).promise();
//     return { statusCode: 200, body: JSON.stringify(params.Item) };
//   } catch (dbError) {
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };

// // delete : deletes a question
// //   DELETE: https://api_gateway_url.com/questions
// //   {
// //     "id": "123",
// //     "category": "Science"
// //   }
// //

// module.exports.deleteQuestion = async (event) => {
//   const { id, category } = JSON.parse(event.body);
//   const params = {
//     TableName: process.env.QUESTIONS_TABLE,
//     Key: { id, category },
//   };

//   try {
//     await db.delete(params).promise();
//     return { statusCode: 200, body: JSON.stringify({ id, category }) };
//   } catch (dbError) {
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };
"use strict";

const AWS = require("aws-sdk");
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

// GET: https://api_gateway_url.com/questions/{category}
// module.exports.getCategoryQuestions = async (event) => {
//   const params = {
//     TableName: process.env.QUESTIONS_TABLE,
//     KeyConditionExpression: "category = :category",
//     ExpressionAttributeValues: {
//       ":category": event.pathParameters.category,
//     },
//   };

//   try {
//     const result = await db.query(params).promise();
//     if (!result.Items.length) {
//       return { statusCode: 404, body: "No questions found for this category." };
//     }
//     return { statusCode: 200, body: JSON.stringify(result.Items) };
//   } catch (dbError) {
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };
//
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
      id: item.id, // Number
      category: item.category, // String
      difficulty: item.difficulty, // String
      question: item.question, // String
      correct_answer: item.correct_answer, // String
      wrong_answers: item.wrong_answers, // Array of strings
    }));
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(questions),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(dbError),
    };
  }
};

// POST: https://api_gateway_url.com/questions
// {
//     "id": 123,
//     "category": "Science",
//     "difficulty": "medium",
//     "question": "What is the symbol for the chemical element Hydrogen?",
//     "correct_answer": "H",
//     "wrong_answers": ["He", "Hg", "Ho"]
// }
module.exports.createQuestion = async (event) => {
  try {
    const data = JSON.parse(event.body);
    if (!validateInput(data)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: "Invalid input data",
      };
    }
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Item: data,
    };

    await db.put(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(params.Item),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(dbError),
    };
  }
};

// PUT: https://api_gateway_url.com/questions
// {
//     "id": 123,
//     "category": "Science",
//     "difficulty": "medium",
//     "question": "What is the symbol for the chemical element Helium?",
//     "correct_answer": "He",
//     "wrong_answers": ["H", "Hg", "Ho"]
// }
module.exports.updateQuestion = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const params = {
      TableName: process.env.QUESTIONS_TABLE,
      Key: { id: data.id, category: data.category },
      UpdateExpression:
        "set difficulty = :difficulty, question = :question, correct_answer = :correct_answer, wrong_answers = :wrong_answers",
      ExpressionAttributeValues: {
        ":difficulty": data.difficulty,
        ":question": data.question,
        ":correct_answer": data.correct_answer,
        ":wrong_answers": data.wrong_answers,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await db.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.Attributes),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(dbError),
    };
  }
};

// DELETE: https://api_gateway_url.com/questions
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
          "Access-Control-Allow-Origin": "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: "Resource not found",
      };
    }
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ id: data.id, category: data.category }),
    };
  } catch (dbError) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(dbError),
    };
  }
};
