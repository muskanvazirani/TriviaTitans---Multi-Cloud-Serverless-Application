import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemButton, Grid, IconButton, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; 
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; 

const QuestionsPage = () => {
  const { category, difficultyLevel } = useParams();
  const navigate = useNavigate(); 
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    axios.get(`https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/questions/${category}/${difficultyLevel}`)
      .then(response => setQuestions(response.data))
      .catch(error => console.log(error));
  };

  const handleDelete = (questionId) => {
    axios({
      method: 'delete',
      url: 'https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/questions',
      data: {
        id: questionId,
        category: category
      }
    })
    .then(response => {
      console.log(response);
      fetchQuestions();  
    })
    .catch(error => console.log(error));
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }}>
      <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
        {questions.map((questionObj, index) => (
          <ListItem disablePadding key={index}>
            <ListItemButton>
              <ListItemText
                primary={`Question ${index+1}: ${questionObj.question}`}
                secondary={`Correct Answer: ${questionObj.correct_answer} | Incorrect Answers: ${questionObj.wrong_answers.join(', ')} | Tags: ${questionObj.tags.join(', ')}`} 
              />
              <ListItemSecondaryAction>
                <IconButton edge="end"  aria-label="delete" onClick={() => handleDelete(questionObj.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton edge="end"  aria-label="edit" onClick={() => navigate(`/update-question/${category}/id/${questionObj.id}`)}> 
                  <EditIcon />  
                </IconButton>
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export default QuestionsPage;
