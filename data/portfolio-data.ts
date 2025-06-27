export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    location: string;
    graduationYear: string;
    about: string;
    hobby: string;
  };
  social: {
    linkedin: string;
  };
  skills: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    tech: string[];
    image: string;
    link: string;
    github: string;
  }>;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  activities: Array<{
    title: string;
    organization: string;
    duration: string;
    description: string;
    type: string;
  }>;
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Mohammad Alhait",
    title: "Cognitive Science Student | Aspiring Product Manager",
    email: "mo.alhait@gmail.com",
    location: "Cupertino, CA",
    graduationYear: "2028",
    about: "I'm a passionate Cognitive Science student at UC Berkeley with a unique blend of research experience, community leadership, and creative skills. My journey began when my brother's brain injury inspired me to study cognitive rehabilitation, leading to experiments on memory and multitasking that showed 40% improvement in memory accuracy. I've combined my love for photography, community service, and cognitive research to create meaningful experiences that help people.",
    hobby: "Photography"
  },
  social: {
    linkedin: "https://www.linkedin.com/in/mohammad-alhait-8719a0266"
  },
  skills: [
    {
      name: "Cognitive Research",
      description: "Memory studies, multitasking experiments, data analysis, experimental design, cognitive rehabilitation",
      icon: "BarChart3"
    },
    {
      name: "Product Strategy",
      description: "User research, market analysis, feature prioritization, user experience design, community needs assessment",
      icon: "Target"
    },
    {
      name: "Leadership & Community",
      description: "Team coordination, event planning, fundraising, mentorship, community organizing",
      icon: "Lightbulb"
    },
    {
      name: "Technical Skills",
      description: "React, JavaScript, web development, data visualization, experimental platforms",
      icon: "Database"
    },
    {
      name: "Communication",
      description: "Public speaking, debate, presentation skills, cross-cultural communication, teaching",
      icon: "MessageCircle"
    },
    {
      name: "Creative Expression",
      description: "Photography, visual storytelling, design thinking, artistic problem-solving",
      icon: "Palette"
    }
  ],
  projects: [
    {
      title: "Cognitive Science Experiments",
      description: "Designed experiments including a 2D maze game and verbal recall task to study memory and multitasking. Findings showed multitasking reduced memory accuracy by 40% and increased reaction time by 30%. The project became a tool to help my brother improve his focus and rebuild his memory after his brain injury.",
      tech: ["Experimental Design", "Data Analysis", "Memory Research", "Cognitive Rehabilitation"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
      link: "https://t.ly/CZPmG",
      github: "#"
    },
    {
      title: "Navegation.us - Vegan Navigation Platform",
      description: "Led a team at a hackathon to create a navigation experience for vegan dining options. Built a database of restaurants and stores with filters for dietary needs and reviews. Coordinated tasks, designed a sleek interface, and earned praise for addressing a niche market while demonstrating strong leadership and teamwork.",
      tech: ["Web Development", "Team Leadership", "UX Design", "Database Design"],
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop",
      link: "#",
      github: "#"
    },
    {
      title: "Golden Hour SF - Photography Location Finder",
      description: "Founded a website that helps photographers find ideal locations in San Francisco during optimal lighting. Integrated weather data, lighting conditions, and crowd metrics to enhance user experience. Created an easy-to-use interface to help users find great locations and take beautiful photos with ease.",
      tech: ["Web Development", "API Integration", "Photography", "User Experience"],
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
      link: "#",
      github: "#"
    },
    {
      title: "Chromatic Perception Study",
      description: "Developed a Color Circle Experiment on Glitch to study lighting's impact on color perception. Participants selected colored circles from a grid under shifting lighting conditions. Data from 30 participants showed lighting inconsistencies reduced accuracy by 15%. Designed using JavaScript and handled analysis.",
      tech: ["JavaScript", "Experimental Design", "Data Analysis", "Color Perception"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=300&fit=crop",
      link: "#",
      github: "#"
    }
  ],
  experience: [
    {
      title: "Barista Contractor",
      company: "Fez Coffee Co.",
      duration: "Apr 2024 - Present",
      description: [
        "Crafted a variety of espresso-based beverages for high-end events like weddings and corporate gatherings",
        "Assisted in setting up and managing mobile coffee carts at special events",
        "Honed skills in customer service, time management, and adaptability in fast-paced environments",
        "Specialized in latte art and maintaining quality standards under pressure"
      ]
    },
    {
      title: "Bobarista",
      company: "Cafe LaTTea",
      duration: "Nov 2023 - Present",
      description: [
        "Crafted high-quality boba tea and lattes with stunning latte art designs",
        "Maintained a clean, welcoming environment while managing orders efficiently",
        "Served in a fast-paced environment, ensuring customer satisfaction",
        "Specialized in intricate latte art and customization to meet customer preferences"
      ]
    },
    {
      title: "Individual Academic Tutor",
      company: "Freelance",
      duration: "2022 - Present",
      description: [
        "Provided one-on-one tutoring in science and English, driven by a desire to help peers succeed",
        "Tailored lessons to each student's learning style and pace",
        "Created personalized study plans to improve grades and build confidence",
        "Fostered academic growth and problem-solving skills while honing teaching abilities"
      ]
    }
  ],
  activities: [
    {
      title: "Cognitive Neuroscience Audit",
      organization: "UC Berkeley",
      duration: "2024",
      description: "Audited Cognitive Neuroscience (PSYCH C127) under Professor Richard Ivry, studying memory, attention, and perception using fMRI, EEG, and TMS research. Would have earned 93% if enrolled for credit, deepening my passion for cognitive science.",
      type: "Academic"
    },
    {
      title: "Community Fundraiser for Palestinian Relief",
      organization: "Student-Led Initiative",
      duration: "2024",
      description: "Organized a fundraiser with peers to support Palestinian families in need. Managed logistics, secured venue, promoted via social media, and coordinated food, music, and art showcases. Surpassed $5,000 goal by raising $7,300.",
      type: "Leadership"
    },
    {
      title: "Future Programmers Initiative Workshop",
      organization: "Mosque Community",
      duration: "2024",
      description: "Organized a programming seminar for students aged 7-13, introducing 13 participants to Scratch programming and beginner-friendly Python. Managed logistics and created engaging lessons. Planning follow-up seminar due to success.",
      type: "Teaching"
    },
    {
      title: "School Photographer",
      organization: "ASB Leadership",
      duration: "2021-2024",
      description: "Served as lead photographer for ASB, capturing school events like rallies, sports games, and activities. Edited and distributed high-quality visuals for yearbooks and social media. Participated in ASB leadership sessions.",
      type: "Creative"
    },
    {
      title: "Speech and Debate Team",
      organization: "High School",
      duration: "2021-2024",
      description: "Competed in Original Oratory, Impromptu Speaking, and Policy Debate. Developed skills in public speaking, argumentation, and research. Mentored teammates and organized practices, with opportunity to compete at regionals.",
      type: "Leadership"
    },
    {
      title: "Boy Scouts Lead",
      organization: "Troop 399",
      duration: "2019-2024",
      description: "Started as regular scout and became a lead, guiding younger scouts. Organized engaging camping activities, taught skills like fire-building and navigation, and mentored scouts to build confidence and develop essential skills.",
      type: "Leadership"
    },
    {
      title: "De Anza Run Club Founder",
      organization: "Student Initiative",
      duration: "2023-2024",
      description: "Started a Sunday morning run club at De Anza College, expanding from Cupertino to scenic Bay Area locations. Organized weekly routes, motivated members, and fostered a supportive environment promoting fitness and camaraderie.",
      type: "Leadership"
    },
    {
      title: "People's Programs Volunteer",
      organization: "Community Service",
      duration: "2021-2024",
      description: "Distributed free groceries and essential items to underserved families. Helped organize community workshops on social justice, facilitated donation drives, and assisted with weekly meal preparation and distribution.",
      type: "CommunityService"
    },
    {
      title: "Feed The Block - San Jose",
      organization: "Community Service",
      duration: "2021-2024",
      description: "Prepared and packaged balanced meals for unhoused individuals, starting at 7 AM every Saturday. Collaborated with volunteers to assemble and hand out meals at shelters, city hall, and havens. Helped clean up and ensure smooth operations.",
      type: "CommunityService"
    },
    {
      title: "Cupertino Chess Club Mentor",
      organization: "Bay Area Chess",
      duration: "2021-2024",
      description: "Progressed from participant to mentoring kids ages 8-16, teaching openings, tactics, and endgame principles. Organized mini-tournaments, tailored lessons to skill levels, and fostered teamwork, problem-solving, and confidence.",
      type: "Teaching"
    }
  ]
}; 