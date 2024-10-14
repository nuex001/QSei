import React, { useEffect, useRef } from "react";
import "../../assets/css/refs.css";
import { fetchRefs } from "../../redux/TxCount";
import { useDispatch, useSelector } from "react-redux";
import { formatPoints, setUsernameDp } from "../../utils/utils";

function Refs() {
  const dispatch = useDispatch();
  const { refs, user } = useSelector((state) => state.TxCount);
  const timer = useRef(null);
  const copyBtnRef = useRef(null);
  const copyLink = (e) => {
    navigator.clipboard.writeText(
      `https://t.me/Aptos_AcademyBot?start=${sessionStorage.getItem("myId")}`
    );
    e.target.innerHTML = "Copied";
    timer.current = setTimeout(() => {
      if (copyBtnRef.current) {
        copyBtnRef.current.innerHTML = "Invite frens";
      }
    }, 700);
  };

  useEffect(() => {
    if (!refs) {
      dispatch(fetchRefs());
    }
    return () => clearTimeout(timer.current);
  }, [user, refs]);

  return (
    <section className="refs">
      <header>
        <h1>Invite frens</h1>
        <h2>Tap on the button to invite your friends</h2>
        <button ref={copyBtnRef} onClick={copyLink}>
          Invite frens
        </button>
      </header>
      <h3>
      {refs?.length} {refs?.length <= 1? "Friend" : "Friends"}
      </h3>
      <ul>
        {refs &&
          refs.map((ref) => (
            <li>
              <div className="dp">{setUsernameDp(ref.username)}</div>
              <h2>
                {ref.username}
                <span>+{formatPoints(ref.point)} SS</span>
              </h2>
            </li>
          ))}
      </ul>
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

export default Refs;
