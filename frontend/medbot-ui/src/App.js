import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import UploadPredict from "./components/UploadPredict";
import Comparison from "./components/Comparison";
import Workflow from "./components/Workflow";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/predict" element={<UploadPredict />} />
        <Route path="/compare" element={<Comparison />} />
        <Route path="/workflow" element={<Workflow />} />
      </Routes>
    </Router>
  );
}

export default App;
