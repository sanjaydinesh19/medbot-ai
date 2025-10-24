import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Landing() {
  const navigate = useNavigate();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-container">
      <h1 className="landing-title">MedBot AI</h1>
      <p className={`landing-caption ${fadeIn ? "fade-in" : ""}`}>
        Intelligent Pneumonia Detection and Analysis
      </p>

      <div className="landing-buttons">
        <button onClick={() => navigate("/predict")}>Upload & Predict</button>
        <button onClick={() => navigate("/compare")}>Comparative Analysis</button>
        <button onClick={() => navigate("/workflow")}>View Workflow</button>
      </div>
    </div>
  );
}

export default Landing;
