import axios from 'axios';

export async function addUser(name, email) {
    const response = await axios.post("http://localhost:3000/dev/user", {
        "item": {
            "name": name,
            "email": email
        }
    });
    return response.data;
}

export async function addUserAuthAnswers(data) {
    const response = await axios.post("http://localhost:3000/dev/user-answers", {
        "item": data
    });
    return response.data;
}


export async function validateUserAuthAnswers(data) {
    const response = await axios.post("http://localhost:3000/dev/validate-auth-answers", {
        "item": data
    });
    return response.data;
}
