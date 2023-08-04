import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LookerData from './LookerDashboard';
import { Card, CardContent, CardActions, Typography, Grid, Box } from '@mui/material';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const fetchGameplayData = async () => {
    setLoading(true);
    try {
      await axios.post('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/syncGameData');
      setDataFetched(true);
    } catch (error) {
      console.error("Error fetching game play data:", error);
    }
    setLoading(false);
  };

  return (
    <div>

    <h1>Admin Dashboard</h1>
    <Box pt={5}>
    <Grid container spacing={5} justifyContent="center" > 
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h5">Manage Games</Typography>
          </CardContent>
          <CardActions>
            <Box display="flex" justifyContent="space-around" width="100%">
              <Button component={Link} to="/view-all-games" variant="contained">View Games</Button>
              <Button component={Link} to="/create-game" variant="contained" >Create Game</Button>
            </Box>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h5">Manage Questions</Typography>
          </CardContent>
          <CardActions>
            <Box display="flex" justifyContent="space-around" width="100%">
              <Button component={Link} to="/view-all-questions" variant="contained">View All Questions</Button>
              <Button component={Link} to="/create-question" variant="contained" >Create Question</Button>
            </Box>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h5">Manage Categories</Typography>
          </CardContent>
          <CardActions>
            <Box display="flex" justifyContent="space-around" width="100%">
              <Button component={Link} to="/create-category" variant="contained">Create Category</Button>
              <Button component={Link} to="/view-all-categories" variant="contained" >View Categories</Button>
            </Box>
          </CardActions>
        </Card>
      </Grid>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h5">Monitoring</Typography>
          </CardContent>
          <CardActions>
            <Box display="flex" justifyContent="center" width="100%">
              <Button variant="contained" color="primary" onClick={fetchGameplayData}>
                Monitor Game Play Data
              </Button>
              {loading && <p>Loading...</p>}
              {dataFetched && !loading && <LookerData />}
            </Box>
          </CardActions>
        </Card>
      </Grid>
      </Grid>
      </Box>
      </div>
  );
};

export default AdminDashboard;
