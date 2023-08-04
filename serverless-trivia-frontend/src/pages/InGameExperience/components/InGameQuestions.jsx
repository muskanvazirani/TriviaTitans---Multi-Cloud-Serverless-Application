import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Grid, CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material'; // Import icons
import './InGameQuestions.scss'; // Assuming you have an SCSS file for this component

const InGameQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(20);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // Fetch questions from session storage and parse JSON
    const storedQuestions = sessionStorage.getItem('questions-data');
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
    setShowResult(true);
  };

  const handleCloseResultDialog = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="quiz-container">
      <Paper elevation={3} className="question-container">
        <div className="timer-container">
          <CircularProgress
            variant="determinate"
            value={(timer / 20) * 100}
            className="timer"
            size={80}
          />
          <Typography variant="h6" className="timer-text">
            {timer}
          </Typography>
        </div>

        {questions.length > 0 && (
          <>
            <Typography variant="h5" className="question">
              {questions[0].question}
            </Typography>

            <Grid container spacing={2} className="options-container">
              {questions[0].options.map((option, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => handleAnswerClick(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        <Dialog open={showResult} onClose={handleCloseResultDialog}>
          <DialogTitle>
            {selectedAnswer === questions[0]?.correct_answer ? (
              <Typography color="green">
                <CheckCircleOutline fontSize="large" /> Correct Answer!
              </Typography>
            ) : (
              <Typography color="red">
                <ErrorOutline fontSize="large" /> {timer === 0 ? 'Times Up!' : 'Wrong Answer!'}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedAnswer === questions[0]?.correct_answer
                ? 'Congratulations! You have earned a score.'
                : timer === 0
                ? `Sorry!! Times Up. The correct answer is: ${questions[0]?.correct_answer}`
                : `Sorry!! The option you selected is wrong. The correct answer is: ${questions[0]?.correct_answer}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResultDialog} color="primary">
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </div>
  );
};

export default InGameQuestions;
