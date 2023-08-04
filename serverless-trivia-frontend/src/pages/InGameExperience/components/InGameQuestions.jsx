import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Grid, CircularProgress } from '@mui/material';
import './InGameQuestions.scss'; // Assuming you have an SCSS file for this component

const InGameQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(20);

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
          }
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(countdown);
  }, [timer]);

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
                  <Button variant="outlined" fullWidth>
                    {option}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Paper>
    </div>
  );
};

export default InGameQuestions;
