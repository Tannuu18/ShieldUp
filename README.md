# 🛡️ ShieldUp

> **Detect. Prevent. Educate.**
>
> An AI-powered scam detection and cybersecurity awareness platform designed to help users identify fraudulent messages, suspicious URLs, phishing screenshots, and social engineering attacks.

---

## 📌 Overview

ShieldUp is a cybersecurity-focused web application that leverages Google's Gemini AI to analyze potentially fraudulent content and help users make safer decisions online.

The platform aims to combat common digital scams such as:

* Phishing attacks
* Fake job offers
* OTP and banking scams
* QR code scams
* Brand impersonation
* Social engineering attacks
* Malicious links and websites

Rather than only detecting scams, ShieldUp also focuses on **user education** through interactive scam simulations that teach users how scammers operate.

---

## 🚀 Features

### 1. Scam Message Analyzer

Analyze suspicious messages using AI.

Users can paste messages received via:

* SMS
* WhatsApp
* Telegram
* Email
* Social Media

The AI evaluates the content and returns:

* Risk Level
* Scam Type
* Red Flags
* Safety Recommendations

#### Example

**Input**

```text
Congratulations! You have been selected for an internship.
Pay ₹499 registration fee immediately to confirm your slot.
```

**Output**

```text
Risk Level: High

Scam Type: Job Scam

Red Flags:
• Upfront payment request
• Artificial urgency
• Too-good-to-be-true offer

Recommendation:
Do not make any payment. Verify the opportunity through official channels.
```

---

### 2. URL Scanner

Analyze suspicious links before opening them.

The scanner evaluates URLs and generates a risk assessment based on security indicators and AI analysis.

#### Example

```text
Input:
https://suspicious-domain.xyz

Output:
Risk Score: 87/100
Status: Suspicious
Recommendation: Avoid visiting this website.
```

---

### 3. Screenshot Detector

Upload screenshots of websites, emails, advertisements, or messages for AI-powered analysis.

The system can identify:

* Fake login pages
* Brand impersonation
* Suspicious payment requests
* Phishing attempts
* Social engineering tactics

#### Supported Examples

* Fake bank login pages
* Fake Amazon offers
* Fake internship forms
* Fraudulent payment screenshots

---

### 4. QR Code Scanner

Upload a QR code image to inspect its contents safely.

The scanner:

* Decodes the QR code
* Extracts hidden URLs
* Evaluates potential threats
* Provides a risk assessment

This helps users avoid malicious QR-based phishing attacks.

---

### 5. AI Scam Simulator ⭐

The Scam Simulator is the educational component of ShieldUp.

Users interact with simulated scammers in a safe environment and learn how to identify red flags.

#### Available Scenarios

* Fake Recruiter Scam
* Fake Bank Representative
* Refund Scam
* Prize Winner Scam

#### Learning Objectives

Users learn to:

* Identify manipulation tactics
* Avoid sharing personal information
* Recognize urgency-based scams
* Detect suspicious requests

---

## 🏗️ Project Structure

```text
ShieldUp/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── database/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── .env
│   ├── requirements.txt
│   └── test.py
│
├── frontend_2.0/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── utils/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
├── .gitignore
└── README.md
```

---


## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Lucide React

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic

### AI & Machine Learning
- Google Gemini API

### Utilities
- Python Dotenv
- Requests

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/shieldup.git

cd shieldup
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend will run on:

```text
http://localhost:8000
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
GEMINI_API_KEY=your_api_key_here
```

---

## API Endpoints

### Analyze Scam Message

```http
POST /analyze-scam
```

#### Request

```json
{
  "message": "Suspicious message content"
}
```

---

### Scan URL

```http
POST /scan-url
```

#### Request

```json
{
  "url": "https://example.com"
}
```

---

### Analyze Screenshot

```http
POST /analyze-screenshot
```

#### Request

```multipart
image file
```

---

### Scan QR Code

```http
POST /scan-qr
```

#### Request

```multipart
qr image file
```

---

### Scam Simulator

```http
POST /simulate-scam
```

#### Request

```json
{
  "scenario": "fake_recruiter"
}
```

---

## 🎯 Hackathon Demo Flow

### Step 1 — Scam Message Detection

Paste a suspicious message.

↓

AI analyzes the content.

↓

Risk level and scam indicators are displayed.

---

### Step 2 — Screenshot Analysis

Upload a suspicious screenshot.

↓

AI identifies phishing indicators.

↓

Threat assessment is generated.

---

### Step 3 — URL Scanning

Enter a suspicious link.

↓

The system evaluates risk.

↓

Safety recommendation is displayed.

---

### Step 4 — Scam Simulator

Choose a scam scenario.

↓

Interact with an AI scammer.

↓

Receive feedback and learning insights.

---

## 🔒 Security Considerations

* API keys stored securely using environment variables
* Input validation using FastAPI and Pydantic
* Secure file upload handling
* Scalable backend architecture
* Modular AI service integration

---

## 🔮 Future Enhancements

* Browser Extension
* Mobile Application
* Email Scam Detection
* Real-Time SMS Analysis
* Multi-Language Support
* Voice Scam Detection
* User Dashboard & Reports
* Threat Intelligence Integration
* Database Support for User History

---

## 🌟 Vision

ShieldUp aims to make cybersecurity accessible to everyone by combining AI-powered scam detection with practical user education.

The goal is not only to identify threats but also to help users build the skills needed to stay safe online.

---

## 📄 License

This project is developed for educational, research, and hackathon purposes.
