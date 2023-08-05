import React, { useEffect } from 'react';
import { getQuestions } from '../../services/in-game-experience/get-questions-service';
import InGameQuestions from './components/InGameQuestions';

const InGameExperience = () => {
  sessionStorage.setItem('game_played_id', Date.now());
  useEffect(() => {
    // Function to fetch questions from the API and store in session storage
    const fetchAndStoreQuestions = async () => {
      try {
        const gameId = sessionStorage.getItem("game_id");
        const questions = await getQuestions(gameId);

        if (questions) {
          // Store questions in session storage
          sessionStorage.setItem('questions-data', JSON.stringify(questions));
         
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchAndStoreQuestions();
  }, []);

  return (
    <div>
       <InGameQuestions></InGameQuestions>
    </div>
   
  );
}

export default InGameExperience;
