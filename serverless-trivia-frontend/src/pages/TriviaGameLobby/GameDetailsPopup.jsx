import React, { useEffect, useState } from "react";

import { Link, useLocation, useParams , useNavigate} from "react-router-dom";

import axios from 'axios';




function GameDetailsPopup() {
  const [participants, setParticipants] = useState('');
  const [timeremaining, setTimeRemaining] = useState('');
  const [flagval, setFlagVal] = useState(false);

  
    const navigate = useNavigate();

    const location = useLocation();

    const activeGame = location.state?.game;

    const gameIdVal = activeGame.game_id;
console.log("------", activeGame);
  const [game, setGame] = useState(null);

  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {

      const dataVal={
        "gameId": gameIdVal + ""
        }

    const requestPayload = {
        method: 'POST',
        body: JSON.stringify(dataVal) // Convert the data object to a JSON string

      };

      try {
          const response = await axios.post('https://u0ubbqcm00.execute-api.us-east-1.amazonaws.com/Dev/paticipants', dataVal);
          console.log("-----------Success--------------------")
          console.log(response.data.value?.length);
          setParticipants(response.data.value?.length);

           // Extract the 'JoinTime' values and store them in a string array
      const joinTimesArray = response.data.value.map(item => item.JoinTime);
      console.log("joie array ", joinTimesArray)

 

      
      const earliestDate = joinTimesArray.reduce((minDate, currentDate) => {
        const currentDateTime = new Date(currentDate);
        return currentDateTime < minDate ? currentDateTime : minDate;
      }, new Date(joinTimesArray[0]));

      console.log("Earliest date:", earliestDate);

 

      const differenceInMilliseconds = Math.abs(new Date() - earliestDate);
      const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

      const remaining =  30 - differenceInMinutes;
      const remainintime = Math.floor(remaining);
      if(remaining < 1){
        setFlagVal(true);
        setTimeRemaining(0);
      }
      else{
        setTimeRemaining(remainintime);
      }


      console.log(`Difference in minutes: ${Math.floor(remaining)}`);

          
      } catch (error) {
          console.error('Error fetching data:', error);
      }
      };

  fetchData();
   }, []);


  const handleJoin = async (game) => {

    //const {email} = JSON.parse(window.sesssionStorage.getItem("user-details"));
    // Check if user details exist in session storage
    sessionStorage.setItem("game_id", gameIdVal + "")
    console.log(gameIdVal);
    console.log("------------");
    const dataVal={
      "GameId": gameIdVal + "",
      "EmailId":'nh@gmail.com',
      "JoinTime":new Date()
      }

  const requestPayload = {
      method: 'POST',
      body: JSON.stringify(dataVal) // Convert the data object to a JSON string
    };

    console.log("------- request");
    console.log(requestPayload);
    try {
      const response = await axios.post('https://u0ubbqcm00.execute-api.us-east-1.amazonaws.com/Dev/joinedgames', requestPayload);
      console.log("-----response -----");

      console.log(response);
      console.log(response.data.value);
      
  } catch (error) {
      console.error('Error fetching data:', error);
  }

  const dataVal2={
    "gameId": activeGame.game_id + ""
    }

  try {
    const response = await axios.post('https://u0ubbqcm00.execute-api.us-east-1.amazonaws.com/Dev/paticipants', dataVal2);
    console.log(response.data.value?.length);
    setParticipants(response.data.value?.length);

    const joinTimesArray = response.data.value.map(item => item.JoinTime);

    const earliestDate = joinTimesArray.reduce((minDate, currentDate) => {
      const currentDateTime = new Date(currentDate);
      return currentDateTime < minDate ? currentDateTime : minDate;
    }, new Date(joinTimesArray[0]));

    console.log("Earliest date:", earliestDate);



    const differenceInMilliseconds = Math.abs(new Date() - earliestDate);
    const differenceInMinutes = differenceInMilliseconds / (1000 * 60);

    const remaining =  30 - differenceInMinutes;
    const remainintime = Math.floor(remaining);
    if(remaining < 1){
      setFlagVal(true);
      setTimeRemaining(0);
    }
    else{
      setTimeRemaining(remainintime);
    }




    
} catch (error) {
    console.error('Error fetching data:', error);
}
  };



  if (!activeGame) {

    console.log(activeGame)

    return <div>

       

        Loading...</div>;

  }

 

  return (

    <div className="container">

      <div className="game-details card" style={{width: '61%',
    border: '1px solid black',
    padding: '10px',
    position: 'absolute',
    left: '19rem',
    top: '7rem',
    }}>

        <h2>{activeGame.game_name}</h2>

        <p>Category: {activeGame.category}</p>

        <p>Difficulty: {activeGame.difficulty_level}</p>

        <p>Number of Participants: {participants}</p>

        <p>Time Remaining: {timeremaining}</p>

        <button disabled={flagval} style={{ color: "green" }} onClick={() => handleJoin()}>Join</button>

        <Link to="/gamelist" className="btn btn-primary">

          Go Back

        </Link>

        {/* <button className="btn btn-primary" onClick={() => handleJoinGame(game)}>

          Join Game

        </button> */}

      </div>

    </div>

  );

}




export default GameDetailsPopup;


