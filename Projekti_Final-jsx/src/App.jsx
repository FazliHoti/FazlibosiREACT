import React, { useState } from 'react';

// --- 1. JOKE GENERATOR COMPONENT ---
const JokeGenerator = () => {
  const jokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "Parallel lines have so much in common. It’s a shame they’ll never meet.",
    "I threw a boomerang a few years ago. I now live in constant fear.",
    "Singing in the shower is fun until you get soap in your mouth. Then it's a soap opera."
  ];

  const [joke, setJoke] = useState("");

  const generateJoke = () => {
    const randomIndex = Math.floor(Math.random() * jokes.length);
    setJoke(jokes[randomIndex]);
  };

  return (
    <div className="card joke-card">
      <h2>😂 Joke Generator</h2>
      <div className="joke-display">
        <p className="joke-text">{joke || "Click the button to laugh!"}</p>
      </div>
      <button onClick={generateJoke}>Tell me a joke</button>
    </div>
  );
};

// --- 2. PASSWORD VALIDATOR COMPONENT ---
const PasswordValidator = () => {
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [color, setColor] = useState("#ccc");

  const checkStrength = (pass) => {
    setPassword(pass);
    let score = 0;
    // Logic to check password strength
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++; // Has uppercase
    if (/[0-9]/.test(pass)) score++; // Has number
    if (/[^A-Za-z0-9]/.test(pass)) score++; // Has special char

    if (pass.length === 0) {
      setStrength("");
      setColor("#ccc");
    } else if (score === 0) {
      setStrength("Too Short");
      setColor("#ff4d4d");
    } else if (score < 3) {
      setStrength("Weak 🔴");
      setColor("#ff4d4d");
    } else if (score < 4) {
      setStrength("Medium 🟡");
      setColor("#ffd700");
    } else {
      setStrength("Strong 🟢");
      setColor("#00cc00");
    }
  };

  return (
    <div className="card password-card">
      <h2>🔒 Password Strength</h2>
      <input 
        type="text" 
        placeholder="Type a password..." 
        value={password}
        onChange={(e) => checkStrength(e.target.value)}
        style={{ borderColor: color }}
      />
      <p className="strength-text" style={{ color: color }}>
        Strength: <strong>{strength}</strong>
      </p>
    </div>
  );
};

// --- 3. ROCK PAPER SCISSORS COMPONENT ---
const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [compChoice, setCompChoice] = useState(null);
  const [result, setResult] = useState("Choose your weapon!");
  const [score, setScore] = useState({ user: 0, comp: 0 });

  const choices = ["✊", "✋", "✌️"];

  const playGame = (choice) => {
    const computerParams = Math.floor(Math.random() * 3);
    const computerMove = choices[computerParams];
    
    setPlayerChoice(choice);
    setCompChoice(computerMove);

    let newResult;
    if (choice === computerMove) {
      newResult = "It's a Draw! 🤝";
    } else if (
      (choice === "✊" && computerMove === "✌️") ||
      (choice === "✋" && computerMove === "✊") ||
      (choice === "✌️" && computerMove === "✋")
    ) {
      newResult = "You Win! 🎉";
      setScore(s => ({ ...s, user: s.user + 1 }));
    } else {
      newResult = "You Lose! 🤖";
      setScore(s => ({ ...s, comp: s.comp + 1 }));
    }
    setResult(newResult);
  };

  return (
    <div className="card game-card">
      <h2>🎮 Rock Paper Scissors</h2>
      <div className="score-board">
        <span>You: {score.user}</span>
        <span>CPU: {score.comp}</span>
      </div>
      <div className="choices">
        {choices.map((c) => (
          <button key={c} onClick={() => playGame(c)} className="rps-btn">{c}</button>
        ))}
      </div>
      <div className="results">
        <div className="moves">
          <p>You: <span className="move-icon">{playerChoice || '-'}</span></p>
          <p>Comp: <span className="move-icon">{compChoice || '-'}</span></p>
        </div>
        <h3 className="result-text">{result}</h3>
      </div>
    </div>
  );
};

