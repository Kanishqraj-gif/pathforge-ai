export const ROADMAPS = {
  dataScience: [
    {
      id: "ds-foundation",
      title: "Data Science Foundation",
      type: "phase",
      description:
        "Build the mathematical, programming and analytical foundation required for data science.",
      children: [
        {
          id: "python-data",
          title: "Python for Data Science",
          type: "skill",
          description:
            "Use Python effectively for data analysis and machine learning.",
          skills: [
            "Python syntax",
            "Functions",
            "Lists and dictionaries",
            "Object-oriented programming",
            "NumPy basics",
          ],
          actions: [
            "Solve 15 Python programming problems",
            "Build a small data analysis script",
            "Practice NumPy array operations",
          ],
        },
        {
          id: "statistics",
          title: "Statistics",
          type: "skill",
          description:
            "Understand the statistical concepts required to analyze data.",
          skills: [
            "Mean, median and mode",
            "Variance and standard deviation",
            "Probability",
            "Distributions",
            "Hypothesis testing",
          ],
          actions: [
            "Analyze a real-world dataset statistically",
            "Calculate descriptive statistics",
            "Perform a basic hypothesis test",
          ],
        },
        {
          id: "sql",
          title: "SQL & Data Querying",
          type: "skill",
          description:
            "Learn to retrieve, transform and analyze structured data.",
          skills: [
            "SELECT",
            "WHERE",
            "JOIN",
            "GROUP BY",
            "Subqueries",
          ],
          actions: [
            "Solve 20 SQL problems",
            "Create a relational database",
            "Analyze a public dataset using SQL",
          ],
        },
      ],
    },

    {
      id: "ds-data",
      title: "Data Analysis",
      type: "phase",
      description:
        "Turn raw datasets into useful insights and visualizations.",
      children: [
        {
          id: "pandas",
          title: "Pandas",
          type: "skill",
          description:
            "Manipulate, clean and analyze real-world datasets.",
          skills: [
            "DataFrames",
            "Filtering",
            "Grouping",
            "Merging",
            "Missing data",
          ],
          actions: [
            "Clean a messy public dataset",
            "Perform exploratory data analysis",
            "Create a reusable data-cleaning notebook",
          ],
        },
        {
          id: "visualization",
          title: "Data Visualization",
          type: "skill",
          description:
            "Communicate patterns and insights through effective visualizations.",
          skills: [
            "Matplotlib",
            "Seaborn",
            "Charts",
            "Dashboards",
            "Data storytelling",
          ],
          actions: [
            "Create a five-chart data story",
            "Build an interactive dashboard",
            "Explain three insights from a dataset",
          ],
        },
      ],
    },

    {
      id: "ds-ml",
      title: "Machine Learning",
      type: "phase",
      description:
        "Build, evaluate and improve predictive machine learning models.",
      children: [
        {
          id: "ml-foundations",
          title: "Machine Learning Fundamentals",
          type: "skill",
          description:
            "Understand the core concepts behind supervised and unsupervised learning.",
          skills: [
            "Supervised learning",
            "Unsupervised learning",
            "Training and testing",
            "Features and labels",
            "Overfitting",
          ],
          actions: [
            "Train your first classification model",
            "Compare two machine learning algorithms",
            "Explain overfitting with an example",
          ],
        },
        {
          id: "scikit-learn",
          title: "Scikit-learn",
          type: "skill",
          description:
            "Implement practical machine learning workflows in Python.",
          skills: [
            "Preprocessing",
            "Classification",
            "Regression",
            "Pipelines",
            "Cross-validation",
          ],
          actions: [
            "Build an end-to-end ML pipeline",
            "Compare multiple models",
            "Evaluate your model using appropriate metrics",
          ],
        },
        {
          id: "ml-project",
          title: "Machine Learning Project",
          type: "project",
          description:
            "Build a complete machine learning project for your portfolio.",
          skills: [
            "Problem definition",
            "Data collection",
            "EDA",
            "Model training",
            "Evaluation",
          ],
          actions: [
            "Choose a real-world prediction problem",
            "Build and evaluate multiple models",
            "Publish the project on GitHub",
          ],
        },
      ],
    },

    {
      id: "ds-career",
      title: "Data Science Career Launch",
      type: "phase",
      description:
        "Turn your technical skills into interview and job readiness.",
      children: [
        {
          id: "ds-interview",
          title: "Data Science Interviews",
          type: "skill",
          description:
            "Prepare for technical and analytical data science interviews.",
          skills: [
            "Statistics questions",
            "SQL questions",
            "ML questions",
            "Python questions",
            "Case studies",
          ],
          actions: [
            "Solve 30 data science interview questions",
            "Complete two mock interviews",
            "Practice explaining one ML project end-to-end",
          ],
        },
        {
          id: "ds-job-ready",
          title: "Data Scientist Job Ready",
          type: "milestone",
          description:
            "Prepare your professional profile and start applying.",
          skills: [
            "Resume",
            "LinkedIn",
            "GitHub",
            "Portfolio",
            "Applications",
          ],
          actions: [
            "Create a one-page data science resume",
            "Optimize your LinkedIn profile",
            "Prepare targeted applications",
          ],
        },
      ],
    },
  ],

  fullStack: [
    {
      id: "fs-foundation",
      title: "Web Development Foundation",
      type: "phase",
      description:
        "Build the core technologies required for modern web development.",
      children: [
        {
          id: "html-css",
          title: "HTML & CSS",
          type: "skill",
          description:
            "Build responsive and accessible web interfaces.",
          skills: [
            "Semantic HTML",
            "CSS",
            "Flexbox",
            "Grid",
            "Responsive design",
          ],
          actions: [
            "Recreate a modern landing page",
            "Build a responsive portfolio",
            "Make the interface mobile friendly",
          ],
        },
        {
          id: "javascript",
          title: "JavaScript",
          type: "skill",
          description:
            "Master the programming language behind modern web applications.",
          skills: [
            "ES6+",
            "DOM",
            "Async JavaScript",
            "APIs",
            "Modules",
          ],
          actions: [
            "Build a weather application",
            "Consume a public REST API",
            "Create an interactive dashboard",
          ],
        },
      ],
    },

    {
      id: "fs-frontend",
      title: "Frontend Engineering",
      type: "phase",
      description:
        "Develop scalable interactive applications using modern frontend technologies.",
      children: [
        {
          id: "react",
          title: "React",
          type: "skill",
          description:
            "Develop component-based frontend applications.",
          skills: [
            "Components",
            "Props",
            "State",
            "Hooks",
            "Routing",
          ],
          actions: [
            "Build a React dashboard",
            "Create reusable components",
            "Build a multi-page React application",
          ],
        },
        {
          id: "state-management",
          title: "State Management",
          type: "skill",
          description:
            "Manage complex application state effectively.",
          skills: [
            "useState",
            "useReducer",
            "Context API",
            "Zustand",
            "Redux",
          ],
          actions: [
            "Build a shopping cart",
            "Persist application state",
            "Compare Context API with Zustand",
          ],
        },
      ],
    },

    {
      id: "fs-backend",
      title: "Backend Engineering",
      type: "phase",
      description:
        "Build APIs, authentication systems and server-side applications.",
      children: [
        {
          id: "node",
          title: "Node.js & Express",
          type: "skill",
          description:
            "Build backend services using JavaScript.",
          skills: [
            "Node.js",
            "Express",
            "REST APIs",
            "Middleware",
            "Authentication",
          ],
          actions: [
            "Build a REST API",
            "Create authentication endpoints",
            "Connect your API to a frontend",
          ],
        },
        {
          id: "database",
          title: "Databases",
          type: "skill",
          description:
            "Store and retrieve application data efficiently.",
          skills: [
            "SQL",
            "MongoDB",
            "Data modeling",
            "CRUD",
            "Indexes",
          ],
          actions: [
            "Design a database schema",
            "Build CRUD endpoints",
            "Connect a database to your application",
          ],
        },
      ],
    },

    {
      id: "fs-career",
      title: "Full Stack Career Launch",
      type: "phase",
      description:
        "Build portfolio projects and prepare for software engineering interviews.",
      children: [
        {
          id: "fullstack-project",
          title: "Full Stack Project",
          type: "project",
          description:
            "Build and deploy a complete full-stack application.",
          skills: [
            "Frontend",
            "Backend",
            "Database",
            "Authentication",
            "Deployment",
          ],
          actions: [
            "Define a real-world problem",
            "Design the application architecture",
            "Build and deploy the application",
            "Document it on GitHub",
          ],
        },
        {
          id: "software-interview",
          title: "Software Engineering Interviews",
          type: "skill",
          description:
            "Prepare for technical software engineering interviews.",
          skills: [
            "DSA",
            "JavaScript",
            "React",
            "Backend",
            "Behavioral interviews",
          ],
          actions: [
            "Solve 30 DSA problems",
            "Complete two mock interviews",
            "Prepare STAR-format behavioral answers",
          ],
        },
      ],
    },
  ],

  uiux: [
    {
      id: "ux-foundation",
      title: "Design Foundation",
      type: "phase",
      description:
        "Build the fundamental principles required for digital product design.",
      children: [
        {
          id: "design-principles",
          title: "Design Principles",
          type: "skill",
          description:
            "Understand visual hierarchy, spacing, typography and composition.",
          skills: [
            "Visual hierarchy",
            "Typography",
            "Color",
            "Spacing",
            "Composition",
          ],
          actions: [
            "Analyze five existing interfaces",
            "Recreate one interface from scratch",
            "Create a visual design system",
          ],
        },
        {
          id: "ux-research",
          title: "UX Research",
          type: "skill",
          description:
            "Understand users and identify real product problems.",
          skills: [
            "User interviews",
            "Personas",
            "User journeys",
            "Usability testing",
            "Research synthesis",
          ],
          actions: [
            "Interview five potential users",
            "Create two user personas",
            "Conduct a usability test",
          ],
        },
      ],
    },

    {
      id: "ux-design",
      title: "Product Design",
      type: "phase",
      description:
        "Turn research insights into practical product experiences.",
      children: [
        {
          id: "wireframing",
          title: "Wireframing",
          type: "skill",
          description:
            "Create low and high fidelity interface structures.",
          skills: [
            "User flows",
            "Low-fidelity wireframes",
            "High-fidelity designs",
            "Responsive layouts",
          ],
          actions: [
            "Design a complete user flow",
            "Create mobile wireframes",
            "Convert wireframes into high-fidelity screens",
          ],
        },
        {
          id: "figma",
          title: "Figma",
          type: "skill",
          description:
            "Use Figma to create professional product designs.",
          skills: [
            "Components",
            "Auto Layout",
            "Variants",
            "Prototyping",
            "Design systems",
          ],
          actions: [
            "Build a reusable component library",
            "Create an interactive prototype",
            "Design a complete mobile application",
          ],
        },
      ],
    },

    {
      id: "ux-portfolio",
      title: "Design Portfolio",
      type: "phase",
      description:
        "Convert your design work into strong case studies.",
      children: [
        {
          id: "case-study",
          title: "UX Case Study",
          type: "project",
          description:
            "Document the complete design process from problem to solution.",
          skills: [
            "Problem definition",
            "Research",
            "Ideation",
            "Design",
            "Testing",
          ],
          actions: [
            "Choose a real product problem",
            "Document your research",
            "Create and test your design",
            "Publish the case study",
          ],
        },
        {
          id: "design-career",
          title: "UI/UX Career Launch",
          type: "milestone",
          description:
            "Prepare your portfolio and begin applying for design roles.",
          skills: [
            "Portfolio",
            "Resume",
            "LinkedIn",
            "Case studies",
            "Applications",
          ],
          actions: [
            "Select your three strongest case studies",
            "Create a portfolio website",
            "Prepare targeted applications",
          ],
        },
      ],
    },
  ],
};