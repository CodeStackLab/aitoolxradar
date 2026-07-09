import requests
import json
import uuid

url = "https://api.runware.ai/v1"
headers = {
    "Content-Type": "application/json"
}

payload = [
    {
        "taskType": "authentication",
        "apiKey": "GHL2k8FOL5s42njWhHLB3SO2JiHnEov4"
    },
    {
        "taskType": "imageInference",
        "taskUUID": str(uuid.uuid4()),
        "positivePrompt": "A futuristic city with flying cars, cyberpunk",
        "model": "runware:101@1", # Flux 1 Dev
        "height": 512,
        "width": 512,
        "numberResults": 1
    }
]

try:
    response = requests.post(url, headers=headers, json=payload)
    print("Status Code:", response.status_code)
    print("Response:", response.text)
except Exception as e:
    print(e)