// --- DICE FACE SVG HELPER COMPONENT ---
const DiceFace = ({ value }) => {
  // Define where the pips (dots) should be placed on a 3x3 grid (0-8)
  const pipPositions = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  const currentPips = pipPositions[value] || [];

  const PIPS_COORDS = [
    { x: '25%', y: '25%' },
    { x: '50%', y: '25%' },
    { x: '75%', y: '25%' },
    { x: '25%', y: '50%' },
    { x: '50%', y: '50%' },
    { x: '75%', y: '50%' },
    { x: '25%', y: '75%' },
    { x: '50%', y: '75%' },
    { x: '75%', y: '75%' },
  ];

  return (
    <svg viewBox="0 0 100 100" className="dice-svg">
      {}
      <rect x="5" y="5" width="90" height="90" rx="15" ry="15" className="dice-body" />
      
      {/* Render pips (dots) */}
      {currentPips.map(pos => (
        <circle 
          key={pos} 
          cx={PIPS_COORDS[pos].x} 
          cy={PIPS_COORDS[pos].y} 
          r="8"
          className="pip" 
        />
      ))}
    </svg>
  );
};



const DiceRoller = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);

    setDiceValue(0); 


    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
    }, 500);
  };

  return (
    <div className="card dice-card">
      <h2>🎲 Dice Roller</h2>
      {}
      <div className={`dice ${isRolling ? 'rolling' : ''}`}>
        <DiceFace value={diceValue} />
      </div>
      <button onClick={rollDice} disabled={isRolling}>
        {isRolling ? 'Rolling...' : 'Roll the Dice'}
      </button>
    </div>
  );
};



