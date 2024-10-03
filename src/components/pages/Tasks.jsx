import React, { useEffect, useState } from "react";
import "../../assets/css/tasks.css";
import { GiCheckMark } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import WebApp from "@twa-dev/sdk";
import { claimTask, fetchTasks, getUser } from "../../redux/TxCount";

function Tasks() {
  const dispatch = useDispatch();
  const { tasks, user } = useSelector((state) => state.TxCount);
  const [checkingTaskId, setCheckingTaskId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [savedTasks, setSavedTasks] = useState({});

  // FECTH Tasks
  const fetchuserId = async () => {
    try {
      const tg = WebApp;

      // Access initDataUnsafe
      const initDataUnsafe = tg.initDataUnsafe;
      const user = initDataUnsafe?.user;
      const referrerIdParam = new URLSearchParams(window.location.search).get(
        "referrerId"
      );

      if (user) {
        // console.log(user)
        const { id } = user;
        setUserId(id);
      }
    } catch (error) {
      console.log(error);
      // errorMsgs("Server Error");
    }
  };

  useEffect(() => {
    // console.log(user);
    if (!user || !tasks) {
      fetchuserId();
      dispatch(fetchTasks());
    }
    // Retrieve username from sessionStorage
    const sessionId = sessionStorage.getItem("myId");
    if (sessionId) {
      const savedTaskState =
        JSON.parse(localStorage.getItem(`${sessionId}-taskState`)) || {};
      setSavedTasks(savedTaskState);
    }
    // console.log(tasks);
  }, [tasks, user]);

  const showTask = (taskId, taskLink) => {
    setCheckingTaskId(taskId);
    const newTaskState = { ...savedTasks, [taskId]: true };
    setSavedTasks(newTaskState);
    const sessionId = sessionStorage.getItem("myId");
    localStorage.setItem(
      `${sessionId}-taskState`,
      JSON.stringify(newTaskState)
    );
    // console.log(newTaskState);
    window.open(taskLink, "_blank");
  };
  const closeTask = (idx) => {
    setCheckingTaskId(null);
  };

  // Claim Task
  const claimtask = async (e) => {
    e.preventDefault();
    const taskId = e.target.getAttribute("data-id");
    dispatch(claimTask({ taskId, userId }));
    // setCheckingTaskId(null);
    dispatch(fetchTasks());
    dispatch(getUser());
  };

  return (
    <section className="tasks">
      <header>
        <h1>Earn</h1>
        <p>
          Complete time-limited tasks from carefully selected list of projects
          to earn extra Points.
        </p>
        {/* <h1>{user && user.stage}</h1>
        <ul>
          <li>
            Rewards
            <span>
              +{user && formatPoints(user.rewardPoints)}{" "}
              <img src="./logo.png" alt="" />
            </span>
          </li>
          <li>
            Tasks
            <span>
              +{user && formatPoints(user.taskPoints)}{" "}
              <img src="./logo.png" alt="" />
            </span>
          </li>
          <li>
            Invites
            <span>
              +{user && formatPoints(user.invitesPoints)}{" "}
              <img src="./logo.png" alt="" />
            </span>
          </li>
        </ul> */}
      </header>
      <main>
        <ul>
          {tasks &&
            tasks.map((task, idx) => (
              <li key={idx}>
                <div className="txtcount">
                  <h4>{task.description}</h4>
                  <h5>+{task.points} QSei</h5>
                </div>
                {task.claimed ? (
                  <a className="btn check">
                    <GiCheckMark className="icon" />
                  </a>
                ) : !savedTasks[task._id] ? (
                  <a
                    href={task.link}
                    target="_blank"
                    onClick={() => showTask(task._id, task.link)}
                    className="btn"
                  >
                    Open
                  </a>
                ) : (
                  <a
                    href="#"
                    className="btn check"
                    data-id={task._id}
                    onClick={claimtask}
                  >
                    Check
                  </a>
                )}
              </li>
              // <li>
              //   <div className="txtcount">
              //     <h4>Follow our X account</h4>
              //     <h5>+20 QSei</h5>
              //   </div>
              //   <a href={"#"} target="_blank" className="btn">
              //     Open
              //   </a>
              // </li>
            ))}
        </ul>
        {/* <HomeSkeleton /> */}
      </main>
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
    </section>
  );
}

export default Tasks;
