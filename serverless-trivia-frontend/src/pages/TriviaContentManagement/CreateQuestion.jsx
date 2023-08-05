import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Radio, RadioGroup, FormControlLabel, Grid } from '@mui/material';
import axios from 'axios';
import { Box } from "@mui/material";
import { Link } from 'react-router-dom'; 
const QuestionForm = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [question, setQuestion] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wrongAnswer1, setWrongAnswer1] = useState('');
  const [wrongAnswer2, setWrongAnswer2] = useState('');
  const [wrongAnswer3, setWrongAnswer3] = useState('');

  useEffect(() => {
    axios.get('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/questions', {
      category,
      difficulty,
      question,
      correct_answer: correctAnswer,
      wrong_answers: [wrongAnswer1, wrongAnswer2, wrongAnswer3]
    })
    .then(res => {
      console.log(res);
      alert('Question submitted successfully');
      setCategory('');
      setDifficulty('easy');
      setQuestion('');
      setCorrectAnswer('');
      setWrongAnswer1('');
      setWrongAnswer2('');
      setWrongAnswer3('');
    })
    .catch(err => console.log(err));
  };

    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }} >

            <form onSubmit={handleSubmit} 
            >
                <h2>Create Question</h2>
                 <Box
      sx={{
        display: "flex",
        flexDirection: "column",
                    alignItems: "center",
                    width: 1,
                    
      }}
    >
                <FormControl
                        fullWidth
                     required>
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={event => setCategory(event.target.value)}>
          {categories.map(cat => <MenuItem key={cat.category} value={cat.category}>{cat.category}</MenuItem>)}
        </Select>
                </FormControl>
                <br></br>
      <FormControl component="fieldset">
        <RadioGroup row aria-label="difficulty" name="row-radio-buttons-group" value={difficulty} onChange={event => setDifficulty(event.target.value)}>
          <FormControlLabel value="easy" control={<Radio />} label="Easy" />
          <FormControlLabel value="medium" control={<Radio />} label="Medium" />
          <FormControlLabel value="difficult" control={<Radio />} label="Difficult" />
        </RadioGroup>
                    </FormControl>
                    
                    <TextField required label="Question" value={question} multiline rows={2} onChange={event => setQuestion(event.target.value)} fullWidth />
      <br></br>
      <Box my={1} width={1}>
            <TextField required label="Correct Answer" value={correctAnswer} onChange={event => setCorrectAnswer(event.target.value)} fullWidth />
          </Box>
          <Box my={1} width={1}>
            <TextField required label="Wrong Answer 1" value={wrongAnswer1} onChange={event => setWrongAnswer1(event.target.value)} fullWidth />
          </Box>
          <Box my={1} width={1}>
            <TextField required label="Wrong Answer 2" value={wrongAnswer2} onChange={event => setWrongAnswer2(event.target.value)} fullWidth />
          </Box>
          <Box my={1} width={1}>
            <TextField required label="Wrong Answer 3" value={wrongAnswer3} onChange={event => setWrongAnswer3(event.target.value)} fullWidth />
          </Box>
      <Button type="submit" variant="contained">
        Create Question
            </Button>
            <Box mt={2}> 
            <Link to="/create-category" style={{ textDecoration: 'none' }}>  {/* Link to create categories page */}
              <Button variant="contained" color="primary">
                Category not found? Create one
              </Button>
            </Link>
          </Box>
      </Box>

            </form>
            </Grid>
  );
};

export default QuestionForm;
