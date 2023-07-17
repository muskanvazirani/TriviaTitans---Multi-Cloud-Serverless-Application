"use strict";

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
//tested
// POST : create a category API
//POST: https://api_gateway_url.com/categories
// {
//     "category": "Science",
//     "description": "Questions about science"
//   }

module.exports.createCategory = async (event) => {
  const { category, description } = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
    Item: { category, description },
  };

  try {
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
//tested
// PUT: updates description of category in API
//PUT: https://api_gateway_url.com/categories
// {
//     "category": "Science",
//     "newDescription": "Questions about science and nature"
//   }

module.exports.updateCategory = async (event) => {
  const { category, newDescription } = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
    Key: { category },
    UpdateExpression: "set description = :description",
    ExpressionAttributeValues: { ":description": newDescription },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await db.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ category, description: newDescription }),
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
//tested
// DELETE the entire category
//DELETE: https://api_gateway_url.com/categories
// {
//
//     "category": "Science"
//   }

module.exports.deleteCategory = async (event) => {
  const { category } = JSON.parse(event.body);
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
    Key: { category },
  };

  try {
    await db.delete(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify({ category }),
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

//get all categories API : fetch all the categories from the database.
//GET: https://api_gateway_url.com/categories
// {
// }

// module.exports.getAllCategories = async (event) => {
//   const params = {
//     TableName: process.env.CATEGORIES_TABLE,
//   };

//   try {
//     const result = await db.scan(params).promise();
//     return { statusCode: 200, body: JSON.stringify(result.Items) };
//   } catch (dbError) {
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };;
module.exports.getAllCategories = async (event) => {
  const params = {
    TableName: process.env.CATEGORIES_TABLE,
  };

  console.log("Scanning DynamoDB table: ", params.TableName);

  try {
    const result = await db.scan(params).promise();
    console.log("Scan result: ", result);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.Items),
    };
  } catch (dbError) {
    console.error("Error in DynamoDB scan: ", dbError);
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
