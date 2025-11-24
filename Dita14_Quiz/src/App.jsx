import React, { useState } from "react"; 
import "./App.css"; 

const questions = [
  {
    question: "Cfare Eshte React Js?",
    options: ["shkrim i lashte ne Argjil", "Sikur Powerpointi", "Gjuhe Programimi", "Sistem operativ"],
    answer: "Gjuhe Programimi",
  },
  {
    question: "Për çfarë përdoret useState?",
    options: ["Për stilizim CSS", "Për menaxhimin e state", "Për të krijuar databaza", "Për të ndryshuar URL"],
    answer: "Për menaxhimin e state",
  },
  {
    question: "Çfarë është Virtual DOM?",
    options: [
      "Kopje virtuale",
      "Browser i ri",
      "Framework tjetër",
      "Server cloud"
    ],
    answer: "Kopje virtuale",
  },
  {
    question: "Kur ekzekutohet useEffect vetëm një herë?",
    options: [
      "Dependency bosh",
      "Kur ka error",
      "Kur thërritet dy herë",
      "Kur përdorim vargje"
    ],
    answer: "Dependency bosh",
  },-
  {
    question: "Çfarë bën memoization në React?",
    options: [
      "Shmang ripërllogaritje",
      "Fshin state",
      "Rrit RAM-in",
      "Instalon paketa"
    ],
    answer: "Shmang ripërllogaritje",
  },

  {
    question: "Çfarë bën useCallback?",
    options: [
      "Memoizon funksionin",
      "Krijon componente",
      "Ruajt databaza",
      "Modifikon CSS"
    ],
    answer: "Memoizon funksionin",
  },

];

const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [score, setScore] = useState(0); 

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1); 
    }
    setCurrentQuestion(currentQuestion + 1);
  };

  if (currentQuestion >= questions.length) {
    return (
      <div className="quiz-container">
        <h1>React Quiz</h1>
        <h3>Quiz-i ka përfunduar!</h3>
        <p>Shkalla e saktësisë: {score} nga {questions.length}</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>React Quiz</h1>
      <div>
        <h2>{questions[currentQuestion].question}</h2>
        {questions[currentQuestion].options.map((option, index) => (
          <button key={index} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
      </div>
  );
};

export default App;
