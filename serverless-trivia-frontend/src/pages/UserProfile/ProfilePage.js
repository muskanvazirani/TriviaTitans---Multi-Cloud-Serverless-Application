import React, { useState, useRef, useEffect} from 'react';
import * as MUI from '@mui/material';
import '../../style/ProfilePage.css';
import { Box, Grid} from '@mui/material';
import ArticleBox from "./ArticleBox";
import UserDetailsBox from "./UserDetails";
import axios from "axios";

const ProfilePage = () => {
    const [profilePicture, setProfilePicture] = useState('');
    const fileInputRef = useRef(null);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [userDateOfBirth, setUserDateOfBirth] = useState('');
    const [userId, setUserId] = useState('User1');//this is temp code
    const [articleBoxKey, setArticleBoxKey] = useState(0); //temp code

    useEffect(() => {
        console.log('Fetching user data...');
        const userId2 = localStorage.getItem("email");
        fetchUserData(userId2);
    }, [userId]);

    const handleUserSelectChange = (event) => {
        const selectedUserId = event.target.value;
        setUserId(selectedUserId); // Update the state with selected user ID
        fetchUserData(selectedUserId);
        setArticleBoxKey(articleBoxKey + 1);
    };

    const fetchUserData = async (selectedUserId) => {
        try {
            console.log('selected User:',selectedUserId);
            const response = await axios.post(`https://tuupoe7l0i.execute-api.us-east-1.amazonaws.com/serverlessDev/fetchtriviauserdata`, {
                body: JSON.stringify({
                    userId: selectedUserId
                })
            });
            if (response.status === 200) {
                const parsedData = JSON.parse(response.data.body);
                console.log('parsedData',parsedData);
                const {profilepicture, username, email, location, dateOfBirth} = parsedData;
                setProfilePicture(profilepicture);
                setUsername(username);
                setUserEmail(email);
                setUserLocation(location);
                setUserDateOfBirth(dateOfBirth);
            }
        } catch (error) {
            console.log('Error fetching addon details:', error);
        }
    };

    const handleProfilePictureChange = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(URL.createObjectURL(file));

            const reader = new FileReader();
            reader.onloadend = () => {
                // Get the Base64 representation of the image
                const base64Image = reader.result;
                // Call the backend API to upload the profile picture
                uploadProfilePicture(base64Image);
            };
            reader.readAsDataURL(file);
        }
    };


    const uploadProfilePicture = async (base64Image) => {
        try {
            const response = await axios.post(`https://tuupoe7l0i.execute-api.us-east-1.amazonaws.com/serverlessDev/uploadprofilepicture`, {
                body: JSON.stringify({
                    userId: userId,
                    profilepicture: base64Image,
                })
            });

            if (response.status === 200) {
                setProfilePicture(base64Image);
                alert('Profile picture uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            alert('Error uploading profile picture.');
        }
    };

    return (
        <div style={{ backgroundColor: 'white'}}>
            {/*<MUI.Box sx={{ padding: '10px' }}>
                <MUI.Typography variant="h6">Select User:</MUI.Typography>
                <MUI.Select
                    value={userId}
                    onChange={handleUserSelectChange}
                    sx={{ minWidth: '200px', marginBottom: '20px' }}
                >
                    <MUI.MenuItem value="User1">User1</MUI.MenuItem>
                    <MUI.MenuItem value="User2">User2</MUI.MenuItem>
                    <MUI.MenuItem value="User3">User3</MUI.MenuItem>
                </MUI.Select>
            </MUI.Box>*/}
            <Box name="mainBox" sx={{display: 'flex',marginTop: '8px' }}>
                <Grid container spacing={2} sx={{ gap: 1 }}>
                    <Grid name="grid1" item xs={12} sm={2} md={2} style={{ display: 'inline-block', justifyContent: 'center', maxWidth: '100%', width: '350px' }}>
                        <Box name="detailsBox" sx={{width: 'fit-content', flexDirection: 'column', display: 'flex', gap: '0px', backgroundColor: '#ffff', alignItems: 'center' }}>
                            <Box name="profilePictureBox" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', backgroundColor: '#ffff', padding: '20px', border: '2px solid #ffff' }}>
                                <Box sx={{width: '300px', height: '300px', borderRadius: '10px', overflow: 'hidden',boxShadow: '15px 20px 20px -10px rgba(0, 0, 0, 10)',}}>
                                    <img src={profilePicture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <input type="file" accept="image/*" onChange={handleFileInputChange} ref={fileInputRef} style={{ display: 'none' }}/>
                                    <MUI.Button variant="contained" size="small" onClick={handleProfilePictureChange}>Change Picture</MUI.Button>
                                </div>
                            </Box>
                            <UserDetailsBox userId={userId} username={username} setUsername={setUsername} userEmail={userEmail} setUserEmail={setUserEmail} userLocation={userLocation} setUserLocation={setUserLocation} userDateOfBirth={userDateOfBirth} setUserDateOfBirth={setUserDateOfBirth}/>
                        </Box>
                    </Grid>
                    <Grid name="grid2" item xs={12} sm={6} md={9} sx={{flex: '1 1 auto', width: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box name="bannerBox" sx={{ flex: 1, flexDirection: 'column', display: 'flex', marginLeft: '20px', marginRight: '20px'}}>
                            <Box name="featureBox" sx={{ height: '180px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffff' }}>
                                <div>
                                    <h1 style={{ margin: 0 }}> Hello {username}</h1>
                                    <h3 style={{ margin: 0 }}>{userEmail}</h3>
                                </div>
                            </Box>
                            <ArticleBox key={articleBoxKey} userId={userId}/>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default ProfilePage;