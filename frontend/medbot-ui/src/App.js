import React, { useState } from "react";

function App() {
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

      // The endpoint returns an image blob
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
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>MedBot AI</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />

      {preview && (
        <img
          src={preview}
          alt="Uploaded"
          width="300"
          style={{ borderRadius: "10px", boxShadow: "0 0 10px #999" }}
        />
      )}
      <br /><br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Analyzing..." : "Upload & Predict"}
      </button>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result:</h2>
          <p><strong>Prediction:</strong> {response.prediction}</p>
          <p><strong>Confidence:</strong> {(response.confidence * 100).toFixed(2)}%</p>

          <div
            style={{
              width: "300px",
              height: "20px",
              backgroundColor: "#eee",
              borderRadius: "10px",
              margin: "10px auto"
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.min(response.confidence * 100, 100)}%`,
                backgroundColor: response.prediction.includes("Pneumonia")
                  ? "#e74c3c"
                  : "#2ecc71",
                borderRadius: "10px",
                transition: "width 0.5s ease"
              }}
            ></div>
          </div>

          <button onClick={handleExplain} disabled={loadingCam} style={{ marginTop: "10px" }}>
            {loadingCam ? "Generating Heatmap..." : "Show Heatmap"}
          </button>
        </div>
      )}

      {heatmap && (
        <div style={{ marginTop: "30px" }}>
          <h3>Grad-CAM Heatmap:</h3>
          <img
            src={heatmap}
            alt="Grad-CAM"
            width="300"
            style={{ borderRadius: "10px", boxShadow: "0 0 10px #666" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
