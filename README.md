# KrishiDoot 🌱

**AI-Powered Agricultural Decision Support System**

[![Live Application](https://img.shields.io/badge/Live%20App-Open-2ea44f)](https://krishi-doot-nine.vercel.app/)

**Live application:** https://krishi-doot-nine.vercel.app/  
**Source code:** https://github.com/AnshSinghRathoree/KrishiDoot

KrishiDoot is a web-based agricultural decision-support platform designed to make useful farming information easier to access. It brings together machine-learning-based crop recommendations, fertilizer guidance, farmer-facing dashboards, prediction history, and a multilingual AI farming assistant.

The project is being developed as an integrated prototype. Features that depend on live market feeds, complete cultivation workflows, or IoT hardware should be treated as prototype or planned capabilities unless they are explicitly marked as implemented below.

---

## Features

### Implemented in the current application

- **Crop recommendation:** Recommends a crop from soil and environmental inputs using a Random Forest classification model.
- **Fertilizer guidance:** Provides rule-based fertilizer guidance for supported crops and input conditions.
- **User accounts:** Firebase Authentication supports user sign-up and login.
- **Dashboard and history:** Firestore stores user prediction records so users can revisit previous results.
- **AI farming assistant:** A conversational assistant answers farming-related questions and can use the authenticated user's recent prediction history as context.
- **Multilingual and voice interaction:** The assistant supports the application's supported languages and voice input/speech features.
- **Responsive web interface:** React provides the farmer-facing application experience.

### Prototype / future work

- **Mandi marketplace:** The interface is a prototype and may contain static/sample information; it should not be interpreted as a verified live mandi-price feed.
- **Advanced cultivation planning:** Additional end-to-end crop planning workflows are under development.
- **IoT integration:** Sensor-based soil data collection is a proposed extension and requires hardware and integration work.

---

## Technology Stack

| Layer | Technologies | Responsibility |
|---|---|---|
| Frontend | React.js, JavaScript, HTML, CSS | User interface and application interactions |
| API / Backend | Python, Flask | REST endpoints, application logic, authentication checks, and model integration |
| Machine learning | scikit-learn, Random Forest | Crop classification from agricultural input parameters |
| Data processing | NumPy, Pandas | Numerical operations and data handling |
| Authentication | Firebase Authentication | User sign-up, login, and identity management |
| Database | Cloud Firestore | User-related application data and prediction history |
| Generative AI | Groq API, Cloudflare Workers AI | Primary and fallback providers for the AI assistant |
| Frontend deployment | Vercel | Hosting the React application |
| Backend deployment | Render | Hosting the Flask API |

---

## Machine Learning: Crop Recommendation

The current crop recommendation model is a **Random Forest classifier** that predicts one of **22 crop categories** using seven input features:

1. Nitrogen (N)
2. Phosphorus (P)
3. Potassium (K)
4. Temperature
5. Relative humidity
6. Soil pH
7. Rainfall

### Prediction flow

1. The user enters the soil and environmental values in the frontend.
2. The frontend sends the input to the Flask backend.
3. The backend prepares the input in the format expected by the saved model and runs the prediction.
4. The predicted crop is returned to the frontend and can be saved to the user's prediction history.

The recommendation is intended to support decision-making. It is not a guarantee of crop suitability, yield, or profitability and should be considered alongside local agronomic advice and field conditions.

---

## Backend and AI Assistant

The Flask backend exposes application APIs and connects the frontend to the machine-learning and data services.

### AI assistant request flow

1. The frontend sends the user's message to `POST /api/assistant/chat` with a Firebase ID token in the `Authorization: Bearer <token>` header.
2. The backend verifies the token using Firebase Admin and obtains the authenticated user's ID.
3. The backend retrieves a limited set of that user's recent crop predictions from Firestore to provide relevant context.
4. The assistant sends the conversation to **Groq** first.
5. If the primary provider fails, the backend attempts **Cloudflare Workers AI** as a fallback.
6. The generated answer is returned to the frontend assistant interface.

The backend also provides `GET /api/health` for a basic service health check.

### AI provider configuration

The assistant uses environment variables for provider credentials and model selection:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_MODEL`

Keep these values private. Do not commit API tokens or secret files to GitHub.

---

## Firebase Configuration

The application uses:

- **Firebase Authentication** for user identity.
- **Cloud Firestore** for application data and per-user prediction history.
- **Firebase Admin SDK** in the backend to verify Firebase ID tokens and access Firestore securely.

For local backend development, provide a Firebase service-account JSON file and configure:

```env
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/firebase-service-account.json
```

On Render, use a Render Secret File for the service-account JSON and point `GOOGLE_APPLICATION_CREDENTIALS` to its mounted path. Never commit the service-account JSON file to the repository.

---

## Run Locally

### Prerequisites

- Python 3.10 or a compatible Python version for the project's dependencies
- Node.js and npm
- Git
- Firebase project configuration
- Groq and/or Cloudflare credentials for the AI assistant
- Firebase service-account credentials for backend Firebase Admin access

### 1. Clone the repository

```bash
git clone https://github.com/AnshSinghRathoree/KrishiDoot.git
cd KrishiDoot
```

### 2. Set up the backend

```bash
cd krishi-doot/backend
python -m venv .venv
```

Activate the virtual environment.

**Windows PowerShell**

```powershell
.\.venv\Scripts\Activate.ps1
```

**Windows Command Prompt**

```bat
.\.venv\Scripts\activate
```

**macOS / Linux**

```bash
source .venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

Create a local `.env` file in the backend directory and add the required configuration. Use your own credentials and provider-supported model IDs:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_groq_model_id

CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_MODEL=your_cloudflare_model_id

GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/firebase-service-account.json
```

Start the Flask backend:

```bash
python app.py
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd krishi-doot/frontend
npm install
npm start
```

Use the local frontend address printed in the terminal. Ensure the frontend's API configuration points to the local Flask backend rather than the production backend.

> **Note:** The frontend Firebase configuration must also point to your Firebase project. Do not place private service-account credentials in the frontend.

---

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | Basic backend health check |
| `POST` | `/api/assistant/chat` | Authenticated AI assistant conversation |

The assistant endpoint requires a valid Firebase ID token in the request's Authorization header. Crop-prediction and other application endpoints are implemented in the backend; refer to the current Flask route definitions for their exact paths and request formats.

---

## Deployment

| Component | Hosting |
|---|---|
| React frontend | [Vercel](https://vercel.com/) |
| Flask backend | [Render](https://render.com/) |
| Authentication and database | [Firebase](https://firebase.google.com/) |

Production credentials and configuration are managed through the respective hosting-platform environment settings and secret-file facilities. Never commit `.env` files, API tokens, Firebase service-account JSON files, or other credentials.

---

## Project Structure

```text
KrishiDoot/
└── krishi-doot/
    ├── backend/
    │   ├── app.py
    │   ├── ai_provider.py
    │   ├── assistant_service.py
    │   ├── firebase_admin_setup.py
    │   └── requirements.txt
    └── frontend/
        └── React application
```

The frontend and backend may contain additional components and modules; see the repository for the complete source tree.

---

## Contributor
- Ansh Singh Rathore

---

**KrishiDoot — Supporting smarter agricultural decisions through technology.**
