import React, {useState} from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if(!selectedFile) return alert("Please select a file first.");
    setLoading(true);
    setResponse(null);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try{
      const res = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    }
    catch(err){
      console.error(err);
      alert("Error connecting to backend");
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>MedBot - Pneumonia Classifier</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br /><br />

      {preview && (
        <img
          src={preview}
          alt="preview"
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
          <p><strong>Confidence:</strong> {response.confidence}</p>
        </div>
      )}
    </div>
  );
}

export default App;
