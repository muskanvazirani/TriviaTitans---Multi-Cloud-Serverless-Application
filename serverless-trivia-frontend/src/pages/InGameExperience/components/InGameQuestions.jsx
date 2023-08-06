import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import "./InGameQuestions.scss";
import { storeUserScore } from "../../../services/in-game-experience/store-user-score";
import { getGameDetails } from "../../../services/in-game-experience/get-game-details";
import { storeTeamScore } from "../../../services/in-game-experience/store-team-score";
import { useNavigate } from "react-router-dom";

const InGameQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userGameScore, setUserGameScore] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch questions from session storage and parse JSON
    const storedQuestions = sessionStorage.getItem("questions-data");

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }

    // Start countdown timer
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        clearInterval(countdown);
        setShowResult(true);
      }
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(countdown);
  }, [timer]);

  const handleAnswerClick = (selectedOption) => {
    setSelectedAnswer(selectedOption);
    // setShowResult(true);
  };

  const handleCloseResultDialog = async () => {
    setSelectedAnswer(null);
    setShowResult(false);
    // Update user score
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrectAnswer = selectedAnswer === currentQuestion.correct_answer;
    const userScore = isCorrectAnswer ? 10 : 0;
    setUserGameScore(userGameScore + userScore);
    const userData = {
      game_played_id: sessionStorage.getItem("game_played_id"),
      game_id: sessionStorage.getItem("game_id"),
      user_id: JSON.parse(sessionStorage.getItem("user-details")).email,
      question_id: currentQuestion.id,
      score: userScore,
    };

    try {
      await storeUserScore(userData);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
        setTimer(10); // Reset timer
      }

      if (currentQuestionIndex === questions.length - 1) {
        // udpate the team score here
        const gameDetails = await getGameDetails(
          sessionStorage.getItem("game_id")
        );
        await storeTeamScore({
          game_played_id: sessionStorage.getItem("game_played_id"),
          game_id: sessionStorage.getItem("game_id"),
          game_name: gameDetails.game_name,
          team_id: JSON.parse(sessionStorage.getItem("user-details")).team_id,
          score: 10,
          start_time: gameDetails.start_time,
          category: gameDetails.Category,
        });
        setShowGameOver(true);
      }
    } catch (error) {
      console.error("Error storing user score:", error);
    }
  };

  const handleGemOverResultDialog = () => {
    setShowGameOver(false);
    navigate('/gamelist')
  }

  return (
    <div className="">
      <Paper elevation={3} className="question-container">
        <div className="timer-container">
          <CircularProgress
            variant="determinate"
            value={(timer / 10) * 100}
            className="timer"
            size={80}
          />
          <Typography variant="h6" className="timer-text">
            {timer}
          </Typography>
        </div>

        {questions.length > 0 && currentQuestionIndex < questions.length && (
          <>
            <Typography variant="h5" className="question">
              <span className="question-no">
                {" "}
                Question {currentQuestionIndex + 1}:{" "}
              </span>
              <span className="question-description">
                {" "}
                {questions[currentQuestionIndex].question}{" "}
              </span>
            </Typography>

            <Grid container spacing={2} className="options-container">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAnswerClick(option)}
                    disabled={selectedAnswer !== null}
                    className={`${
                      selectedAnswer === option ? "selected-option" : ""
                    }`} // Apply the selected-option class
                  >
                  
                    {option}
                  </Button>
                </Grid>
              ))}
            </Grid>
            {selectedAnswer && (
              <Typography variant="body1" className="selected-answer">
                <strong>Selected Option:</strong> {selectedAnswer}
              </Typography>
            )}
          </>
        )}
        <Dialog open={showResult} onClose={handleCloseResultDialog}>
          <DialogTitle>
            {selectedAnswer ===
            questions[currentQuestionIndex]?.correct_answer ? (
              <Typography color="green">
                <CheckCircleOutline fontSize="large" /> Correct Answer!
              </Typography>
            ) : (
              <Typography color="red">
                <ErrorOutline fontSize="large" />{" "}
                {timer === 0 ? "Times Up!" : "Wrong Answer!"}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedAnswer ===
              questions[currentQuestionIndex]?.correct_answer
                ? "Congratulations! You have earned a score."
                : timer === 0
                ? `Sorry!! Times Up. The correct answer is: ${questions[currentQuestionIndex]?.correct_answer}`
                : `Sorry!! The option you selected is wrong. The correct answer is: ${questions[currentQuestionIndex]?.correct_answer}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResultDialog} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showGameOver} onClose={handleGemOverResultDialog}>
          <DialogTitle>
            
              <Typography color="red">
                <ErrorOutline fontSize="large" />{" "}
                Game over: Thank you for playing
              </Typography>
           
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
                Your score was: {userGameScore}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleGemOverResultDialog} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
      <Typography variant="body1" className="selected-answer">
                <strong>Your Score:</strong> {userGameScore}
      </Typography>
    </div>
  );
};

export default InGameQuestions;
