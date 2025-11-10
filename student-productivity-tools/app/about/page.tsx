'use client'

import { ArrowLeft, Mail, Linkedin, Github, MapPin, Calendar, BookOpen, Target, Users, Award } from 'lucide-react'
import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold gradient-text">About</h1>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-6xl">👨‍💻</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Mohammad Alhait</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cognitive Science Student at UC Berkeley | Aspiring Product Manager | Passionate about building tools that help students succeed
          </p>
        </div>

        {/* Personal Story */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">My Story</h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              As a Cognitive Science student at UC Berkeley, I've experienced firsthand the challenges that college students face when it comes to time management and productivity. Like many of my peers, I struggled with procrastination, overwhelming workloads, and the constant battle to stay focused in our increasingly distracted world.
            </p>
            <p className="text-gray-600 mb-6">
              This personal struggle led me to dive deep into research on productivity, time management, and the psychology of learning. I spent countless hours studying different methodologies, testing various tools, and analyzing what actually works for students in real-world scenarios.
            </p>
            <p className="text-gray-600 mb-6">
              The result is this comprehensive platform - a collection of evidence-based strategies, interactive tools, and practical resources designed specifically for college students. Every feature, every article, and every tool has been carefully crafted based on scientific research and real student needs.
            </p>
            <p className="text-gray-600">
              My goal is simple: to help students overcome the productivity challenges that hold them back from achieving their full potential. Whether you're struggling with procrastination, need help organizing your study schedule, or want to build better learning habits, this platform is designed to support your journey toward academic success.
            </p>
          </div>
        </div>

        {/* Education & Background */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Education</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Bachelor of Arts in Cognitive Science</h4>
                  <p className="text-gray-600">University of California, Berkeley</p>
                  <p className="text-sm text-gray-500">Expected Graduation: 2028</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">High School Diploma</h4>
                  <p className="text-gray-600">Cupertino High School</p>
                  <p className="text-sm text-gray-500">Graduated: 2024</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Career Goals</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Product Manager</h4>
                  <p className="text-gray-600">Building user-centered digital products</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Educational Technology</h4>
                  <p className="text-gray-600">Creating tools that enhance learning</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Student Advocate</h4>
                  <p className="text-gray-600">Supporting student success and wellbeing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Expertise */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Skills & Expertise</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-blue-600">Product Management</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• User Research & Analytics</li>
                <li>• Product Strategy & Roadmapping</li>
                <li>• Design Thinking & UX</li>
                <li>• Data Analysis & Insights</li>
                <li>• Agile Development</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-green-600">Technical Skills</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Web Development (Next.js, React)</li>
                <li>• Data Analysis (Python, R)</li>
                <li>• Design Tools (Figma, Adobe)</li>
                <li>• Project Management Tools</li>
                <li>• Research & Analytics</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-4 text-purple-600">Soft Skills</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Communication & Presentation</li>
                <li>• Problem Solving</li>
                <li>• Leadership & Teamwork</li>
                <li>• Critical Thinking</li>
                <li>• Adaptability</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Mission</h3>
            <p className="text-blue-100 leading-relaxed">
              To empower college students with evidence-based productivity tools and strategies that help them overcome procrastination, improve time management, and achieve their academic goals while maintaining mental health and work-life balance.
            </p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Vision</h3>
            <p className="text-green-100 leading-relaxed">
              A world where every student has access to personalized, research-backed productivity solutions that enable them to learn more effectively, stress less, and reach their full potential in both academic and personal pursuits.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <h3 className="text-2xl font-bold mb-8 text-center">Get In Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Email</h4>
                  <p className="text-gray-600">mo.alhait@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Linkedin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">LinkedIn</h4>
                  <a href="https://linkedin.com/in/mohammad-alhait-8719a0266" className="text-blue-600 hover:text-blue-700">
                    linkedin.com/in/mohammad-alhait-8719a0266
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <Github className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">GitHub</h4>
                  <p className="text-gray-600">Coming Soon</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Location</h4>
                  <p className="text-gray-600">Cupertino, CA</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Availability</h4>
                  <p className="text-gray-600">Open to opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Let's Connect!</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            I'm always interested in connecting with fellow students, educators, and professionals who share a passion for productivity, education, and student success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:mo.alhait@gmail.com"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            >
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </a>
            <a
              href="https://linkedin.com/in/mohammad-alhait-8719a0266"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-500 transition-colors font-semibold"
            >
              <Linkedin className="w-5 h-5" />
              <span>Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
