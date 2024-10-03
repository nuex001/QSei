import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import WebApp from "@twa-dev/sdk";
import store from "./redux/store";
import { Provider } from "react-redux";
WebApp.ready();

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
