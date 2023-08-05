import React, { useState, useEffect } from 'react';
import * as MUI from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from "axios";

const ArticleBox = ({userId}) => {

    const [achievements, setAchievements] = useState([]);
    const [gameStat, setGameStat] = useState({});
    const [currentTeam, setCurrentTeam] = useState([]);

    /*const userId = localStorage.getItem("userId");*/
    console.log('Article user id:',userId);
        useEffect(() => {
        // Fetch data from the Lambda API endpoint for "lambda1"
            fetchUserStats();
    }, []);

    const fetchUserStats = async (selectedUserId) => {
        try {
            console.log('selected User:',selectedUserId);
            const response = await axios.post(`https://tuupoe7l0i.execute-api.us-east-1.amazonaws.com/serverlessDev/fetchstats`, {
                body: JSON.stringify({
                    userId: userId
                })
            });
            if (response.status === 200) {
                const parsedData = JSON.parse(response.data.body);
                console.log('ArticlParsedData',parsedData);
                console.log('ArticleUnparsedData',response.data.body);
                setAchievements(parsedData.achievements);
                setGameStat(parsedData.gameStat);
                setCurrentTeam(parsedData.currentTeam);
            }
        } catch (error) {
            console.log('Error fetching addon details:', error);
        }
    };
    return (
        <MUI.Card sx={{ marginBottom: '20px' }}>
            <MUI.CardContent>
                <MUI.Typography variant="h5" sx={{ marginBottom: '20px' }}>Game Statistics</MUI.Typography>
                <MUI.Grid container spacing={2} sx={{ marginBottom: '20px' }}>
                    <MUI.Grid item xs={4}>
                        <MUI.Paper sx={{ padding: '10px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                            <MUI.Typography variant="h6">Games Played</MUI.Typography>
                            <MUI.Typography variant="body1">{gameStat.gamesPlayed}</MUI.Typography>
                        </MUI.Paper>
                    </MUI.Grid>
                    <MUI.Grid item xs={4}>
                        <MUI.Paper sx={{ padding: '10px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                            <MUI.Typography variant="h6">Win/Loss Ratio</MUI.Typography>
                            <MUI.Typography variant="body1">{gameStat.gamesWon}:{gameStat.gamesLost}</MUI.Typography>
                        </MUI.Paper>
                    </MUI.Grid>
                    <MUI.Grid item xs={4}>
                        <MUI.Paper sx={{ padding: '10px', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
                            <MUI.Typography variant="h6">Total Points Earned</MUI.Typography>
                            <MUI.Typography variant="body1">{gameStat.gamePoints}</MUI.Typography>
                        </MUI.Paper>
                    </MUI.Grid>
                </MUI.Grid>

                <MUI.Typography variant="h5" sx={{ marginBottom: '20px' }}>Compare Achievements</MUI.Typography>
                <MUI.List sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    {achievements.map((achievement) => (
                        <MUI.ListItem key={achievement.userId} sx={{ padding: '5px 0', fontWeight: 'bold' }}>
                            <MUI.ListItemIcon>
                                <CheckCircleOutlineIcon sx={{ fontSize: 20, color: 'green' }} />
                            </MUI.ListItemIcon>
                            <MUI.ListItemText primary={achievement.userId} secondary={`Rank: ${achievement.rank}, Highest Score: ${achievement.highestScore}, Win Streak: ${achievement.winStreak}`} />
                        </MUI.ListItem>
                    ))}
                </MUI.List>
                <MUI.Typography variant="h5" sx={{ marginBottom: '20px' }}>Current Team Members</MUI.Typography>
                <MUI.List sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    {Object.values(currentTeam).map((team) => (
                        <MUI.ListItem key={team.team_name} sx={{ padding: '5px 0', fontWeight: 'bold' }}>
                            <MUI.ListItemIcon>
                                <AccountCircleIcon sx={{ fontSize: 20 }} />
                            </MUI.ListItemIcon>
                            <MUI.ListItemText primary={team.team_name} secondary={`Members: ${team.members.map((member) => member.user_id).join(', ')}`} />
                        </MUI.ListItem>
                    ))}
                </MUI.List>
            </MUI.CardContent>
        </MUI.Card>
    );
};

export default ArticleBox;
