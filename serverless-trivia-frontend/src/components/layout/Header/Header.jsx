import React, { useState, useEffect } from 'react';
import './Header.scss';
import './Notifications.css';

function Header({ toggleSideNav }) {
      const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('notifications');
        if (savedNotifications) {
            return JSON.parse(savedNotifications);
        } else {
            return [];
        }
    });
    const [display, setDisplay] = useState(false);

    const fetchNotifications = async () => {
        const response = await fetch('https://tsa1d57t00.execute-api.us-east-1.amazonaws.com/process-notifications');
        const data = await response.json();
        const newNotifications = data.notifications.concat(notifications);
        setNotifications(newNotifications);
    };

    useEffect(() => {
        if (display) {
            fetchNotifications();
        }
    }, [display]);

    useEffect(() => {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }, [notifications]);

    const handleBellClick = () => {
        setDisplay(!display);
    };

    const removeNotification = (index) => {
        const newNotifications = [...notifications];
        newNotifications.splice(index, 1);
        setNotifications(newNotifications);
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        padding: '20px',
    };

    return (
      <header className="header">
          <div style={{ display: 'flex', alignItems: 'left' }}>
              <button onClick={toggleSideNav} style={buttonStyle}>Menu</button>
          </div>
          <h1 style={{ margin: '0 auto', color: 'white' }}>Serverless Trivia Game</h1>
        <div className="bell-icon" onClick={handleBellClick}>
                <span role="img" aria-label="bell">&#x1F514;</span>
                {display &&
                <div id="notifications" className="notifications">
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <p key={index}>
                                <span className={`notification ${notification.type}`}>
                                    {`${notification.type}, ${notification.message}`}
                                </span>
                                <span className="close" onClick={() => removeNotification(index)}>
                                    X
                                </span>
                            </p>
                        ))
                    ) : (
                        <p>No New Notifications</p>
                    )}
                </div>
            }
            </div>
           
      </header>
    );
}
export default Header;
