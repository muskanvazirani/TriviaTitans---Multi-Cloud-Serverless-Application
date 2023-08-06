import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Radio, RadioGroup, FormControlLabel, Grid, FormLabel } from '@mui/material';
import axios from 'axios';
import { Box } from "@mui/system";
import { useParams } from 'react-router-dom';
import { MuiChipsInput } from 'mui-chips-input'

const UpdateQuestion = () => {
  const { category, question_id } = useParams();
  const [questionData, setQuestionData] = useState({});
  const [difficulty, setDifficulty] = useState('easy');

  useEffect(() => {
    axios.get(`https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/questions/${category}/id/${question_id}`)
      .then(response => {
        const questionData = response.data;
        if (!questionData.tags) {
          questionData.tags = [];
        }
          setQuestionData(questionData);
          setDifficulty(questionData.difficulty);

      })
      .catch(error => console.log(error));
  }, []);


  const handleAddChip = (chip) => {
    setQuestionData(prevState => ({
      ...prevState,
      tags: [...prevState.tags, chip]
    }));
  };
  
  const handleDeleteChip = (chip, index) => {
    setQuestionData(prevState => ({
      ...prevState,
      tags: prevState.tags.filter((tag, i) => i !== index)
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    axios.put('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/questions', questionData)
    .then(res => {
      console.log(res);
      alert('Question updated successfully');
    })
    .catch(err => console.log(err));
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }} >
      <form onSubmit={handleSubmit}>
        <h2>Update Question</h2>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 1,
          }}
        >
          <FormControl fullWidth disabled>
            <InputLabel>Category</InputLabel>
            <Select value={category}>
              <MenuItem value={category}>{category}</MenuItem>
            </Select>
          </FormControl>
                  

                  <FormControl component="fieldset" style={{marginBottom: "20px"}}>
                  <FormLabel component="legend" >Difficulty Level</FormLabel>
  <RadioGroup
    row
    aria-label="difficulty"
    name="row-radio-buttons-group"
    value={difficulty}
    disabled
  >
    <FormControlLabel value="easy" control={<Radio />} label="Easy" />
    <FormControlLabel value="medium" control={<Radio />} label="Medium" />
    <FormControlLabel value="difficult" control={<Radio />} label="Difficult" />
                      </RadioGroup>
                      
</FormControl>

<TextField   required label="Question" value={questionData.question} multiline rows={2} onChange={event => setQuestionData({ ...questionData, question: event.target.value })} fullWidth style={{marginBottom: "20px"}} />

<TextField required label="Correct Answer" value={questionData.correct_answer} onChange={event => setQuestionData({...questionData, correct_answer: event.target.value})} fullWidth style={{marginBottom: "20px"}} />

{questionData.wrong_answers && questionData.wrong_answers.map((answer, index) => (
  <TextField required label={`Wrong Answer ${index+1}`} value={answer} key={index} onChange={event => {
    let newWrongAnswers = [...questionData.wrong_answers];
    newWrongAnswers[index] = event.target.value;
    setQuestionData({...questionData, wrong_answers: newWrongAnswers});
  }} fullWidth style={{marginBottom: "20px"}} />
))}


<MuiChipsInput 
  value={questionData.tags || []}
  onChange={(chips) => setQuestionData({...questionData, tags: chips})}
  label="Tags"
                      fullWidth
                      
/>



          <Button type="submit" variant="contained">
            Update Question
          </Button>
        </Box>
      </form>
    </Grid>
  );
};

export default UpdateQuestion;
