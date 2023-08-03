import React, { useState } from 'react';
import '../../style/style.css';

function CreateTeam() {
    const [userId, setUserId] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleInputChange = (event) => {
        setUserId(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const teamData = {
            user_id: userId
        };

        try {
            const response = await fetch('https://jzqhr5lure.execute-api.us-east-1.amazonaws.com/create_team', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(teamData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData.team_id) {
                alert(`Team '${responseData.team_name}' successfully created with id: ${responseData.team_id}`);
                setResponseMessage(`Team '${responseData.team_name}' successfully created with id: ${responseData.team_id}`);
                window.location.reload();
            } else {
                alert(`Team creation failed.`);
                setResponseMessage(`Team creation failed.`);
            }
        } catch (error) {
            console.error("Error creating team", error);
            alert(`Error: ${error.message}`);
            setResponseMessage(`Error: ${error.message}`);
        }
    }

    return (
        <div className="create-team">
            <div className='mid-div'>
            <h2>Create Team</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="userId">User ID : </label>
                    <input type="text" id="userId" value={userId} onChange={handleInputChange} />
                </div>
                <button id="userButton" type="submit">Create Team</button>
            </form>
            {responseMessage && (
                <div className="response-message">
                    <p>{responseMessage}</p>
                </div>
            )}
            </div>
        </div>
    );
}

export default CreateTeam;
