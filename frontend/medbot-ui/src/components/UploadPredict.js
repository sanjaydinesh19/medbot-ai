import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadPredict() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [heatmap, setHeatmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingCam, setLoadingCam] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setResponse(null);
    setHeatmap(null);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select an image first");
    setLoading(true);
    setResponse(null);
    setHeatmap(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!selectedFile) return alert("Upload an image first!");
    setLoadingCam(true);
    setHeatmap(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/gradcam", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to generate Grad-CAM");
      const blob = await res.blob();
      const imgUrl = URL.createObjectURL(blob);
      setHeatmap(imgUrl);
    } catch (err) {
      console.error(err);
      alert("Error fetching Grad-CAM heatmap");
    } finally {
      setLoadingCam(false);
    }
  };

  return (
    <div className="container">
      <h1>MedBot AI</h1>
      <p style={{ color: "#555", marginBottom: "20px" }}>
        Pneumonia Detection from Chest X-rays
      </p>

    <button onClick={() => navigate("/")}>← Back to Home</button>

    <div style={{ marginTop: "20px" }}>
    <input type="file" accept="image/*" onChange={handleFileChange} />
    </div>

      {preview && (
        <div style={{ marginTop: "20px" }}>
          <img src={preview} alt="Uploaded" width="320" className="image-preview" />
        </div>
      )}

      <div style={{ marginTop: "25px" }}>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Analyzing..." : "Upload & Predict"}
        </button>
      </div>

      {loading && <p className="loading">Analyzing X-ray image...</p>}

      {response && (
        <div style={{ marginTop: "30px" }}>
          <h2>Diagnosis Result</h2>
          <p>
            <strong>Prediction:</strong> {response.prediction}
          </p>
          <p>
            <strong>Confidence:</strong> {(response.confidence * 100).toFixed(2)}%
          </p>

          <div className="progress-bar">
            <div
              className="progress-inner"
              style={{
                width: `${Math.min(response.confidence * 100, 100)}%`,
                backgroundColor: response.prediction.includes("Pneumonia")
                  ? "#e74c3c"
                  : "#2ecc71",
              }}
            ></div>
          </div>

          <button
            onClick={handleExplain}
            disabled={loadingCam}
            style={{ marginTop: "15px" }}
          >
            {loadingCam ? "Generating Heatmap..." : "Show Grad-CAM"}
          </button>
        </div>
      )}

      {heatmap && (
        <div style={{ marginTop: "30px" }}>
          <h3>Grad-CAM Visualization</h3>
          <img src={heatmap} alt="Grad-CAM" width="320" className="image-preview" />
        </div>
      )}
    </div>
  );
}

export default UploadPredict;
