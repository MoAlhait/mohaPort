'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Download,
  Code,
  Palette,
  Database,
  Globe,
  Smartphone,
  Server,
  BarChart3,
  Target,
  Lightbulb,
  MessageCircle,
  Award,
  Users,
  BookOpen,
  Heart
} from 'lucide-react'
import { portfolioData } from '../data/portfolio-data'
import Image from 'next/image'

// Bounce Wave Animation Component for Name
const BounceWaveName = ({ text }: { text: string }) => {
  return (
    <>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          className="inline-block text-gradient"
          animate={{ 
            y: [0, -12, 0],
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          style={{
            willChange: 'transform'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </>
  )
}

// Section animation variants
const sectionVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const iconMap = {
    Code,
    Server,
    Database,
    Smartphone,
    Palette,
    Globe,
    BarChart3,
    Target,
    Lightbulb,
    MessageCircle
  }

  const activityIconMap = {
    Academic: BookOpen,
    Leadership: Users,
    Teaching: Award,
    Creative: Palette,
    CommunityService: Heart
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-accent-50/30 to-gray-50 dark:from-dark-900 dark:via-accent-900/5 dark:to-dark-800">
      {/* Hero Section */}
      <section className="section-padding pt-32">
        <div className="container-custom">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hi, I&apos;m <BounceWaveName text={portfolioData.personal.name} />
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {portfolioData.personal.title}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/resume.pdf" 
                download
                className="btn-accent flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Download Resume
              </a>
              <button 
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Get In Touch
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gradient-to-br from-white to-accent-50/50 dark:from-dark-800 dark:to-accent-900/10">
        <div className="container-custom">
          {/* About section hover state */}
          {(() => {
            const [aboutHover, setAboutHover] = useState(false);
            return (
              <div
                className="flex flex-col md:flex-row gap-12 items-center md:items-start"
                onMouseEnter={() => setAboutHover(true)}
                onMouseLeave={() => setAboutHover(false)}
              >
                <motion.div
                  className="about-text flex-1"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.15 } }
                  }}
                >
                  <motion.h2
                    className="text-4xl font-bold mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >About Me</motion.h2>
                  <motion.p
                    className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                  >{portfolioData.personal.about}</motion.p>
                  <motion.p
                    className="text-lg text-gray-600 dark:text-gray-300 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                  >
                    When I'm not studying or working, you can find me pursuing my passion for <span className="text-accent-600 dark:text-accent-400 font-medium">{portfolioData.personal.hobby.toLowerCase()}</span>,
                    exploring new technologies, or contributing to my community through volunteer work.
                  </motion.p>
                  <motion.div
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                  >
                    <a href={portfolioData.social.linkedin} className="text-gray-600 dark:text-gray-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors" target="_blank" rel="noopener noreferrer">
                      <Linkedin size={24} />
                    </a>
                  </motion.div>
                </motion.div>
                <div className="flex-1 flex justify-center md:justify-end w-full">
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
                    animate={{ scale: aboutHover ? 1.04 : 1, rotate: aboutHover ? 2 : 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 80, damping: 12, duration: 1 }}
                  >
                    <motion.div
                      className="w-[27.5rem] h-[27.5rem] rounded-full bg-[#77F2A1] flex items-center justify-center"
                      style={{ 
                        boxShadow: aboutHover ? '0 0 48px 16px #77F2A1, 0 0 80px 24px #182534' : '0 0 8px 2px #77F2A1, 0 0 20px 4px #182534',
                        transition: 'box-shadow 0.5s cubic-bezier(0.4,0,0.2,1)'
                      }}
                    >
                      <div className="w-[26.5rem] h-[26.5rem] rounded-full bg-[#182534] p-1 flex items-center justify-center">
                        <motion.img
                          src="/profile.jpg"
                          alt="Mohammad Alhait profile photo"
                          width={400}
                          height={400}
                          className="object-cover w-96 h-96 rounded-full"
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 100 }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Skills Section */}
      <motion.section
        id="skills"
        className="section-padding bg-accent-subtle"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 className="text-4xl font-bold mb-6" variants={cardVariants}>Skills & Expertise</motion.h2>
            <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={cardVariants}>
              I specialize in understanding human behavior and translating insights into meaningful product experiences.
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {portfolioData.skills.map((skill, index) => {
              const IconComponent = iconMap[skill.icon as keyof typeof iconMap]
              return (
                <motion.div
                  key={skill.name}
                  className={`card group hover:scale-105 transition-transform duration-300 ${index % 2 === 0 ? 'card-accent' : ''}`}
                  variants={cardVariants}
                  whileHover={{ scale: 1.06, boxShadow: index % 2 === 0 ? '0 0 24px #10B981' : '0 0 24px #3B82F6' }}
                >
                  <div className="flex items-center mb-4">
                    <IconComponent className={`w-8 h-8 mr-3 ${index % 2 === 0 ? 'text-accent-600' : 'text-primary-600'}`} />
                    <h3 className="text-xl font-semibold">{skill.name}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="section-padding bg-white dark:bg-dark-800"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 className="text-4xl font-bold mb-6" variants={cardVariants}>Featured Projects</motion.h2>
            <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={cardVariants}>
              Here are some of my recent projects that showcase my skills and passion for cognitive science and product management.
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {portfolioData.projects.map((project, index) => (
              <motion.div
                key={project.title}
                className={`card group ${index === 1 ? 'card-accent' : ''}`}
                variants={cardVariants}
                whileHover={{ scale: 1.06, boxShadow: '0 0 24px #3B82F6' }}
              >
                <div className="relative mb-6 overflow-hidden rounded-lg">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-accent-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="px-3 py-1 bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 text-sm rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.link !== "#" && (
                    <motion.a 
                      href={project.link} 
                      className={`text-sm ${index === 1 ? 'btn-accent' : 'btn-primary'}`} 
                      whileHover={{ scale: 1.08, boxShadow: '0 0 16px #3B82F6' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </motion.a>
                  )}
                  {project.github !== "#" && (
                    <motion.a 
                      href={project.github} 
                      className="btn-secondary text-sm" 
                      whileHover={{ scale: 1.08, boxShadow: '0 0 16px #3B82F6' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Code
                    </motion.a>
                  )}
                  {(project.link === "#" && project.github === "#") && (
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                      Demo & code coming soon
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Activities & Achievements Section */}
      <motion.section
        id="activities"
        className="section-padding bg-accent-subtle"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 className="text-4xl font-bold mb-6" variants={cardVariants}>Activities & Achievements</motion.h2>
            <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={cardVariants}>
              My involvement in leadership, community service, and academic pursuits has shaped my passion for making a positive impact.
            </motion.p>
          </motion.div>
          
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {portfolioData.activities.map((activity, index) => {
              const ActivityIcon = activityIconMap[activity.type as keyof typeof activityIconMap] || Award;
              
              // Define color schemes for different activity types
              const getActivityColors = (type: string) => {
                switch (type) {
                  case 'Leadership':
                    return 'border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-800';
                  case 'Academic':
                    return 'border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-dark-800';
                  case 'Teaching':
                    return 'border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-dark-800';
                  case 'Creative':
                    return 'border-l-4 border-pink-500 bg-gradient-to-r from-pink-50 to-white dark:from-pink-900/20 dark:to-dark-800';
                  default:
                    return 'border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-dark-800';
                }
              };
              
              // Define glow colors for different activity types
              const getGlowColor = (type: string) => {
                switch (type) {
                  case 'Leadership':
                    return '0 0 24px #3B82F6'; // Blue glow
                  case 'Academic':
                    return '0 0 24px #10B981'; // Green glow
                  case 'Teaching':
                    return '0 0 24px #8B5CF6'; // Purple glow
                  case 'Creative':
                    return '0 0 24px #EC4899'; // Pink glow
                  default:
                    return '0 0 24px #F97316'; // Orange glow
                }
              };
              
              return (
                <motion.div
                  key={activity.title}
                  className={`card group hover:scale-105 transition-transform duration-300 ${getActivityColors(activity.type)}`}
                  variants={cardVariants}
                  whileHover={{ scale: 1.06, boxShadow: getGlowColor(activity.type) }}
                >
                  <div className="flex items-start mb-4">
                    <ActivityIcon className={`w-6 h-6 mr-3 mt-1 ${
                      activity.type === 'Leadership' ? 'text-blue-600' :
                      activity.type === 'Academic' ? 'text-green-600' :
                      activity.type === 'Teaching' ? 'text-purple-600' :
                      activity.type === 'Creative' ? 'text-pink-600' :
                      'text-orange-600'
                    }`} />
                    <div>
                      <h3 className="text-lg font-semibold">{activity.title}</h3>
                      <p className="text-sm text-accent-600 dark:text-accent-400 font-medium">{activity.organization}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.duration}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{activity.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="section-padding bg-gradient-accent"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container-custom">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.h2 className="text-4xl font-bold mb-6" variants={cardVariants}>Get In Touch</motion.h2>
            <motion.p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={cardVariants}>
              I'm always interested in new opportunities and exciting projects. Let's work together!
            </motion.p>
          </motion.div>
          
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="max-w-2xl mx-auto"
          >
            <motion.div className="card-accent text-center" variants={cardVariants} whileHover={{ scale: 1.04, boxShadow: '0 0 24px #10B981' }}>
              <motion.h3 className="text-2xl font-semibold mb-4" variants={cardVariants}>Let's Start a Conversation</motion.h3>
              <motion.p className="text-gray-600 dark:text-gray-300 mb-8" variants={cardVariants}>
                Whether you have a project in mind or just want to chat about cognitive science and community impact, I'd love to hear from you.
              </motion.p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={`mailto:${portfolioData.personal.email}`} className="btn-accent flex items-center justify-center gap-2">
                  <Mail size={20} />
                  Send Email
                </a>
                <a href={portfolioData.social.linkedin} className="btn-secondary flex items-center justify-center gap-2" target="_blank" rel="noopener noreferrer">
                  <Linkedin size={20} />
                  Connect on LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-dark-900 text-white py-8 border-t border-accent-700">
        <div className="container-custom text-center">
          <p>&copy; 2025 {portfolioData.personal.name}</p>
        </div>
      </footer>
    </div>
  )
} 