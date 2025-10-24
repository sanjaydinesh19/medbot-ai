import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

function Workflow() {
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "RSNA Dataset Downloaded", desc: "Acquired RSNA Pneumonia dataset with training and test images." },
    { id: 2, title: "Convert DICOM to JPG", desc: "Converted all DICOM files to JPG format for faster training." },
    { id: 3, title: "Dataset Preprocessing", desc: "Applied normalization, resizing, and augmentations." },
    { id: 4, title: "Model Training (DenseNet121)", desc: "Trained model on GPU with RSNA data, saved best checkpoints." },
    { id: 5, title: "Grad-CAM Integration", desc: "Added explainability through Grad-CAM heatmaps." },
    { id: 6, title: "FastAPI Backend", desc: "Built inference API to serve predictions via FastAPI." },
    { id: 7, title: "React Frontend", desc: "Developed interactive web UI for uploads and results." },
    { id: 8, title: "Comparative Analysis", desc: "Evaluated models for accuracy, F1-score, and AUC." },
    { id: 9, title: "AWS Deployment", desc: "Deployed on AWS EC2 with S3 integration (future step)." },
  ];

  return (
    <div className="container">
      <h1>Project Workflow</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        A visual overview of MedBot AI’s development lifecycle.
      </p>

      <button onClick={() => navigate("/")}>← Back to Home</button>

      <div className="workflow-container">
        {steps.map((step, index) => (
            <div
            key={step.id}
            className="workflow-card animate-step"
            style={{
                animationDelay: `${index * 0.25}s`,
                backgroundColor: `hsl(210, 80%, ${95 - index * 5}%)`, // 💙 gradient blue tones
                borderTop: `4px solid hsl(210, 90%, ${70 - index * 3}%)`,
            }}
            >
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
            {index < steps.length - 1 && <div className="arrow line-animate">→</div>}
            </div>
        ))}
        </div>
    </div>
  );
}

export default Workflow;