function App() {
  const [activeTab, setActiveTab] = useState('jokes');

  return (
    <div className="app-layout">
      <style>{`
        body {
          background-color: #282c34;
          color: white;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          height: 100vh;
          overflow: hidden; /* Prevent body scroll */
        }

        /* --- NEW LAYOUT: SIDEBAR (for desktop) --- */
        .app-layout {
          display: flex;
          height: 100vh;
          width: 100%;
          max-width: 100%;
        }

        .sidebar {
          width: 300px; /* Fixed width for the sidebar */
          background: #1f232a; /* Darker background for distinction */
          padding: 20px 0;
          box-shadow: 2px 0 10px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 50px;
          flex-shrink: 0; /* Prevents sidebar from shrinking */
        }
        
        .sidebar-header {
            color: #61dafb;
            font-size: 30px;
            text-align: center;
            font-weight: bold;
            margin-bottom: 20px;
            padding: 50px 10px 50px 10px;
        }

        nav {
          display: flex;
          flex-direction: column;
          width: 90%;
          padding: 0 10px;
        }

        nav button {
          background: #3a3f4b;
          border: none;
          color: #aaa;
          padding: 15px 20px; 
          border-radius: 8px; 
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
          font-size: 20px;
          text-align: left;
          margin-bottom: 50px;
        }

        nav button:hover {
          background: #4a505e;
          transform: translateX(3px); /* Slide effect on hover */
        }

        nav button.active {
          background: #61dafb;
          color: #282c34;
          box-shadow: 0 0 10px rgba(97, 218, 251, 0.4);
          transform: none;
        }
        
        main {
          flex-grow: 1; /* Takes up the rest of the space */
          padding: 40px;
          overflow-y: auto; /* Allows content area to scroll if needed */
          display: flex;
          justify-content: center;
          align-items: center; /* ALIGNMENT: Vertically centered */
          width: calc(100% - 180px); /* Content area width */
        }
        
        /* --- MOBILE RESPONSIIVNESS (<= 768px) --- */
        @media (max-width: 768px) {
            .app-layout {
                flex-direction: column; /* Stack vertically */
                height: auto; /* Allow height to adjust */
                min-height: 100vh;
            }

            .sidebar {
                width: 100%;
                height: auto;
                padding: 15px 0;
                flex-direction: column;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
            }
            
            .sidebar-header {
                margin-bottom: 15px;
            }

            nav {
                flex-direction: row; /* Horizontal tabs on mobile */
                justify-content: center;
                gap: 8px;
                flex-wrap: wrap;
                justify-content: left;
            }

            nav button {
                margin-bottom: 0;
                width: auto;
                text-align: center;
            }
            
            main {
                width: 100%;
                padding: 20px;
                min-height: 600px;
                align-items: flex-start; /* Reset for mobile stack flow */
            }
            
            .card {
                width: 100%; /* Make card fill mobile screen width */
            }
        }
        
        /* --- GENERAL CARD & BUTTON STYLES (Enlarged) --- */
        
        .card {
          background: #3b404e;
          padding: 50px; /* ENLARGED: Increased padding */
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          animation: fadeIn 0.4s ease-in-out;
          min-height: 570px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 95%; /* Adjusted width */
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* General Button Styles */
        button {
          cursor: pointer;
        }
        
        /* Shared Button Style for the main action buttons */
        .joke-card button, .dice-card button {
          padding: 12px 24px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          background-color: #61dafb;
          color: #282c34;
          font-weight: bold;
          margin-top: 20px;
          transition: background-color 0.2s;
        }
        
        .joke-card button:hover, .dice-card button:hover {
           background-color: #4fa8d1;
        }

        /* Joke Generator Specifics */
        .joke-display {
           min-height: 100px;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .joke-text {
          font-size: 1.3rem;
          font-style: italic;
          line-height: 1.5;
          margin: 0;
        }

        /* Password Validator Specifics */
        input {
          padding: 12px;
          border-radius: 8px;
          border: 2px solid #61dafb;
          background: #282c34;
          color: white;
          width: 100%;
          box-sizing: border-box;
          font-size: 1.1rem;
          outline: none;
          text-align: center;
          transition: border-color 0.3s;
        }

        .strength-text {
          margin-top: 25px;
          font-size: 1.2rem;
          transition: color 0.3s;
        }

        /* Rock Paper Scissors Specifics */
        .score-board {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          font-weight: bold;
          font-size: 1.1rem;
          background: rgba(0,0,0,0.2);
          padding: 8px 16px;
          border-radius: 10px;
        }
        
        .choices {
          display: flex;
          justify-content: center;
        }

        .rps-btn {
          font-size: 2.5rem;
          margin: 0 10px;
          background: #282c34;
          border: 2px solid #61dafb;
          border-radius: 12px;
          width: 70px;
          height: 70px;
          transition: transform 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .rps-btn:hover {
          transform: scale(1.1) rotate(5deg);
          background: #61dafb;
        }

        .results {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #555;
          width: 100%;
        }
        
        .moves {
          display: flex;
          justify-content: space-around;
          margin-bottom: 10px;
        }
        
        .move-icon {
          font-size: 1.5rem;
        }
        
        .result-text {
           font-size: 1.5rem;
           color: #61dafb;
        }
        
        /* Dice Roller Specifics */
        .dice {
          width: 100px; /* Define size for the SVG container */
          height: 100px;
          margin: 30px 0;
          line-height: 1; 
          transition: transform 0.1s;
        }

        .dice-svg {
          width: 100%;
          height: 100%;
        }
        
        .dice-body {
          fill: #f0f0f0; /* Dice face color */
          stroke: #282c34;
          stroke-width: 4;
        }
        
        .pip {
          fill: #ff4d4d; /* Pip color (red) */
        }

        .rolling {
          animation-name: spinRoll;
          animation-duration: 0.5s;
          animation-timing-function: linear;
        }
        
        @keyframes spinRoll {
          0% { transform: rotate(0deg) scale(1); opacity: 1; }
          25% { transform: rotate(90deg) scale(0.9); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(0.8); opacity: 0.5; }
          75% { transform: rotate(270deg) scale(0.9); opacity: 0.7; }
          100% { transform: rotate(360deg) scale(1); opacity: 1; }
        }
      `}</style>

      <div className="sidebar">
        <div className="sidebar-header">
            ✨ React Fun Hub
        </div>
        <nav>
          <button 
            onClick={() => setActiveTab('jokes')} 
            className={activeTab === 'jokes' ? 'active' : ''}
          >
            Jokes
          </button>
          <button 
            onClick={() => setActiveTab('password')} 
            className={activeTab === 'password' ? 'active' : ''}
          >
            Security
          </button>
          <button 
            onClick={() => setActiveTab('game')} 
            className={activeTab === 'game' ? 'active' : ''}
          >
            RPS
          </button>
          <button 
            onClick={() => setActiveTab('dice')} 
            className={activeTab === 'dice' ? 'active' : ''}
          >
            Dice
          </button>
        </nav>
      </div>

      <main>
        {activeTab === 'jokes' && <JokeGenerator />}
        {activeTab === 'password' && <PasswordValidator />}
        {activeTab === 'game' && <RockPaperScissors />}
        {activeTab === 'dice' && <DiceRoller />}
      </main>
    </div>
  );
}

export default App;