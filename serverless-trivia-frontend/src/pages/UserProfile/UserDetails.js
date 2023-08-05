import React, { useState } from 'react';
import * as MUI from '@mui/material';
import axios from 'axios';

const UserDetailsBox = ({ userId, username, setUsername, userEmail, setUserEmail, userLocation, setUserLocation, userDateOfBirth, setUserDateOfBirth }) => {
    const [editing, setEditing] = useState(false);
    const handleEditClick = () => {
        setEditing(true);
    };

    const handleSaveClick = () => {
        // Call the backend API to save the edited user details
        setEditing(false);
        saveUserDetails();
    };

    const handleCancelClick = () => {
        setEditing(false);
    };

    const saveUserDetails = async (e) => {
            const response = await axios.post(`https://tuupoe7l0i.execute-api.us-east-1.amazonaws.com/serverlessDev/updateuserdetails`, {
                body: JSON.stringify({
                    userId: userId,
                    username: username,
                    location: userLocation,
                    dateOfBirth: userDateOfBirth,
                    email: userEmail,
                })
            });
            if (response.status === 200) {
                alert('User data saved !');
            } else {
                alert('User data was not saved. Please check the logs!');
            }
    };

    return (
        <MUI.Box sx={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
            {editing ? (
                <div>
                    <MUI.TextField
                        label="Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '10px' }}
                    />
                    <MUI.TextField
                        label="Email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        fullWidth
                        disabled
                        sx={{ marginBottom: '10px' }}
                    />
                    <MUI.TextField
                        label="Location"
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '10px' }}
                    />
                    <MUI.TextField
                        label="Date of Birth"
                        value={userDateOfBirth}
                        onChange={(e) => setUserDateOfBirth(e.target.value)}
                        fullWidth
                        sx={{ marginBottom: '10px' }}
                    />
                    <MUI.Button variant="contained" onClick={handleSaveClick} sx={{ marginRight: '10px' }}>Save</MUI.Button>
                    <MUI.Button variant="contained" onClick={handleCancelClick}>Cancel</MUI.Button>
                </div>
            ) : (
                <div>
                    <MUI.Typography variant="body1" sx={{ marginBottom: '5px' }}>Name: {username}</MUI.Typography>
                    <MUI.Typography variant="body1" sx={{ marginBottom: '5px' }}>Email: {userEmail}</MUI.Typography>
                    <MUI.Typography variant="body1" sx={{ marginBottom: '5px' }}>Location: {userLocation}</MUI.Typography>
                    <MUI.Typography variant="body1" sx={{ marginBottom: '5px' }}>Date of Birth: {userDateOfBirth}</MUI.Typography>
                    <MUI.Button variant="outlined" onClick={handleEditClick}>Edit</MUI.Button>
                </div>
            )}
        </MUI.Box>
    );
};

export default UserDetailsBox;
