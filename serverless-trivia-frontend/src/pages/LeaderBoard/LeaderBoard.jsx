import React, { useState, useEffect } from "react";

import { useNavigate , Link} from "react-router-dom";

import axios from "axios";

function LeaderBoard() {
  const navigate = useNavigate();

  const [gameData, setGameData] = useState([]);

  const [filteredGames, setFilteredGames] = useState([]);

  const [filterTime, setFilterTime] = useState("");

  const [filterCategory, setFilterCategory] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(
        "https://d6tqiw98kb.execute-api.us-east-1.amazonaws.com/dev/categories"
      )

      .then((response) => {
        console.log("-----------------------------------");

        setCategories(() => {
          console.log("Logging before setting the category:: ");
          console.log(response.data);
          return response.data;
        });
      })

      .catch((error) => console.log(error));

    axios
      .get(
        "https://u0ubbqcm00.execute-api.us-east-1.amazonaws.com/Dev/triviagamedata"
      )

      .then((response) => {
        console.log("Original Game Data : --------------------------");

        console.log(response.data.value);

        const sortedData = response.data.value.sort((a, b) => {
          // First, sort by "Game_Name" in ascending order

          const gameNameComparison = a.Game_Name.localeCompare(b.Game_Name);

          if (gameNameComparison !== 0) {
            return gameNameComparison;
          }

          // If "Game_Name" is the same, then sort by "Score" in descending order

          return parseInt(b.Score) - parseInt(a.Score);
        });

        setGameData(sortedData);

        setFilteredGames(sortedData);
      })

      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const filteredGamesFromCategory = filterCategory
      ? gameData.filter((game) => game.Category === filterCategory)
      : gameData;

    let filteredGames = filteredGamesFromCategory;
    if (filterTime === "Daily") {
      const currentDate = new Date();
      filteredGames = filteredGamesFromCategory.filter(
        (game) =>
          new Date(game.Start_Time).toDateString() ===
          currentDate.toDateString()
      );
    } else if (filterTime === "Weekly") {
      const currentDate = new Date();
      const lastWeekDate = new Date(currentDate);
      lastWeekDate.setDate(currentDate.getDate() - 7);
      filteredGames = filteredGamesFromCategory.filter(
        (game) =>
          new Date(game.Start_Time) >= lastWeekDate &&
          new Date(game.Start_Time) <= currentDate
      );
    } else if (filterTime === "Monthly") {
      const currentDate = new Date();
      const lastMonthDate = new Date(currentDate);
      lastMonthDate.setMonth(currentDate.getMonth() - 1);
      filteredGames = filteredGamesFromCategory.filter(
        (game) =>
          new Date(game.Start_Time) >= lastMonthDate &&
          new Date(game.Start_Time) <= currentDate
      );
    }

    setFilteredGames(() => {
      console.log(
        "------------ Filtered game data ---------------------------"
      );
      console.log(filteredGames);
      return filteredGames;
    });
  }, [filterCategory, filterTime]);

  const handleFilterTime = (event) => {
    setFilterTime(event.target.value);
  };

  const handleFilterCategory = (event) => {
    setFilterCategory(event.target.value);
  };

  return (
    <>
      {gameData?.length === 0 || categories?.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
        <div className="flex items-center justify-center ">
            <div className="bg-white w-full sm:w-[640px] margin top mt-6 p-8 rounded-md shadow-sm border-[1px]">
            <div className="font-bold text-3xl mb-4  mx-auto text-center">
            <Link to="/lookerdata" className="text-blue-800 underline">
                  Analysis
            </Link>
            </div>
        </div>
        </div>
          <div>
            <h1 style={{ color: "rgb(4, 59, 114) " }}>LeaderBoard</h1>

            <div className="filters">
              <div className="filter-item search-item">
                <div className="filter-item">
                  <label>
                    Time Frame:
                    <select value={filterTime} onChange={handleFilterTime}>
                      <option value="">All</option>

                      <option value="Daily">Daily</option>

                      <option value="Weekly">Weekly</option>

                      <option value="Monthly">Monthly</option>
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
              </div>
            </div>
          </div>

          {/* <div className="font-bold text-3xl mb-4  mx-auto text-center" >Create <Link to={{ pathname : "/createquestion", state: { gameID } }} className="text-blue-800 underline">Question</Link></div> */}

          <div className="flex items-center justify-center ">
            <div className="bg-white w-full sm:w-[100%] margin top mt-6 p-8 rounded-md shadow-sm border-[1px]">
              <table
                style={{
                  width: "61%",

                  border: "1px solid black",

                  padding: "10px",

                  position: "absolute",

                  left: "19rem",

                  top: "17rem",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: "10%", color: "black" }}>GameName</th>

                    <th style={{ width: "20%", color: "black" }}>TeamName</th>

                    <th style={{ width: "10%", color: "black" }}>Score</th>

                    <th style={{ width: "10%", color: "black" }}>Category</th>

                    <th style={{ width: "50%", color: "black" }}>Start Time</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredGames.map((item, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          textAlign: "center",
                          width: "10%",
                          color: "rgb(4, 59, 114)",
                        }}
                      >
                        {item.Game_Name}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          width: "20%",
                          color: "rgb(4, 59, 114)",
                        }}
                      >
                        {item.Team_Name}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          width: "10%",
                          color: "rgb(4, 59, 114)",
                        }}
                      >
                        {item.Score}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          width: "10%",
                          color: "rgb(4, 59, 114)",
                        }}
                      >
                        {item.Category}
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          width: "50%",
                          color: "rgb(4, 59, 114)",
                        }}
                      >
                        {item.Start_Time}
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
}

export default LeaderBoard;
