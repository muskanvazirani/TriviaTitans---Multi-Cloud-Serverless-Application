const axios = require("axios");
const AWS = require("aws-sdk");
const { Firestore } = require("@google-cloud/firestore");
const S3 = new AWS.S3();

const getCredentials = async () => {
  const params = {
    Bucket: "firebas-geame-play",
    Key: "game-analysis-394811-a27dad77246d.json",
  };
  const { Body } = await S3.getObject(params).promise();
  return JSON.parse(Body.toString());
};

const fetchTeamsData = async () => {
  const response = await axios.get(
    "https://jzqhr5lure.execute-api.us-east-1.amazonaws.com/get_all_teams_data"
  );
  return response.data;
};

const syncGameData = async () => {
  const credentials = await getCredentials();

  const firestore = new Firestore({
    projectId: "game-analysis-394811",
    credentials: credentials,
  });

  const teamsData = await fetchTeamsData();

  for (const item of teamsData) {
    const { team_name, total_draw, total_loss, total_win } = item;

    if (total_draw + total_loss + total_win === 0) {
      continue;
    }

    const docRef = firestore.collection("gameplay-stats").doc(team_name);
    await docRef.set({
      team_name: team_name,
      total_draw: total_draw,
      total_loss: total_loss,
      total_win: total_win,
    });
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({ message: "Sync completed" }),
  };
};

module.exports = {
  syncGameData,
};
