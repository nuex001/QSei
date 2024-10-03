import React, { useEffect } from "react";
import "../../assets/css/class.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLongArrowAltRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz } from "../../redux/TxCount";

function Class() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user , quiz} = useSelector((state) => state.TxCount);

  const goBack = () => {
    navigate(-1);
  };

  const fetchQuizFunc = () => {
    dispatch(fetchQuiz());
  };

  useEffect(() => {
    fetchQuizFunc();
  }, []);

  return (
    <div className="class">
      <div className="backbtn" onClick={goBack}>
        <IoMdArrowRoundBack className="back" />
      </div>
      <h1>{
        quiz && quiz.topic
        }</h1>
      <p>
      {
        quiz && quiz.description
        }
      </p>
      <div className="btnCont">
        <Link to={`/quiz/${quiz && quiz._id}`} className="btn">
          Check out Quiz
          <FaLongArrowAltRight className="icon" />
        </Link>
      </div>
    </div>
  );
}

export default Class;
