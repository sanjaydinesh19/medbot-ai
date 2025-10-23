#Working API for Frontend to upload images to.
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

app = FastAPI(title = "MedBot Pneumonia Classifier")

#Allow local frontend to call this API during development
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000","http://127.0.0.1:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

@app.get("/")
def read_root():
    return {"message": "MedBot Backend is running."}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded image, performs a tiny sanity check (loads with PIL),
    and returns a dummy prediction. We'll replace the dummy logic with real
    model inference in a later step.
    """
    contents = await file.read()
    try:
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        return JSONResponse({"error":"Invalid image file.","details":str(e)}, status_code=400)
    
    #For now, return a dummy prediction
    return JSONResponse({
        "prediction": "normal",
        "confidence":0.51
    })