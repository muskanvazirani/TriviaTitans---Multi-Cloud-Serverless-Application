import React from 'react';
import '../../style/button.css';
const ButtonComponent = () => {
  const handleButtonClick = (btnType) => {
    alert(`You clicked the ${btnType} button!`);
  };

  return (
    <div className="button-container">
      <a href="/createTeam" className="button">
        Create Team
      </a>
        <br/>
      <a href="/teamAction" className="button">
        Team Action Form
      </a>
      <br/>

      <a href="/teamStats" className="button">
        Team Stats
      </a>
      <br/>

      <a href="/inviteUser" className="button">
        Invite User
      </a>
    </div>

  );
};

export default ButtonComponent;