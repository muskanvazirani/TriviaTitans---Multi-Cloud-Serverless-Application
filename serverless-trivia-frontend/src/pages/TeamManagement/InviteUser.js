import React, { useState } from 'react';
import '../../style/style.css';

function InviteUser() {
    const [teamId, setTeamId] = useState("");
    const [inviterUserId, setInviterUserId] = useState("");
    const [inviteeEmail, setInviteeEmail] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const inviteUser = async (event) => {
        event.preventDefault();

        const response = await fetch("https://jzqhr5lure.execute-api.us-east-1.amazonaws.com/invite_user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team_id: teamId,
                inviter_user_id: inviterUserId,
                invitee_email: inviteeEmail,
                action: "invite_user"
            }),
        });

        const data = await response.json();
        setResponseMessage(data.status);
    }

    return (
        <div className="invite-user">
            <h2>Invite User</h2>
            <form onSubmit={inviteUser}>
                <div className="form-group">
                    <label htmlFor="teamId">Team ID:</label>
                    <input type="text" id="teamId" value={teamId} onChange={(e) => setTeamId(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="inviterUserId">Inviter User ID:</label>
                    <input type="text" id="inviterUserId" value={inviterUserId} onChange={(e) => setInviterUserId(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="inviteeEmail">Invitee Email:</label>
                    <input type="text" id="inviteeEmail" value={inviteeEmail} onChange={(e) => setInviteeEmail(e.target.value)} />
                </div>
                <button id="userButton" type="submit">Invite User</button>
            </form>
            {responseMessage && (
                <div className="response-message">
                    <p>{responseMessage}</p>
                </div>
            )}
        </div>
    );
}

export default InviteUser;
