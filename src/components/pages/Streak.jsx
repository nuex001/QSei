import React from "react";
import "../../assets/css/streak.css";
import bgStreak from "../../assets/images/streak.gif";
import axios from "axios";
import { TbCardsFilled } from "react-icons/tb";

function Streak({ streak, username }) {
  const checkOutStreak = async (e) => {
    e.preventDefault();

    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/user/${username}`
    );
    window.location.reload();
  };
  return (
    <div className="streak">
      <div
        className="streakCont"
        style={{ backgroundImage: `url(${bgStreak})` }}
      >
        <h1>{streak}</h1>
        <h2>day check-in</h2>
        <div className="passCont">
          <div className="box">
            <TbCardsFilled className="icon" />
            <h4>2</h4>
            <h5>Play pass</h5>
          </div>
          <div className="box">
            <span className="icon">♛</span>
            <h4>10</h4>
            <h5>Points</h5>
          </div>
        </div>
        <p>check-ins are your bestfriend here.</p>
        <a href="/" onClick={checkOutStreak}>
          Claim Streak
        </a>
      </div>
    </div>
  );
}

export default Streak;
