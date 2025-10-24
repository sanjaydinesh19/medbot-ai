import React from "react";
import { useNavigate } from "react-router-dom";

function Comparison() {
  const navigate = useNavigate();

  const modelResults = [
    { model: "DenseNet121", accuracy: 0.77, f1: 0.77, auc: 0.831, time: "131s" },
    { model: "ResNet50", accuracy: 0.755, f1: 0.72, auc: 0.841, time: "77s" },
    { model: "EfficientNet-B0", accuracy: 0.75, f1: 0.73, auc: 0.836, time: "52s" },
  ];

  return (
    <div className="container">
      <h1>Model Comparative Analysis</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Evaluating model performance on the RSNA Pneumonia Dataset.
      </p>

      <button onClick={() => navigate("/")}>← Back to Home</button>

      <div style={{ marginTop: "30px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f4f6f8" }}>
              <th style={thStyle}>Model</th>
              <th style={thStyle}>Accuracy</th>
              <th style={thStyle}>F1-Score</th>
              <th style={thStyle}>AUC</th>
              <th style={thStyle}>Training Time (Per 1000 Images)</th>
            </tr>
          </thead>
          <tbody>
            {modelResults.map((m) => (
              <tr key={m.model}>
                <td style={tdStyle}>{m.model}</td>
                <td style={tdStyle}>{(m.accuracy * 100).toFixed(2)}%</td>
                <td style={tdStyle}>{(m.f1 * 100).toFixed(2)}%</td>
                <td style={tdStyle}>{(m.auc * 100).toFixed(2)}%</td>
                <td style={tdStyle}>{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "40px", color: "#777" }}>
        <p>
          DenseNet121 achieved the highest overall accuracy and AUC, indicating superior
          feature extraction for pneumonia detection.
        </p>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "12px 15px",
  borderBottom: "2px solid #ddd",
  fontWeight: "600",
  color: "#2c3e50",
};

const tdStyle = {
  padding: "12px 15px",
  borderBottom: "1px solid #eee",
  color: "#444",
};

export default Comparison;
