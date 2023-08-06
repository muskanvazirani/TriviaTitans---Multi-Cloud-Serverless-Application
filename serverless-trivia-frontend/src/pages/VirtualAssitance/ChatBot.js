import React, { useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWindow from './ChatWindow';

const Chatbot = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleClose = () => {
        setIsChatOpen(false);
    };

    return (
        <div>
            {isChatOpen && (
                <ChatWindow onClose={handleClose} />
            )}
            {!isChatOpen && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                        cursor: 'pointer',
                    }}
                    onClick={toggleChat}
                >
                    <ChatIcon style={{ fontSize: '60px', color: '#007bff' }} />
                </div>
            )}
        </div>
    );
};

export default Chatbot;
