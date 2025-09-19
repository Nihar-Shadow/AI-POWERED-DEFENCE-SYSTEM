import requests

data = {
    "lat": 35.67,
    "lon": 139.65,
    "wind_speed": 12,
    "temperature": 18,
    "last_threat_count": 3
}

response = requests.post("http://localhost:8000/predict", json=data)

print(response.json())