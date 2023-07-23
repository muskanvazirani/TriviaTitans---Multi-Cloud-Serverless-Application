import React, { useState } from 'react';
import '../../style/style.css';

function TeamActionForm() {
    const [teamId, setTeamId] = useState("");
    const [userId, setUserId] = useState("");
    const [action, setAction] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
            team_id: teamId,
            user_id: userId,
            action: action,
        };

        fetch("https://jzqhr5lure.execute-api.us-east-1.amazonaws.com/team", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                alert(`Action '${action}' successfully performed on team '${teamId}' for user '${userId}'.`);
            } else {
                alert(`Action failed: ${data.message}`);
            }
            setResponseMessage(data.status);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        });
    };

    return (
        <div className="team-action-form">
            <h2>Team Action Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="teamId">Team ID:</label>
                    <input type="text" id="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="userId">User ID:</label>
                    <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="action">Action:</label>
                    <select id="action" value={action} onChange={(e) => setAction(e.target.value)}>
                        <option value="">--Please choose an action--</option>
                        <option value="promote_to_admin">Promote to Admin</option>
                        <option value="remove_member">Remove Member</option>
                        <option value="leave_team">Leave Team</option>
                        <option value="add_member">Add Member</option>
                    </select>
                </div>
                <button type="submit" id="userButton">Submit</button>
            </form>
            {responseMessage && (
                <div className="response-message">
                    <p>{responseMessage}</p>
                </div>
            )}
        </div>
    );
}

export default TeamActionForm;
