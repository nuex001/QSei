import React, { useEffect, useState } from "react";
import "../../assets/css/quizSec.css";
import { IoMdArrowRoundBack, IoMdCheckmarkCircle } from "react-icons/io";
import { FaTimesCircle } from "react-icons/fa";
import { FaLongArrowAltRight, FaRedoAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { FaFire } from "react-icons/fa";
import { FaSadCry } from "react-icons/fa";
import { TiHome } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { clear, fetchQuiz, updateQuiz } from "../../redux/TxCount";

function QuizSec() {
  const dispatch = useDispatch();
  const { user, quiz, error, success } = useSelector((state) => state.TxCount);
  const [ans, setAns] = useState(null);
  const [ansAplha] = useState(["A", "B", "C", "D"]);
  const [stage, setStage] = useState(false);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };
  const onclick = () => {
    navigate(-1);
  };
  const checkAns = (txt) => {
    setAns(txt);
  };
  const submit = (e) => {
    e.preventDefault();
    setStage(true);
    dispatch(
      updateQuiz({
        quizId: quiz._id,
        answer: ans,
      })
    );
  };

  const cancelPopUp = () => {
    setStage(false);
    dispatch(clear());
  };

  useEffect(() => {
    if (!quiz) {
      dispatch(fetchQuiz());
    }
  }, [quiz]);
  useEffect(() => {
    console.log(error, success);
  }, [error, success]);
  return (
    <div className="quizSec">
      <div className="backbtn" onClick={goBack}>
        <IoMdArrowRoundBack className="back" />
      </div>
      <h1>{quiz && quiz.question}</h1>
      <ul>
        <li
          className={"A" === ans ? "checked" : ""}
          onClick={() => checkAns("A")}
        >
          <span>{ansAplha[0]}</span>
          {quiz && quiz.A}
          <IoMdCheckmarkCircle className="check" />
        </li>
        <li
          className={"B" === ans ? "checked" : ""}
          onClick={() => checkAns("B")}
        >
          <span>{ansAplha[1]}</span>
          {quiz && quiz.B}
          <IoMdCheckmarkCircle className="check" />
        </li>
        <li
          className={"C" === ans ? "checked" : ""}
          onClick={() => checkAns("C")}
        >
          <span>{ansAplha[2]}</span>
          {quiz && quiz.C}
          <IoMdCheckmarkCircle className="check" />
        </li>
        <li
          className={"D" === ans ? "checked" : ""}
          onClick={() => checkAns("D")}
        >
          <span>{ansAplha[3]}</span>
          {quiz && quiz.D}
          <IoMdCheckmarkCircle className="check" />
        </li>
      </ul>
      <div className="btnCont">
        <Link to={"#"} className="btn" onClick={submit}>
          Submit
        </Link>
      </div>

      {stage && (
        <div className="alertPopup">
          {error || success ? (
            <div className="msgalert">
              {error ? (
                <>
                  <FaTimesCircle className="cancelBtn" onClick={cancelPopUp} />
                  <FaSadCry className="iconstat" />
                  <h2>{error}</h2>
                  <p>You can try again or go back to home</p>
                  <div className="btns">
                    <Link to={"/"} className="btn">
                      <TiHome className="icon" />
                      Home
                    </Link>
                    <div className="btn fail" onClick={cancelPopUp}>
                      <FaRedoAlt className="icon" />
                      Try Agian
                    </div>
                  </div>
                </>
              ) : (
                success && (
                  <>
                    <FaFire className="icongood" />
                    <h2>{success}</h2>
                    <p> Want to try a new quiz or head back home?</p>
                    <div className="btns">
                      <Link to={"/"} className="btn">
                        <TiHome className="icon" />
                        Home
                      </Link>
                      <Link to={"/class"} className="btn fail">
                        <FaRedoAlt className="icon" />
                        Try A new Quiz
                      </Link>
                    </div>
                  </>
                )
              )}
            </div>
          ) : (
            <span class="loader"></span>
          )}
        </div>
      )}
    </div>
  );
}

export default QuizSec;
