# 📄 AI-Powered Resume Analyzer

An intelligent, full-stack web application built to help job seekers optimize their resumes for Applicant Tracking Systems (ATS). The application allows users to upload their resume in PDF format alongside a target job description. It then provides an ATS match score, identifies missing skills, and leverages AI to generate personalized feedback and interview questions.

## ✨ Core Features

- **Smart PDF Parsing:** Extracts and analyzes raw text from uploaded PDF resumes using stream processing.
- **ATS Match Algorithm:** Calculates a weighted compatibility score based on skills, experience, education, and keywords from the target job description.
- **AI-Generated Feedback:** Integrates with the OpenAI API to act as a virtual recruiter, providing personalized resume improvement tips and domain-specific mock interview questions.
- **Interactive Dashboard:** A responsive React frontend that visualizes ATS scores and skill gaps.
- **Secure Storage:** Uses MongoDB to store user data and past resume analysis history.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Custom CSS
- Axios

**Backend:**
- Node.js & Express.js
- Multer (File upload handling)
- pdf-parse (PDF text extraction)
- OpenAI API (Generative feedback)

**Database:**
- MongoDB (Mongoose ORM)

## 🚀 Local Setup Instructions

If you would like to run this project locally, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/RAISHUBHAM3803/resume-analyzer.git
cd resume-analyzer
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## 🔮 Roadmap / Future Improvements
- Implement full user authentication flow (Login/Signup).
- Add a "History Dashboard" so users can track score improvements over time.
- Build export functionality to download the final feedback report as a PDF.
