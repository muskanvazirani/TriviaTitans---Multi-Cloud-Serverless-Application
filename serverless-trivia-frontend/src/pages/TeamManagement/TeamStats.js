import React, { useState } from 'react';
import '../../style/style.css';

function TeamStats() {
    const [teamId, setTeamId] = useState("");
    const [teamStats, setTeamStats] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const fetchTeamStats = async (event) => {
        event.preventDefault();

        const response = await fetch("https://jzqhr5lure.execute-api.us-east-1.amazonaws.com/team_stats", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ team_id: teamId }),
        });

        const data = await response.json();

        if (response.ok) {
            setTeamStats(data);
            setResponseMessage("");
        } else {
            setTeamStats(null);
            setResponseMessage(data.status);
        }
    }

    return (
        <div className="team-stats">
            <h2>Team Stats</h2>
            <form onSubmit={fetchTeamStats}>
                <div className="form-group">
                    <label htmlFor="teamId">Team ID:</label>
                    <input type="text" id="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} />
                </div>
                <button type="submit" id="userButton">Get Team Stats</button>
            </form>
            {teamStats && (
                <div className="team-stats-data">
                    <h3>Team Stats:</h3>
                    <p>Average Win: {teamStats.avg_win}</p>
                    <p>Average Loss: {teamStats.avg_loss}</p>
                    <p>Average Draw: {teamStats.avg_draw}</p>
                </div>
            )}
            {responseMessage && (
                <div className="response-message">
                    <p>{responseMessage}</p>
                </div>
            )}
        </div>
    );
}

export default TeamStats;
