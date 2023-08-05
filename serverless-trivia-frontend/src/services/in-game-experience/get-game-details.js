import axios from 'axios';

const apiUrl = process.env.REACT_APP_IN_GAME_EXP_API_URL; 

export async function getGameDetails(gameId) {
    const response = await axios.get(`${apiUrl}/get-game-details?game_id=${gameId}`);
    return response.data;
}