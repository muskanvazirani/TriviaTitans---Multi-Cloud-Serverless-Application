import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function GamesList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      console.log('Fetching games...');
      const result = await axios('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games');
      console.log('Got games:', result.data);
      setGames(result.data);
    };

    fetchGames();
  }, []);

  console.log('Rendering with games:', games);

  return (
    <div>
      <h1>All Games</h1>
      {games.map(game => {
        console.log('Rendering game:', game);
        return (
          <h2 key={game.game_id}>
            <Link to={`/games/${encodeURIComponent(game.game_name)}`}>{game.game_name}</Link>
          </h2>
        );
      })}
    </div>
  );
}

export default GamesList;
