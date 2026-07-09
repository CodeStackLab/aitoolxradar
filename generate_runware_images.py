import requests
import json
import uuid
import os
import re

app_js_path = os.path.join(os.path.dirname(__file__), 'public', 'app.js')

titles = [
    "How to Boost Developer Productivity with AI Micro-Tools",
    "Why Privacy-First Local Utilities Matter for Tech Teams",
    "Understanding Serverless AI Models & Free Tiers",
    "Mastering UI/UX: The Glassmorphism Trend in Modern Web Apps",
    "Technical SEO in 2026: Beyond Just Meta Tags",
    "The Rise of Micro-SaaS and Single-Purpose Utilities",
    "10 VS Code Extensions Every Web Developer Needs",
    "Building Resilient APIs with Node.js and Express",
    "The Future of Frontend: WebAssembly and Rust",
    "State Management in React: Redux vs Context in 2026",
    "Securing Your Web Apps: Common Vulnerabilities",
    "Automating Deployment with GitHub Actions",
    "Designing Dark Mode: Best Practices and Pitfalls",
    "Database Indexing Strategies for High-Traffic Sites",
    "GraphQL vs REST: Making the Right Choice",
    "Dockerizing Your Full-Stack Application",
    "The Complete Guide to CSS Grid and Flexbox",
    "Optimizing Web Performance: LCP and CLS",
    "Introduction to Machine Learning for JavaScript Developers",
    "Building Progressive Web Apps (PWAs) from Scratch",
    "Demystifying Serverless Functions and Edge Computing",
    "Mastering TypeScript: Tips for Advanced Developers",
    "The Importance of Accessibility in Modern Web Design",
    "Integrating Payment Gateways: Stripe vs PayPal",
    "Effective Logging and Monitoring for Node.js Applications"
]

url = "https://api.runware.ai/v1"
headers = {
    "Content-Type": "application/json"
}

payload = [
    {
        "taskType": "authentication",
        "apiKey": "GHL2k8FOL5s42njWhHLB3SO2JiHnEov4"
    }
]

task_uuid_to_title = {}

for title in titles:
    task_id = str(uuid.uuid4())
    task_uuid_to_title[task_id] = title
    prompt = f"A professional, highly-detailed editorial digital illustration for a tech blog titled: '{title}'. Modern, minimalist, tech-focused, vibrant colors, 8k resolution, cinematic lighting."
    
    payload.append({
        "taskType": "imageInference",
        "taskUUID": task_id,
        "positivePrompt": prompt,
        "model": "runware:101@1",
        "height": 512,
        "width": 896,
        "numberResults": 1
    })

print("Sending request to Runware API for 25 images...")
response = requests.post(url, headers=headers, json=payload)
data = response.json()

if "errors" in data and len(data["errors"]) > 0:
    print("API returned errors:", data["errors"])
    exit(1)

title_to_image_url = {}
for item in data.get("data", []):
    if item.get("taskType") == "imageInference":
        t_id = item.get("taskUUID")
        img_url = item.get("imageURL")
        if t_id in task_uuid_to_title and img_url:
            title_to_image_url[task_uuid_to_title[t_id]] = img_url

print(f"Successfully generated {len(title_to_image_url)} images.")

with open(app_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace picsum placeholders in app.js
for title, img_url in title_to_image_url.items():
    id_str = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    # Use regex to find the image property of the object with this id and title
    # We'll just regex replace the image field based on title or picsum sequence
    # Actually, the easiest way is to find the object in app.js and replace its image string
    # We can match the title
    pattern = r'("title":\s*"' + re.escape(title) + r'".*?"image":\s*")[^"]+(")'
    content = re.sub(pattern, r'\1' + img_url + r'\2', content, flags=re.DOTALL)

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated app.js with Runware image URLs.")
