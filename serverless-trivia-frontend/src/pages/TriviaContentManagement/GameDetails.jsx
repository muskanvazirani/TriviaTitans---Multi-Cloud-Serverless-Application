import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';

function GameDetails() {
  const [game, setGame] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("");

  const { gameName } = useParams();

  useEffect(() => {
    const fetchGame = async () => {
      const result = await axios(`https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games/${gameName}`);
      setGame(result.data);
      setSelectedCategory(result.data.category);
      setSelectedDifficulty(result.data.difficulty_level);
      setSelectedTimeFrame(result.data.time_frame);
    };

    const fetchCategories = async () => {
      const result = await axios(`https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories`);
      setCategories(result.data.map(item => item.category));
    };

    fetchGame();
    fetchCategories();
  }, [gameName]);

  if (game === null) {
    return <div>Loading...</div>;
  }


  const handleUpdate = async () => {
    await axios.put('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games', {
      ...game,
      category: selectedCategory,
      difficulty_level: selectedDifficulty,
      time_frame: selectedTimeFrame,
    });
  };

  if (game === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{game.game_name}</h1>
      <p>Category: 
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map(category => <option key={category}>{category}</option>)}
        </select>
      </p>
      <p>Difficulty level: 
        <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </p>
      <p>Time frame: 
        <select value={selectedTimeFrame} onChange={(e) => setSelectedTimeFrame(e.target.value)}>
          <option>15 secs</option>
          <option>30 secs</option>
          <option>45 secs</option>
          <option>60 secs</option>
        </select>
      </p>
      <Button variant="contained" color="primary" onClick={handleUpdate}>
        Update
      </Button>
    </div>
  );
}

export default GameDetails;