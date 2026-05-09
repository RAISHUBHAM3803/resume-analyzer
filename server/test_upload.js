const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    const filePath = path.join(__dirname, 'uploads', '1777004214163.pdf');
    const fileBuffer = fs.readFileSync(filePath);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('resume', blob, 'resume.pdf');
    formData.append('jobDescription', 'Looking for a software engineer with React and Node.js experience.');

    const response = await fetch('http://localhost:3000/api/resume/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (response.ok) {
      console.log('Upload successful:', data);
    } else {
      console.error('Upload failed with status', response.status, data);
    }
  } catch (error) {
    console.error('Upload failed:', error.message);
  }
}

testUpload();
