import "./Body.css";
import { useState, useEffect, useRef } from "react";
import { FaRedoAlt, FaTrophy } from "react-icons/fa";
import typingSound from "../assets/typing.mp3";
import { paragraphs } from "../data/paragraphs";


function Body({ darkMode, bestWpm, setBestWpm, soundOn }) {
  const [difficulty, setDifficulty] = useState("easy");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completed, setCompleted] = useState(false);
  const startTime = useRef(null);
  const [displayWpm, setDisplayWpm] = useState(0);
  const [displayAccuracy, setDisplayAccuracy] = useState(100);
  const [displayBest, setDisplayBest] = useState(bestWpm);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(typingSound);
    audioRef.current.preload = "auto";
  }, []);

  useEffect(() => {
    generateParagraph("easy");
  }, []);

  useEffect(() => {
      animateValue(displayWpm, wpm, setDisplayWpm);
  }, [wpm]);

  useEffect(() => {
      animateValue(displayAccuracy, accuracy, setDisplayAccuracy);
  }, [accuracy]);

  useEffect(() => {
      animateValue(displayBest, bestWpm, setDisplayBest);
  }, [bestWpm]);

  function generateParagraph(level) {

    // Stop any currently playing typing sound
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    const list = paragraphs[level];
    const random = list[Math.floor(Math.random() * list.length)];
    setDifficulty(level);
    setQuestion(random);
    setAnswer("");
    setWpm(0);
    setAccuracy(100);
    setCompleted(false);
    startTime.current = null;
  }

  function calculateResults(input) {
    if (!startTime.current) return;
    const elapsed = (Date.now() - startTime.current) / 60000;
    const chars = input.replace(/\s/g, "").length;
    const currentWpm = elapsed > 0 ? Math.round((chars / 5) / elapsed) : 0;
    setWpm(currentWpm);

    const correct = input.split("").filter((c, i) => c === question[i]).length;
    setAccuracy(input.length ? Math.round((correct / input.length) * 100) : 100);

    if (input === question) {
      setCompleted(true);
      if (currentWpm > bestWpm){
              localStorage.setItem("bestWpm", currentWpm);
              setBestWpm(currentWpm);
          }
    }
  }

  function handleChange(e) {
    if (!startTime.current) startTime.current = Date.now();
    if (soundOn) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.15;
      audioRef.current.play().catch(() => {});
    }
    setAnswer(e.target.value);
    calculateResults(e.target.value);
  }

  function animateValue(start, end, setter) {
      const duration = 350;
      const startTime = performance.now();

      function update(currentTime) {
          const progress = Math.min(
              (currentTime - startTime) / duration,
              1
          );

          setter(Math.round(start + (end - start) * progress));

          if (progress < 1) {
              requestAnimationFrame(update);
          }
      }

      requestAnimationFrame(update);
  }

  return (
    <div className={darkMode ? "typing-container dark" : "typing-container"}>
      <div className="difficulty-selector">
        <button className={difficulty==="easy"?"active":""} onClick={()=>generateParagraph("easy")}>Easy</button>
        <button className={difficulty==="medium"?"active":""} onClick={()=>generateParagraph("medium")}>Medium</button>
        <button className={difficulty==="hard"?"active":""} onClick={()=>generateParagraph("hard")}>Hard</button>
      </div>

      <div className="progress-bar">
        <span><strong>{difficulty.toUpperCase()}</strong></span>
        <span>{answer.length} / {question.length}</span>
      </div>

      <div className="question">
        {[...question].map((char, i) => {
          let className = "pending";

          if (i < answer.length) {
            className = char === answer[i] ? "correct" : "wrong";
          } else if (i === answer.length) {
            className = "current";
          }

          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </div>

      <textarea
        className="answer"
        value={answer}
        onChange={handleChange}
        placeholder="Start typing here..."
        disabled={completed}
      />

      <div className="stats">
        <div className="stat-card">
          <h3>⚡ WPM</h3>
          <p>{displayWpm}</p>
        </div>
        <div className="stat-card">
          <h3>🎯 Accuracy</h3>
          <p>{displayAccuracy}%</p>
        </div>
        <div className="stat-card">
          <h3><FaTrophy /> Best</h3>
          <p>{displayBest}</p>
        </div>
      </div>

      {completed && (
        <div className="completion-card">
          <h2>🎉 Test Completed!</h2>
          <p>You completed the <strong>{difficulty}</strong> test.</p>
          <div className="completion-stats">
            <div><span>⚡ WPM</span><h3>{wpm}</h3></div>
            <div><span>🎯 Accuracy</span><h3>{accuracy}%</h3></div>
          </div>
        </div>
      )}

      <button className="restart-btn" onClick={()=>generateParagraph(difficulty)}>
        <FaRedoAlt /> Restart Test
      </button>
    </div>
  );
}

export default Body;
