import "./Navbar.css";
import { IoMdSpeedometer } from "react-icons/io";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";

function Navbar({dabba,changeTheme,bestWpm,soundOn,toggleSound}) {
  return (
    <header className={dabba ? "navbar dark-navbar" : "navbar"}>
      <div className="logo-section">
        <IoMdSpeedometer className="logo-icon" />
        <h1>SpeedoType</h1>
      </div>

      <div className="nav-right">
        <div className="best-card">
          <span className="best-label">Best</span>
          <span className="best-score">
            {bestWpm} WPM
          </span>
        </div>

        <button
            className="theme-toggle"
            onClick={toggleSound}
            aria-label="Toggle Sound"
        >
            {soundOn ? <HiSpeakerWave /> : <HiSpeakerXMark />}
        </button>

        <button
          className="theme-toggle"
          onClick={changeTheme}
          aria-label="Toggle Theme"
        >
          {dabba ? <MdLightMode /> : <MdDarkMode />}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
