import axios from 'axios';

const apiUrl = process.env.REACT_APP_IN_GAME_EXP_API_URL; 

export async function storeUserScore(data) {
    const response = await axios.post(`${apiUrl}/store-user-score`, data);
    return response.data;
}