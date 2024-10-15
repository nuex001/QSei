import React, { useEffect, useState } from "react";
import "../../assets/css/home.css";
import { TbCardsFilled } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatPoints, setUsernameDp } from "../../utils/utils";
import { getUser } from "../../redux/TxCount";
function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.TxCount);
  const [checkingTaskId, setCheckingTaskId] = useState(null);

  useEffect(() => {
    dispatch(getUser());
  }, []);
  return (
    <div className="home">
      <header>
        <div className="dp">{user && setUsernameDp(user?.username)}</div>
        <h1>{user && user?.username}</h1>
        <h2>
          <span>♛</span> {user && formatPoints(user?.point)}
        </h2>
      </header>
      <main>
        <div className="child">
          <div className="cardCont">
            <h3> Quiz Game</h3>
            <div className="cardsBtn">
              <TbCardsFilled className="icon" />
              <p>{user && formatPoints(user?.playPoints)}</p>
            </div>
          </div>
          <Link to="/class" className="playBtn">
            Play
          </Link>
        </div>
        <div class="arrow-container">
          <svg
            viewBox="0 0 200 200"
            class="arrow"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              class="arrow-line"
              d="M10,10 Q50,50 10,90 T13,164"
              stroke="var(--primary)"
              stroke-width="4"
              fill="none"
            />
            <path
              class="arrow-head"
              d="M10,170 L20,160 L0,160 Z"
              fill="var(--primary)"
            />
          </svg>
        </div>
      </main>
    </div>
  );
}

export default Home;
