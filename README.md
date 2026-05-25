# 📄 AI-Powered Resume Analyzer

An intelligent, full-stack application designed to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). Users can upload their PDF resumes and receive a compatibility score against specific job descriptions, along with AI-driven feedback and interview preparation questions.

## 🚀 Key Features

- **Automated PDF Parsing:** Seamlessly extracts text from PDF resumes using `pdf-parse`.
- **ATS Scoring Algorithm:** Calculates a weighted compatibility score based on skills, experience, and keywords.
- **AI Feedback Engine:** Integrates with Google Gemini API to provide professional resume improvement tips and mock interview questions.
- **Interactive Dashboard:** A responsive React-based UI for visualizing analysis results.
- **Data Persistence:** Uses MongoDB to securely store analysis history.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Axios, Lucide-React
- **Backend:** Node.js, Express.js, Multer
- **Database:** MongoDB (Mongoose)
- **AI:** Google Gemini API

## ⚙️ Local Setup

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance

### 2. Backend Configuration
1. Navigate to `/server` and run `npm install`.
2. Create a `.env` file with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   PORT=3000
   ```
3. Run `npm start`.

### 3. Frontend Configuration
1. Navigate to `/client` and run `npm install`.
2. Run `npm run dev`.
3. Open `http://localhost:5173`.

## 🔮 Roadmap
- [ ] Implement secure User Authentication (JWT).
- [ ] Add a comprehensive User History Dashboard.
- [ ] Enable PDF export for analysis reports.
