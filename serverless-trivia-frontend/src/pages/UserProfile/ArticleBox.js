import React, { useState, useEffect } from 'react';
import * as MUI from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import GroupsIcon from '@mui/icons-material/Groups';
import axios from "axios";

const ArticleBox = ({userId}) => {

    const [achievements, setAchievements] = useState([]);
    const [gameStat, setGameStat] = useState({});
    const [currentTeam, setCurrentTeam] = useState([]);

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

    const handleExitTeam = async (teamId) => {
        try {
            console.log('Existing team');
            const response = await axios.post(`https://tuupoe7l0i.execute-api.us-east-1.amazonaws.com/serverlessDev/exitteam`, {
                body: JSON.stringify({
                    userId: userId,
                    teamId: teamId
                })
            });

            if (response.status === 200) {
                alert('You have successfully existed the team');
                fetchUserStats(userId);
            } else {
                console.log('Failed to exit team');
            }
        } catch (error) {
            console.error('Error exiting team:', error);
            alert('Error exiting team.');
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
                            <MUI.Typography variant="body1">{gameStat.gamesWon}/{gameStat.gamesLost}</MUI.Typography>
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
                <div style={{ height: '200px', marginBottom: '20px', overflow: 'auto', boxShadow: '0px 0px 5px 0px rgba(0,0,0.2,0.2)', borderRadius: '10px' }}>
                    <MUI.List sx={{ marginBottom: '20px',marginLeft: '10px', textAlign: 'center' }}>
                        {achievements.map((achievement) => (
                            <MUI.ListItem key={achievement.userId} sx={{ padding: '5px 0', fontWeight: 'bold' }}>
                                <MUI.ListItemIcon>
                                    <StarBorderIcon sx={{ fontSize: 20, color: 'gold' }} />
                                </MUI.ListItemIcon>
                                <MUI.ListItemText primary={achievement.userId} secondary={`Games Played: ${achievement.gamesPlayed}, Games Won: ${achievement.gamesWon}, Games Lost: ${achievement.gamesLost}`} />
                            </MUI.ListItem>
                        ))}
                    </MUI.List>
                </div>
                <MUI.Typography variant="h5" sx={{ marginBottom: '20px' }}>Current Team Affiliations</MUI.Typography>
                <MUI.List sx={{ marginBottom: '20px',marginLeft: '10px', textAlign: 'center' }}>
                    {Object.values(currentTeam).map((team) => (
                        <MUI.ListItem key={team.team_name} sx={{ padding: '5px 0', fontWeight: 'bold' }}>
                            <MUI.ListItemIcon>
                                <GroupsIcon sx={{ fontSize: 20, color: 'blue' }} />
                            </MUI.ListItemIcon>
                            <MUI.ListItemText primary={team.team_name} secondary={`Members: ${team.members.map((member) => member.user_id).join(', ')}`} />
                            <MUI.Button variant="outlined" sx={{ color: 'red', borderColor: 'red' }} size="small" onClick={() => handleExitTeam(team.team_id)}>
                                Exit Team
                            </MUI.Button>
                        </MUI.ListItem>
                    ))}
                </MUI.List>
            </MUI.CardContent>
        </MUI.Card>
    );
};

export default ArticleBox;
