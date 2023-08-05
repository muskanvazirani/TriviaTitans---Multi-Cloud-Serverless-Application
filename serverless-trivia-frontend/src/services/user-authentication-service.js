import axios from 'axios';

const apiUrl = process.env.REACT_APP_USER_AUTHENTICATION_API_URL; 

export async function addUser(name, email) {
    const response = await axios.post(`${apiUrl}/user`, {
        "item": {
            "name": name,
            "email": email
        }
    });
    return response.data;
}

export async function addUserAuthAnswers(data) {
    const response = await axios.post(`${apiUrl}/user-answers`, {
        "item": data
    });
    return response.data;
}


export async function validateUserAuthAnswers(data) {
    const response = await axios.post(`${apiUrl}/validate-auth-answers`, {
        "item": data
    });
    return response.data;
}
