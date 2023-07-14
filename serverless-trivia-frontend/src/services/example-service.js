import axios from 'axios';

const apiURL = "https://jsonplaceholder.typicode.com/posts/1";

export async function getExampleJson() {
    const response = await axios.get(apiURL);
    return response.data;
}