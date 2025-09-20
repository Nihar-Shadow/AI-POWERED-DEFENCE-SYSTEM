import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.ensemble import RandomForestClassifier
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

# Define the data model for the prediction request
class PredictionRequest(BaseModel):
    lat: float
    lon: float
    wind_speed: float
    temperature: float
    last_threat_count: int

# Define the data model for the prediction response
class PredictionResponse(BaseModel):
    risk_score: float
    risk_level: str

# In-memory storage for the trained model
model = None

# Define lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Generate synthetic data and train the model on startup.
    """
    global model
    # Generate 10,000 random training samples
    X_train = np.random.rand(10000, 5)
    X_train[:, 0] = X_train[:, 0] * 180 - 90     # lat: -90 to 90
    X_train[:, 1] = X_train[:, 1] * 360 - 180    # lon: -180 to 180
    X_train[:, 2] = X_train[:, 2] * 100          # wind_speed: 0 to 100
    X_train[:, 3] = X_train[:, 3] * 50 - 10      # temperature: -10 to 40
    X_train[:, 4] = np.random.randint(0, 10, 10000)  # last_threat_count: 0 to 9

    # Target: threat_next_hour (0 or 1)
    y_train = np.random.randint(0, 2, 10000)

    # Train a RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("✅ Model trained and ready!")
    yield
    print("🛑 Shutting down prediction engine...")

# Initialize the FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    """
    Accepts a JSON object with sensor data and returns a risk prediction.
    """
    data = np.array([[request.lat, request.lon,
                      request.wind_speed, request.temperature,
                      request.last_threat_count]])

    risk_score = model.predict_proba(data)[0][1]

    if risk_score > 0.7:
        risk_level = "HIGH"
    elif risk_score > 0.3:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return {"risk_score": float(risk_score), "risk_level": risk_level}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
