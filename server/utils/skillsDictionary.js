const techSkills = [
  // Programming Languages
  "JavaScript", "Python", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Go", "Rust", "TypeScript", "HTML", "CSS", "SQL", "R", "Dart", "Scala", "Perl",

  // Frontend Frameworks & Libs
  "React", "Angular", "Vue", "Svelte", "Next.js", "Nuxt.js", "jQuery", "Bootstrap", "Tailwind", "Material-UI", "Redux", "Webpack", "Vite",

  // Backend & APIs
  "Node.js", "Express", "Django", "Flask", "Spring Boot", "Ruby on Rails", "Laravel", "ASP.NET", "GraphQL", "REST API", "SOAP", "FastAPI", "NestJS",

  // Databases
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Cassandra", "Elasticsearch", "Firebase", "DynamoDB", "Oracle", "MariaDB", "Neo4j",

  // DevOps, Cloud & Deployment
  "AWS", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "Jenkins", "GitLab CI", "GitHub Actions", "Terraform", "Ansible", "Linux", "Ubuntu", "CentOS", "Nginx", "Apache", "CI/CD", "DevOps",

  // Data Science, AI/ML
  "Machine Learning", "Deep Learning", "AI", "Artificial Intelligence", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Keras", "Data Science", "Data Analytics", "Hadoop", "Spark", "Kafka",

  // Mobile Development
  "React Native", "Flutter", "iOS", "Android", "Xamarin", "Ionic",

  // Version Control & Tools
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Trello", "Agile", "Scrum", "Confluence", "Figma", "Postman",

  // Security & Testing
  "Cybersecurity", "Penetration Testing", "Jest", "Mocha", "Cypress", "Selenium", "JUnit", "PyTest"
];

// Ensure no duplicates and all lowercased for easier matching
const uniqueSkills = [...new Set(techSkills.map(skill => skill.toLowerCase()))];

module.exports = { techSkills, uniqueSkills };
