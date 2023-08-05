import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, FormLabel, Radio, RadioGroup, FormControlLabel, Grid } from '@mui/material';
import axios from 'axios';
import { Box } from "@mui/material";
import { Link } from 'react-router-dom';
const GameForm = () => {
  const [categories, setCategories] = useState([]);
  const [gameName, setGameName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [timeFrame, setTimeFrame] = useState('30');

  useEffect(() => {
    axios.get('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games', {
      game_name: gameName,
      category,
      difficulty_level: difficulty,
      time_frame: timeFrame
    })
    .then(res => {
      console.log(res);
      alert('Game submitted successfully');
      setGameName('');
      setCategory('');
      setDifficulty('easy');
      setTimeFrame('30');
    })
    .catch(err => console.log(err));
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }}>
          <form onSubmit={handleSubmit}>
          <h2>Create Game</h2>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 1,
          }}
        >
          <Box my={1} width={1}>
            <TextField label="Game Name" value={gameName} onChange={event => setGameName(event.target.value)} fullWidth required/>
          </Box>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={event => setCategory(event.target.value)}>
              {categories.map(cat => <MenuItem key={cat.category} value={cat.category}>{cat.category}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend" >Difficulty Level</FormLabel>
            <RadioGroup row aria-label="difficulty" name="row-radio-buttons-group" value={difficulty} onChange={event => setDifficulty(event.target.value)}>
              <FormControlLabel value="easy" control={<Radio />} label="Easy" />
              <FormControlLabel value="medium" control={<Radio />} label="Medium" />
              <FormControlLabel value="difficult" control={<Radio />} label="Difficult" />
            </RadioGroup>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Time Frame</FormLabel>
            <RadioGroup column aria-label="timeFrame" name="row-radio-buttons-group" value={timeFrame} onChange={event => setTimeFrame(event.target.value)}>
              <FormControlLabel value="15" control={<Radio />} label="15 seconds" />
              <FormControlLabel value="30" control={<Radio />} label="30 seconds" />
              <FormControlLabel value="45" control={<Radio />} label="45 seconds" />
              <FormControlLabel value="60" control={<Radio />} label="60 seconds" />
              <FormControlLabel value="90" control={<Radio />} label="90 seconds" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" variant="contained">
            Create Game
                  </Button>
                  <Box mt={2}> 
            <Link to="/create-category" style={{ textDecoration: 'none' }}> 
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

export default GameForm;
