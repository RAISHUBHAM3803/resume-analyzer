<div align="center">
  <img src="client/public/icons.svg" alt="ResuScan AI Logo" width="80" height="80">
  <h1 align="center">ResuScan AI</h1>
  <p align="center">
    <strong>The Ultimate Career AI Suite for Job Seekers</strong>
    <br />
    A production-ready Full Stack application that leverages AI to optimize resumes, generate cover letters, and simulate mock interviews.
  </p>
</div>

---

## 🌟 Features

- **📊 ATS Resume Intelligence**: Upload your PDF resume and paste a job description. The AI extracts text, maps skills, and calculates a precise ATS match score.
- **💡 Actionable Feedback**: Get targeted, line-by-line recommendations on how to improve your resume structure and impact.
- **📝 AI Cover Letter Generator**: Instantly draft personalized, highly relevant cover letters tailored specifically to the target job description.
- **🤖 AI Mock Interviewer**: Practice your interview skills with an interactive AI bot that asks technical and behavioral questions based on your resume and the role you're applying for.
- **✨ STAR Bullet Rewriter**: Transform weak resume bullet points into strong, quantifiable achievements using the STAR (Situation, Task, Action, Result) method.
- **📈 History Tracking**: Keep track of all your past resume analyses and see your improvement over time with secure user authentication.

## 🛠️ Technology Stack

**Frontend:**
- React 18 (Vite)
- Framer Motion (Animations)
- Lucide React (Icons)
- Vanilla CSS / CSS Grid (Bento UI Architecture)
- html2pdf.js (PDF Report Generation)

**Backend:**
- Node.js & Express.js
- MongoDB Atlas (Mongoose)
- Google Gemini AI API (LLM Integration)
- JWT (JSON Web Tokens) & HTTPOnly Cookies
- Helmet.js & Express Rate Limit (Security)
- pdf-parse (Document Parsing)
- Multer (File Uploads)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RAISHUBHAM3803/resume-analyzer.git
   cd resume-analyzer
   ```

2. **Setup the Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory with the following:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key
   CLIENT_URL=http://localhost:5173
   ```

3. **Setup the Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Run the Application**
   Open two terminal windows:
   
   *Terminal 1 (Backend):*
   ```bash
   cd server
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   cd client
   npm run dev
   ```

## 📐 Architecture & Security

- **Authentication**: Utilizes secure HTTPOnly cookies for JWT storage, protecting against XSS attacks.
- **Rate Limiting**: API endpoints are protected against brute force and DDoS attacks using `express-rate-limit`.
- **Clean UI/UX**: Implements a modern "Bento Box" grid system with smooth transitions, responsive design, and intelligent context-aware navigation.
- **Optimized PDF Export**: The dashboard features a custom print stylesheet that automatically strips UI clutter and applies a clean light theme for professional PDF report generation.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/RAISHUBHAM3803/resume-analyzer/issues).

## 📄 License

This project is licensed under the MIT License.
