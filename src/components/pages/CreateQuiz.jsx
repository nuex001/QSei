import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/CreateQuiz.css";
import { useDispatch, useSelector } from "react-redux";
import { clear, createQuiz } from "../../redux/TxCount";
function CreateQuiz() {
  const dispatch = useDispatch();
  const formRef = useRef();
  const { error, success } = useSelector((state) => state.TxCount);
  const [formdata, setformdata] = useState({
    topic: "",
    description: "",
    question: "",
    A: "",
    B: "",
    C: "",
    D: "",
    answer: "",
  });
  const { topic, description, question, A, B, C, D, answer } = formdata;
  const onChange = (e) =>
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  const createQuizFunc = (e) => {
    e.preventDefault();
    dispatch(createQuiz(formdata));
  };

  useEffect(() => {
    if (error) {
      alert(error);
    }
    if (success) {
        alert(success);
    }
    formRef.current.reset();
    dispatch(clear());
  }, [success, error]);

  return (
    <div className="createQuiz">
      <h1>Create Quiz</h1>
      <form action="" ref={formRef} onSubmit={createQuizFunc}>
        <input
          type="text"
          name="topic"
          id=""
          placeholder="topic"
          value={topic}
          onChange={onChange}
        />
        <textarea
          name="description"
          id="description"
          placeholder="description"
          value={description}
          onChange={onChange}
        ></textarea>
        <input
          type="text"
          name="question"
          id=""
          placeholder="question"
          value={question}
          onChange={onChange}
        />
        <input
          type="text"
          name="A"
          id=""
          placeholder="A"
          value={A}
          onChange={onChange}
        />
        <input
          type="text"
          name="B"
          id=""
          placeholder="B"
          value={B}
          onChange={onChange}
        />
        <input
          type="text"
          name="C"
          id=""
          placeholder="C"
          value={C}
          onChange={onChange}
        />
        <input
          type="text"
          name="D"
          id=""
          placeholder="D"
          value={D}
          onChange={onChange}
        />
        <input
          type="text"
          name="answer"
          id=""
          placeholder="A/B/C/D"
          value={answer}
          onChange={onChange}
        />
        <button>Create Quiz</button>
      </form>
    </div>
  );
}

export default CreateQuiz;
