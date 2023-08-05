import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

const CategoryForm = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories', {
      category,
      description
    })
    .then(res => {
      console.log(res);
      alert('New category created'); 
      setCategory(''); 
      setDescription(''); 
    })
    .catch(err => console.log(err));
  };

  return (
      
    <form onSubmit={handleSubmit} align="center">
                <h2>Create Category</h2>

          
      <TextField
              label="Category"
              required
        value={category}
        onChange={event => setCategory(event.target.value)}
          />
          <br>
          </br>
          <br></br>
      <TextField
        label="Description"
              value={description}
              required
          rows={3}
          multiline
        onChange={event => setDescription(event.target.value)}
          />
          <br></br>
          <br></br>
      <Button type="submit" variant="contained">
        Create Category
      </Button>
            </form>
         
  );
};

export default CategoryForm;
