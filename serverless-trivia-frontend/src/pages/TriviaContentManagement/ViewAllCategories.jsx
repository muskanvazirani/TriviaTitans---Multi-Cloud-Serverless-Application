import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemButton, ListItemSecondaryAction, IconButton, Grid, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Link, useNavigate  } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

const CategoriesPage = () => {
    const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.log(error));
  };

  const handleDelete = (categoryName) => {
    axios({
      method: 'delete',
      url: 'https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories',
      data: {
        category: categoryName
      }
    })
      .then(response => {
        console.log(response);
        fetchCategories();  
      })
      .catch(error => console.log(error));
  };

    return (
        <div column>          <h2>Categories</h2>

        <Grid container  justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }}>
      <List sx={{ width: '100%', maxWidth: 600, bgcolor: 'background.paper' }}>
        {categories.map((category) => (
        <ListItem disablePadding key={category.category}>
        <ListItemButton>
          <ListItemText
            primary={category.category}
            secondary={category.description}
          />
          <ListItemSecondaryAction>
            <IconButton edge="end"  aria-label="delete" onClick={() => handleDelete(category.category)}>
              <DeleteIcon />
            </IconButton>
            <IconButton edge="end"  aria-label="edit" onClick={() => navigate(`/update-category/${category.category}`)}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItemButton>
      </ListItem>
        ))}
                </List>
              
            </Grid>
            <Box mt={2} > 
            <Link to="/create-category" style={{ textDecoration: 'none' }}> 
              <Button variant="contained" color="primary">
                Category not found? Create one
              </Button>
            </Link>
          </Box>
        </div>

  );
};

export default CategoriesPage;
