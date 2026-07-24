import { useEffect, useState } from "react";
import "../cssfiles/LandingScreen.css";

const TAGLINE = "Different LLM models... Search on useModel, rate it, get the right download link, add your favorite models.";
const TYPING_SPEED = 150;
const HOLD_AFTER_FINISH = 700;
const FADE_DURATION = 500;

export default function LandingScreen({ onFinish }) {
  const [typed, setTyped] = useState("");
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(function () {
    if (typed.length >= TAGLINE.length) {
      const holdTimer = setTimeout(() => setIsFadingOut(true), HOLD_AFTER_FINISH);
      return () => clearTimeout(holdTimer);
    }
    const timer = setTimeout(() => {
      setTyped(TAGLINE.slice(0, typed.length + 1));
    }, TYPING_SPEED);
    return () => clearTimeout(timer);
  }, [typed]);

  useEffect(function () {
    if (!isFadingOut) return;
    const fadeTimer = setTimeout(onFinish, FADE_DURATION);
    return () => clearTimeout(fadeTimer);
  }, [isFadingOut, onFinish]);

  return (
    <div className={`landing-screen ${isFadingOut ? "fade-out" : ""}`}>
      <div className="landing-content">
        <h1 className="landing-title">
          <span className="logo-emoji">🤖</span>
          <span className="landing-title-text">useModels</span>
        </h1>
        <p className="landing-tagline">
          {typed}
          <span className="typewriter-cursor">|</span>
        </p>
      </div>
    </div>
  );
}
