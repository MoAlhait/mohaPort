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
  activities: []
}; 