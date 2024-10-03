import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Nav from './components/layouts/Nav'
import Home from "./components/pages/Home";
import QuizSec from "./components/pages/QuizSec";
import Class from "./components/pages/Class";
import Tasks from "./components/pages/Tasks";
import Refs from "./components/pages/Refs";
import Streak from "./components/pages/Streak";
import PrivateRouter from "./components/pages/PrivateRouter";
import ScrollToTop from "./components/pages/ScrollToTop";
import CreateQuiz from "./components/pages/CreateQuiz";
import WebApp from "@twa-dev/sdk";

function App() {
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      // Expand the Web App to full screen
      WebApp.expand();
    }
  }, []);

  return (
    <BrowserRouter>
   <div className="container">
   <Nav />
      <ScrollToTop />
      <Routes>
          <Route element={<PrivateRouter />}>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/class" element={<Class />} />
          <Route exact path="/quiz/:id" element={<QuizSec />} />
          <Route exact path="/tasks" element={<Tasks />} />
          <Route exact path="/refs" element={<Refs />} />
          <Route exact path="/createQuiz" element={<CreateQuiz />} />
        </Route> 
      </Routes>
      </div>
  </BrowserRouter>
)
}

export default App
