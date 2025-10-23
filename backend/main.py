# backend/main.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
import torch.nn as nn
from torchvision import models, transforms

app = FastAPI(title="MedBot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "model/model_weights/baseline.pt"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define model architecture 
model = models.densenet121(pretrained=False)
model.classifier = nn.Linear(model.classifier.in_features, 1)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model = model.to(DEVICE)
model.eval()

# Image preprocessing 
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

@app.get("/")
def read_root():
    return {"message": "MedBot backend loaded successfully."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and Preprocess Image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        img_tensor = transform(image).unsqueeze(0).to(DEVICE) #type:ignore

        # Run Inference
        with torch.no_grad():
            output = model(img_tensor)
            probability = torch.sigmoid(output).item()
            prediction = "Pneumonia Detected" if probability >= 0.5 else "Normal"

        # Log Results
        import csv, datetime, os
        os.makedirs("logs", exist_ok=True)
        log_file = "logs/predictions_log.csv"
        log_fields = ["timestamp", "filename", "prediction", "confidence", "device"]
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Append if file exists, else create with header
        write_header = not os.path.exists(log_file)
        with open(log_file, "a", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=log_fields)
            if write_header:
                writer.writeheader()
            writer.writerow({
                "timestamp": timestamp,
                "filename": file.filename,
                "prediction": prediction,
                "confidence": round(probability, 4),
                "device": DEVICE.type
            })

        return JSONResponse({
            "prediction": prediction,
            "confidence": round(probability, 4)
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/explain")
def explain_info():
    return {
        "message": "Grad-CAM endpoint placeholder",
        "status": "ready for Phase 2"
    }

