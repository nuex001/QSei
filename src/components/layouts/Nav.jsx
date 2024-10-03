import React, { useEffect, useState } from "react";
import { TiHome } from "react-icons/ti";
import { FiGift } from "react-icons/fi";
import { FaSackDollar } from "react-icons/fa6";
import { FaGamepad } from "react-icons/fa6";
import { HiOutlineUsers } from "react-icons/hi";
import { MdQuiz } from "react-icons/md";

import { NavLink, useLocation } from "react-router-dom";
function Nav() {
  const { pathname } = useLocation();
  const [showNav, setShowNav] = useState(true);
  const [ifAdmin, setIfAdmin] = useState(false);
  useEffect(() => {
 const userRole =  sessionStorage.getItem("role");
 setIfAdmin(userRole === "admin");
    if (pathname.includes("quiz") || pathname.includes("class")) {
      setShowNav(false);
    } else {
      setShowNav(true);
    }
  }, [pathname]);
  useEffect(() => {
 const userRole =  sessionStorage.getItem("role");
 setIfAdmin(userRole === "admin");
  }, []);
  return showNav ? (
    <nav>
      <ul>
        <li>
          <NavLink to="/" end>
            <TiHome className="icon" />
            <span>.</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks">
            <FiGift className="icon" />
            <span>.</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/refs">
            <HiOutlineUsers className="icon" />
            <span>.</span>
          </NavLink>
        </li>
        {
          ifAdmin &&
          <li>
          <NavLink to="/createQuiz">
            <MdQuiz className="icon" />
            <span>.</span>
          </NavLink>
        </li>
        }
      </ul>
    </nav>
  ) : (
    <></>
  );
}

export default Nav;
