import React, { useEffect, useState } from 'react';
import {
    query,
    collection,
    orderBy,
    onSnapshot,
    limit,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../../../firebase-config';
import {
    TextField,
    Button,
    Container,
    Paper,
    Typography
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import './UserChat.scss';

const UserChat = () => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt'),
            limit(50)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            const sortedMessages = messages.sort(
                (a, b) => a.createdAt - b.createdAt
            );
            setMessages(sortedMessages);
        });

        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newMessage === '') return;
        const { uid, displayName, photoURL } = auth.currentUser;
        await addDoc(collection(db, 'messages'), {
            text: newMessage,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            room: sessionStorage.getItem('game_played_id'),
            uid,
            displayName,
            photoURL
        });

        setNewMessage('');
    };

    return (
        <Container maxWidth="sm" className="user-chat">
            <Paper elevation={3} style={{ padding: '20px', overflow: 'auto', maxHeight: '80%' }}>
            <div className="chat-container">
                    {messages.slice().reverse().map((message) => (
                        <div
                            key={message.id}
                            className={`message-box ${
                                message.uid === auth.currentUser.uid
                                    ? 'right'
                                    : 'left'
                            }`}
                        >
                            <div className="message-content">
                                {message.uid !== auth.currentUser.uid && (
                                    <img
                                        src={message.photoURL}
                                        alt="User"
                                        className="message-image"
                                    />
                                )}
                                <div className="message-text">
                                    <Typography variant="subtitle2">
                                        {message.displayName}
                                    </Typography>
                                    <Typography variant="body1">
                                        {message.text}
                                    </Typography>
                                </div>
                                {message.uid === auth.currentUser.uid && (
                                    <img
                                        src={message.photoURL}
                                        alt="User"
                                        className="message-image"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Type your message here"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '10px' }}
                        endIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default UserChat;