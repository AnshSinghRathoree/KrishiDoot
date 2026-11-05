# KrishiDoot 🌱

**AI-Powered Agricultural Decision Support System**

🔗 **Live Project:** https://krishi-doot-nine.vercel.app/

KrishiDoot is a group project focused on making useful agricultural information and decision-support tools more accessible to farmers. The project aims to support farmers with crop recommendations, fertilizer guidance, cultivation planning and agricultural market information.

## Features

- **Crop Recommendation:** Recommends a crop using soil and environmental inputs.
- **Fertilizer Advisor:** Provides rule-based fertilizer guidance based on crop and soil details.
- **Farmer Dashboard:** Displays agricultural information and visual summaries.
- **Smart Mandi Marketplace:** Provides a marketplace interface for comparing mandi information.
- **Cultivation Planning:** Planned workflows for selecting a crop manually or proceeding from a crop recommendation.

> **Note:** KrishiDoot is an ongoing group project. Some features are still under development. The marketplace currently includes prototype/static data, and planned features such as the IoT integration are not yet complete.

## Technology Stack

- **Frontend:** React.js, JavaScript, HTML, CSS
- **Backend:** Python, Flask
- **Machine Learning:** scikit-learn, Random Forest
- **Authentication and Database:** Firebase Authentication, Cloud Firestore
- **Deployment:** Vercel (frontend), Render (backend)

## Crop Recommendation Model

The baseline crop recommendation model supports 22 crop categories and uses seven input parameters:

1. Nitrogen (N)
2. Phosphorus (P)
3. Potassium (K)
4. Temperature
5. Relative humidity
6. Soil pH
7. Rainfall

The model output is intended to assist decision-making. It should not be treated as a guarantee of crop suitability or yield.

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/AnshSinghRathoree/KrishiDoot.git
cd KrishiDoot
```

### 2. Start the backend

```bash
cd krishi-doot/backend
python -m venv .venv
```

Activate the virtual environment:

**Windows PowerShell**
```powershell
.venv\\Scripts\\Activate.ps1
```

**Windows Command Prompt**
```bat
.venv\\Scripts\\activate
```

**macOS / Linux**
```bash
source .venv/bin/activate
```

Install the backend dependencies using the project's requirements file, if available:

```bash
pip install -r requirements.txt
```

Then start the Flask application:

```bash
python app.py
```

### 3. Start the frontend

Open another terminal:

```bash
cd krishi-doot/frontend
npm install
npm start
```

Use your local frontend address shown in the terminal. Make sure the frontend API configuration points to the backend address you are running.

## Project Status

KrishiDoot is actively being developed. The current prototype includes the crop recommendation and fertilizer-advisor workflows, authentication screens, dashboard and marketplace interface. Additional work planned complete crop cultivation plans, marketplace logic, UI improvements and experimental IoT integration.

## Contributors

- Akash Patel
- Anant Kaushik
- Ansh Singh Rathore

---

**KrishiDoot — Supporting smarter agricultural decisions through technology.**
