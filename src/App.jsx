import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Body from "./components/Body";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("firke") === "true"
  );

  const [bestWpm, setBestWpm] = useState(
    Number(localStorage.getItem("bestWpm")) || 0
  );

  const [soundOn, setSoundOn] = useState(
    localStorage.getItem("soundOn") !== "false"
  );

  function toggleSound() {
    const value = !soundOn;
    setSoundOn(value);
    localStorage.setItem("soundOn", value);
  }

  useEffect(() => {
    localStorage.setItem("firke", darkMode);
  }, [darkMode]);

  function changeTheme() {
    setDarkMode((prev) => !prev);
  }

  return (
    <div className={darkMode ? "app dark-theme" : "app light-theme"}>
      <Navbar
        dabba={darkMode}
        changeTheme={changeTheme}
        bestWpm={bestWpm}
        soundOn={soundOn}
        toggleSound={toggleSound}
      />

      <main className="main-content">
        <Body
          darkMode={darkMode}
          bestWpm={bestWpm}
          setBestWpm={setBestWpm}
          soundOn={soundOn}
        />
      </main>
    </div>
  );
}

export default App;