'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'

interface ProjectCardProps {
  title: string
  description: string
  tech: string[]
  image: string
  link: string
  github: string
  index: number
}

export default function ProjectCard({
  title,
  description,
  tech,
  image,
  link,
  github,
  index
}: ProjectCardProps) {
  return (
    <motion.div
      className="card group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <div className="relative mb-6 overflow-hidden rounded-lg">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-600 transition-colors duration-200">
        {title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {tech.map((techItem) => (
          <span 
            key={techItem} 
            className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full"
          >
            {techItem}
          </span>
        ))}
      </div>
      
      <div className="flex gap-4">
        <a 
          href={link} 
          className="btn-primary text-sm flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          Live Demo
        </a>
        <a 
          href={github} 
          className="btn-secondary text-sm flex items-center gap-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={16} />
          View Code
        </a>
      </div>
    </motion.div>
  )
} 