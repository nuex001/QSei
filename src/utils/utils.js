import { toast } from "react-toastify";

export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const errorMsgs = (e) =>
  toast(e, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    type: "error",
    theme: "dark",
  });
export const successMsg = (e) =>
  toast(e, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    type: "success",
    theme: "dark",
  });

export const formatPoints = (points) => {
  if (points >= 1_000_000_000) {
    return (points / 1_000_000_000).toFixed(1) + "B";
  }
  if (points >= 1_000_000) {
    return (points / 1_000_000).toFixed(1) + "M";
  }
  if (points >= 1_000) {
    return (points / 1_000).toFixed(1) + "K";
  }
  return parseFloat(points).toFixed(2);
};

export const setUsernameDp = (text) => {
  return text.charAt(0).toUpperCase();
};

