import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemButton, ListItemSecondaryAction, IconButton, Grid, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GamesPage = () => {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = () => {
    axios.get('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games')
      .then(response => setGames(response.data))
      .catch(error => console.log(error));
  };

  const handleDelete = (gameId) => {
    axios({
      method: 'delete',
      url: 'https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games',
      data: {
        game_id: gameId
      }
    })
      .then(response => {
        console.log(response);
        fetchGames();  
      })
      .catch(error => console.log(error));
  };

  return (
    <div> <h2>Games</h2>
    <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '10vh' }}>
      <List sx={{ width: '100%', maxWidth: 800, bgcolor: 'background.paper' }}>
        {games.map((game) => (
          <ListItem disablePadding key={game.game_id}>
            <ListItemButton>
              <ListItemText
                primary={`Game Name: ${game.game_name ? game.game_name : 'Unnamed Game'}`}
                secondary={`Category: ${game.category} | Difficulty: ${game.difficulty_level} | Time Frame: ${game.time_frame}` }
              />
              <ListItemSecondaryAction>
                <IconButton edge="end"  aria-label="delete" onClick={() => handleDelete(game.game_id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton edge="end"  aria-label="edit" onClick={() => navigate(`/update-game/${game.game_id}`)} style={{ marginRight: '10px' }}>
                  <EditIcon />
                </IconButton>
                <Button  variant="contained" onClick={() => navigate(`/view-questions/${game.category}/${game.difficulty_level}`)}>
                  View Questions
                </Button>
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      </Grid>
      </div>
  );
};

export default GamesPage;
