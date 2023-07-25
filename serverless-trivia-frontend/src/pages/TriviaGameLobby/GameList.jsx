import React, { useState, useEffect } from 'react';

import { useNavigate, Link, useLocation } from 'react-router-dom';

import axios from "axios";




function GameList() {

  const navigate = useNavigate();
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [searchVal, setSearchVal] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState([]);


  useEffect(() => {

    axios.get('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories')
      .then(response => {
        console.log("-----------------------------------");

        console.log(response.data);
        setCategories(response.data);
        console.log(categories);
      })
      .catch(error => console.log(error));
    
    axios.get('https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/games')
      .then(response => {
        console.log("-----------------------------------");

        console.log(response.data);
        setAllGames(response.data);
        console.log(allGames);
        setFilteredGames(response.data);
      })
      .catch(error => console.log(error));
   }, []);

  useEffect(() => {
    const categoryFilter = filterCategory
      ? allGames.filter(game => game.category === filterCategory)
      : allGames;

    const difficultyFilter = filterDifficulty
      ? categoryFilter.filter(game => game.difficulty_level === filterDifficulty)
      : categoryFilter;

    const searchFilter = difficultyFilter.filter(game =>
      game.game_name.toLowerCase().includes(searchVal.toLowerCase())
    );

    setFilteredGames(searchFilter);
  }, [filterDifficulty, filterCategory, searchVal, allGames]);

  const handleSearch = event => {
    setSearchVal(event.target.value);
  };

  const handleFilterDifficulty = event => {
    setFilterDifficulty(event.target.value);
  };

  const handleFilterCategory = event => {
    setFilterCategory(event.target.value);
  };

  const handleJoin = (game) => {
    console.log('User joined the game:', game);
    navigate('/gameDetails' , {state: {game}});

    // Add your logic to handle the user joining the game
    // Redirect the user to the game page or display a confirmation message
  };

   

      return (

        <>  

        {allGames?.length === 0 || categories?.length === 0 ? (

        <p>Loading...</p>

      ) : (

        <> 

<div>
      <h1 style={{ color: "rgb(4, 59, 114) " }}>Available Games</h1>
      <div className="filters">
        <div className="filter-item">
          <label>
            Difficulty:
            <select
              value={filterDifficulty}
              onChange={handleFilterDifficulty}
            >
             <option value="">All</option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </label>
        </div>
        <div className="filter-item">
          <label>
            Category:
            <select
              value={filterCategory}
              onChange={handleFilterCategory}
            >
             <option value="">All</option>
             {categories.map((option, index) => (
                <option key={index} value={option.category}>
                {option.category}
                </option>
                ))}
            </select>
          </label>
        </div>
        <div className="filter-item search-item">
          <label>
            Search:

            <input

              type="text"

              value={searchVal}

              onChange={handleSearch}

            />

          </label>

        </div>

      </div>
</div>

        {/* <div className="font-bold text-3xl mb-4  mx-auto text-center" >Create <Link to={{ pathname : "/createquestion", state: { gameID } }} className="text-blue-800 underline">Question</Link></div> */}

        <div className="flex items-center justify-center ">

        <div className="bg-white w-full sm:w-[100%] margin top mt-6 p-8 rounded-md shadow-sm border-[1px]">

        <table style={{width: '61%',
    border: '1px solid black',
    padding: '10px',
    position: 'absolute',
    left: '19rem',
    top: '17rem',
    }}>

          <thead>

            <tr>

              {/* <th style={{ width: '30%', color: 'black' }}></th> */}

              <th style={{ width: '20%', color: 'black' }}>Game</th>

              <th style={{ width: '20%', color: 'black' }}>Category</th>

              <th style={{ width: '20%', color: 'black' }}>Difficulty</th>

              <th style={{ width: '10%', color: 'black' }}>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredGames.map((item) => (

              <tr key={item.Id}>

                {/* <td style={{ textAlign: 'center', width: '30%', color: "blue" }}></td> */}

                <td style={{ textAlign: 'center', width: '20%', color: "rgb(4, 59, 114)" }}>{item.game_name}</td>

                <td style={{ textAlign: 'center', width: '20%', color: "rgb(4, 59, 114)" }}>{item.category}</td>

                <td style={{ textAlign: 'center', width: '20%', color: "rgb(4, 59, 114)" }}>{item.difficulty_level}</td>

                <td style={{ textAlign: 'center', width: '10%'}}>

                <button style={{ color: "green" }} onClick={() => handleJoin(item)}>View</button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

        </div>

        </div>

        </>

        )}

        </>

      );

};


export default GameList;