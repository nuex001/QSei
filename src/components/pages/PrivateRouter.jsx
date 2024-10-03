import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import WebApp from "@twa-dev/sdk";
import { useDispatch } from "react-redux";
import { addReferer, logorsign } from "../../redux/TxCount";
import Streak from "./Streak";
import setAuthToken from "../../utils/setAuthToken";

const PrivateRoute = () => {
  const [isRegistered, setIsRegistered] = useState(null);
  const [streak, setstreak] = useState(null);
  const [sameDay, setSameDay] = useState(null);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = (key) => {
    return sessionStorage.getItem(key);
  };

  useEffect(() => {
    const referId = new URLSearchParams(window.location.search).get(
      "referrerId"
    );
    if (referId) {
      dispatch(addReferer(referId));
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const tg = WebApp;
      const initDataUnsafe = tg.initDataUnsafe;
      const user = initDataUnsafe?.user;
      if (user) {
        const formdata = {
          username: user.username ? user.username : user.first_name,
          id: user.id,
        };
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${formdata.username}`
        );
        dispatch(logorsign(formdata));
        setIsRegistered(res.data.userExists);
        if (res.data.userExists) {
          setstreak(res.data.streak);
          setSameDay(res.data.isSameDay);
          setUsername(formdata.username);
          setIsLoading(false);
        }
      } else {
        // console.error("Us er data is not available");
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedToken = getData("token");
    setToken(storedToken);

    if (!storedToken) {
      fetchUserData();
    } else {
     setAuthToken(storedToken);
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="loaderCont ">
        <span class="loader"></span>
      </div>
    ); // Show loading state
  }
  return sameDay === false ? (
    <Streak streak={streak} username={username} />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
