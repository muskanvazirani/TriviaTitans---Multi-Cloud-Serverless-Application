import React, { useState, useRef, useEffect } from 'react';
import { Paper, TextField, Button } from '@mui/material';
import axios from 'axios';

const ChatWindow = ({ onClose }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const chatContainerRef = useRef(null);

    useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;

    }, [messages]);

    const handleInput = (e) => {
        setInputText(e.target.value);
    };

    const handleSend = async () => {
        if (inputText.trim() !== '') {
            const newUserMessage = { text: inputText, sender: 'user' };
            setMessages([...messages, newUserMessage]);
            setInputText('');
            console.log('inputText:',inputText);
            try {
                const response = await axios.post('https://tuupoe7l0i.execute-api.us-east-1.amazonaws.com/serverlessDev/sendlextext', {
                    message: inputText,
                });
                if (response.status === 200) {
                    console.log('response.data:',response.data);
                    const botReply = response.data.body;
                    const newBotMessage = { text: botReply, sender: 'bot' };
                    setMessages((prevMessages) => [...prevMessages, newBotMessage]);
                    setTimeout(() => {
                        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                    }, 100);
                }else{
                    alert('Something went wrong with the Lex Bot');
                }

            } catch (error) {
                console.error('Error sending message to Lex:', error);
            }
        }
    };

    return (
        <Paper
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '300px',
                maxHeight: '400px',
                overflowY: 'hidden',
                zIndex: 1000,
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                gridTemplateAreas: '"heading" "messages" "input"',
            }}
        >

            <div
                style={{
                    padding: '5px',
                    borderBottom: '1px solid #ccc',
                    textAlign: 'center',
                    backgroundColor: '#f0f0f0',
                    fontWeight: 'bold',
                }}
            >
                Trivia Chatbot
                <button onClick={onClose} style={{ float: 'right', border: 'none', background: 'none', cursor: 'pointer' }}>Close</button>
            </div>
            <div
                style={{
                    padding: '10px',
                    overflowY: 'scroll',
                    gridArea: 'messages',
                    maxHeight: '300px',
                }}
                ref={chatContainerRef}
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        style={{
                            textAlign: message.sender === 'bot' ? 'left' : 'right',
                            margin: '5px 0',
                            display: 'flex',
                            flexDirection: 'column', // Set flex direction to column
                            alignItems: message.sender === 'bot' ? 'flex-start' : 'flex-end',
                        }}
                    >
            <span style={{ color: message.sender === 'bot' ? 'blue' : 'green' }}>
                {message.sender === 'bot' ? 'Lex' : 'You'}
            </span>
                        <span>{message.text}</span>
                    </div>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gridArea: 'input', padding: '10px' }}>
                <TextField
                    fullWidth
                    label="Type a message"
                    value={inputText}
                    onChange={handleInput}
                    style={{ flex: 1 }}
                />
                <Button variant="contained" color="primary" onClick={handleSend} style={{ marginLeft: '10px' }}>
                    Send
                </Button>
            </div>
        </Paper>
    );


};

export default ChatWindow;
