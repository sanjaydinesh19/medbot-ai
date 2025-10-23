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
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Preprocess
        img_tensor = transform(image).unsqueeze(0).to(DEVICE) #type:ignore

        # Inference
        with torch.no_grad():
            output = model(img_tensor)
            probability = torch.sigmoid(output).item()
            prediction = "Pneumonia Detected" if probability >= 0.5 else "Normal"

        return JSONResponse({
            "prediction": prediction,
            "confidence": round(probability, 4)
        })

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
