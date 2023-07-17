// "use strict";

// const AWS = require("aws-sdk");
// const db = new AWS.DynamoDB.DocumentClient();
// const ses = new AWS.SES();

// module.exports.notifyUsers = async (event) => {
//   const params = {
//     TableName: "UsersTable", // Use your actual DynamoDB table name
//   };

//   try {
//     // Retrieve all users
//     const data = await db.scan(params).promise();
//     const users = data.Items;

//     // Loop through each user and send an email
//     users.forEach(async (user) => {
//       const emailParams = {
//         Source: "muskan.user2@gmail.com", // Replace with your verified SES email address
//         Destination: {
//           ToAddresses: [
//             user.email, // Assuming 'email' is the attribute in your Users table
//           ],
//         },
//         Message: {
//           Body: {
//             Text: {
//               Charset: "UTF-8",
//               Data: `Hello, a new game has been created!`,
//             },
//           },
//           Subject: {
//             Charset: "UTF-8",
//             Data: "New Game Created",
//           },
//         },
//       };

//       try {
//         await ses.sendEmail(emailParams).promise();
//       } catch (err) {
//         console.error(err);
//       }
//     });

//     return { statusCode: 200 };
//   } catch (dbError) {
//     console.error(dbError);
//     return { statusCode: 500, body: JSON.stringify(dbError) };
//   }
// };
