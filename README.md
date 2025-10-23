# MedBot AI – Pneumonia Detection from Chest X-rays

**MedBot** is an AI-powered web application that detects pneumonia from X-ray scans using a deep learning model (DenseNet121).  
Users can upload images through a simple web interface and receive instant predictions with confidence scores.

## Tech Stack
- **Frontend:** React.js  
- **Backend:** FastAPI  
- **AI Model:** PyTorch (DenseNet121)  
- **Dataset:** RSNA Pneumonia Detection Challenge  

## Features
- Upload X-ray images  
- Real-time pneumonia detection  
- Confidence scores  
- GPU acceleration (CUDA)  
- Modular backend for future Grad-CAM visualizations  

## 🧠 Project Structure
```
medbot-ai/
├── backend/ # FastAPI backend (AI inference)
├── frontend/ # React upload UI
├── model/ # Training + model weights
├── data/ # (ignored, local only)
└── notebooks/ # Utilities and experiments
```