# 📄 AI-Powered Resume Analyzer

![Resume Analyzer Banner](https://via.placeholder.com/1000x400.png?text=AI-Powered+Resume+Analyzer)

An intelligent, full-stack web application that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). Users can upload their resume in PDF format along with a target job description, and the app will provide an ATS match score, identify missing skills, and offer AI-generated feedback and interview questions to improve their chances of getting hired.

## ✨ Features

- **📄 Smart PDF Parsing:** Extracts and analyzes raw text from uploaded PDF resumes.
- **🎯 ATS Match Scoring:** Calculates a weighted compatibility score based on skills, experience, education, and keywords from the target job description.
- **🤖 AI-Generated Feedback:** Integrates with the OpenAI API to act as a virtual recruiter, providing personalized resume improvement tips and mock interview questions.
- **📊 Interactive Dashboard:** A beautiful, responsive React frontend that visualizes your ATS score and skill gaps.
- **💾 Secure Storage:** Uses MongoDB to store user data and past resume analysis history.

## 🛠️ Tech Stack

**Frontend:**
- React.js (via Vite)
- CSS (Custom Styling)
- Axios for API requests

**Backend:**
- Node.js & Express.js
- Multer (File upload handling)
- pdf-parse (PDF text extraction)
- OpenAI API (Generative feedback)

**Database:**
- MongoDB (Mongoose ORM)

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resume-analyzer.git
cd resume-analyzer
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_jwt_secret
```

Start the backend server:
```bash
npm start
# Server will run on http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```

Start the frontend development server:
```bash
npm run dev
# The app will be running at http://localhost:5173
```

## 📸 Screenshots

*(Replace these links with actual screenshots of your application)*

| Upload Page | Dashboard & Results |
|:---:|:---:|
| ![Upload](https://via.placeholder.com/400x250.png?text=Upload+Screen) | ![Dashboard](https://via.placeholder.com/400x250.png?text=Results+Dashboard) |

## 🔮 Future Improvements

- [ ] Complete user authentication flow (Login/Signup).
- [ ] Implement a "History Dashboard" so users can track improvements over time.
- [ ] Add export functionality to download the final feedback report as a PDF.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/resume-analyzer/issues).

## 📝 License
This project is open-source and available under the MIT License.
