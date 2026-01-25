export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    address?: string;
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
    title: "Junior Transfer Cognitive Science Major | UC Berkeley | Graduating 2028",
    email: "mo.alhait@gmail.com",
    phone: "(669) 256-6809",
    address: "10108 Bret Ave., Cupertino, CA 95014",
    location: "Cupertino, CA",
    graduationYear: "2028",
    about: "I'm a Cognitive Science major at UC Berkeley (graduating 2028) with hands-on experience in AI-powered product development, self-led cognition research, and full-stack web development. I've built rapid prototypes and full-featured apps using Cursor, run independent experiments on memory and stimuli—including finding that instrumental music improved recall accuracy by 26% vs. lyrical music, and building a React-based gamified memory app that gathered data from 50+ participants showing 40% faster completion with fewer errors. I combine research design, user validation, and product thinking with a strong foundation in communication, teamwork, and agile practices.",
    hobby: "Photography"
  },
  social: {
    linkedin: "https://www.linkedin.com/in/mohammad-alhait-8719a0266"
  },
  skills: [
    {
      name: "AI-Powered Development",
      description: "Rapid prototyping with Cursor, AI tool integration, product workflow optimization, understanding user adoption of new technologies",
      icon: "Code"
    },
    {
      name: "Cognitive Research",
      description: "Self-led experimental design, memory studies, data analysis, user validation, React-based research platforms, statistical analysis",
      icon: "BarChart3"
    },
    {
      name: "Product Strategy",
      description: "User feedback gathering, rapid prototyping, agile methodology, project coordination, translating research insights into product experiences",
      icon: "Target"
    },
    {
      name: "Full-Stack Development",
      description: "React, Next.js, JavaScript, responsive web design, interactive project showcases, portfolio development",
      icon: "Database"
    },
    {
      name: "Communication & Teamwork",
      description: "Problem-solving, collaboration, organization, time management, client consultation, cross-functional coordination",
      icon: "MessageCircle"
    },
    {
      name: "Creative Expression",
      description: "Photography (TED events, sports, HS athletics), creative direction, brand consultation, logo design, visual storytelling",
      icon: "Palette"
    }
  ],
  projects: [
    {
      title: "Self-Led Cognition Research",
      description: "Designed and executed two independent research experiments exploring how stimuli impact memory. Experiment 1: studied the effect of auditory input on memory retention—instrumental music improved recall accuracy by 26% vs. lyrical music. Experiment 2: built a React-based interactive web app with gamified memory challenges, gathered user data from 50+ online participants, and found that engagement time directly correlated with task performance (≈40% faster completion, fewer errors). Combined research design, full-stack development, and real-world user validation.",
      tech: ["React", "Research Design", "Data Analysis", "User Validation"],
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop",
      link: "https://experiments.mohammad-alhait.com",
      github: "https://github.com/MoAlhait/cognitive-experiments"
    },
    {
      title: "AI-Powered Tool Development (Cursor)",
      description: "Built rapid prototypes and full-featured applications by leveraging AI capabilities in Cursor. Learned best practices for integrating AI tools into product workflows, understanding how users adopt new technologies, and identifying gaps where AI can enhance efficiency. Developed a deeper appreciation for AI as a product accelerator rather than a magic solution.",
      tech: ["Cursor", "AI Integration", "Rapid Prototyping", "Product Workflows"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
      link: "#",
      github: "#"
    },
    {
      title: "Personal Website & Portfolio",
      description: "Designed and built a custom portfolio (mohammad-alhait.com) using React to showcase projects and research in a polished, professional format. Implemented responsive design for optimal experience across devices and created interactive project showcases so visitors can engage with work samples directly. Demonstrates full-stack web development and product thinking around presenting technical work to different audiences.",
      tech: ["React", "Next.js", "Responsive Design", "Product Thinking"],
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop",
      link: "https://mohammad-alhait.com",
      github: "#"
    }
  ],
  experience: [
    {
      title: "Barista Contractor",
      company: "Fez Coffee Roasters",
      duration: "Aug 10, 2024 – Jan 16, 2026",
      description: [
        "Supported high-volume event service (weddings, corporate); setup and breakdown for mobile coffee cart",
        "Produced espresso drinks quickly and consistently in fast-paced environments; maintained quality under pressure"
      ]
    },
    {
      title: "Bobarista / Barista",
      company: "Cafe Lattea",
      duration: "Nov 12, 2023 – Aug 2025",
      description: [
        "Delivered fast, accurate customer service in a high-traffic café; resolved issues on the fly",
        "Improved team coverage by picking up shifts and supporting open/close operations as needed"
      ]
    },
    {
      title: "Barista",
      company: "Peet's Coffee",
      duration: "May 25, 2023 – Jan 14, 2024",
      description: [
        "Served thousands of customers daily while maintaining speed, accuracy, and customer experience",
        "Led bar during rush periods; handled opening/closing and store operations"
      ]
    },
    {
      title: "Photographer",
      company: "Freelance",
      duration: "Ongoing",
      description: [
        "Shot live event content (TED) and sports photography; official photographer for HS athletics",
        "Covered Senior Night event photography for families; delivered polished photo sets"
      ]
    }
  ],
  activities: [
    {
      title: "Volunteer",
      organization: "Feed The Hungry",
      duration: "Ongoing",
      description: "Packaged and distributed meals to unhoused community members during weekend service events.",
      type: "CommunityService"
    },
    {
      title: "Member",
      organization: "Boy Scouts of America",
      duration: "8 years",
      description: "Volunteered with my Boy Scout troop to help the community—picking up trash in parks, preparing food for those in need, and more.",
      type: "CommunityService"
    }
  ]
};
