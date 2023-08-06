import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateCategoryPage = () => {
  const { categoryName } = useParams();
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios({
      method: 'put',
      url: 'https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories',
      data: {
        category: categoryName,
        newDescription: description
      }
    })
      .then(response => {
        console.log(response);
        alert("Category has been updated successfully!");
      })
      .catch(error => console.log(error));
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }}>
      <form onSubmit={handleSubmit}>
        <h1>Update Category</h1>
        <h2>Category: {categoryName}</h2>
        <TextField
          required
          id="description"
          label="New Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          variant="outlined"
        />
        <Box mt={2}>
          <Button variant="contained" color="primary" type="submit">
            Update Category
          </Button>
        </Box>
      </form>
    </Grid>
  );
};

export default UpdateCategoryPage;
