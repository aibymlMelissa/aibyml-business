import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ArrowRight,
  Users,
  Target,
  Zap,
  Brain,
  BarChart3,
  Clock,
  CheckCircle2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronDown,
} from 'lucide-react';
import AIChatBot from './AIChatBot';
import ServiceRequestForm from './ServiceRequestForm';

interface LandingProps {
  onNavigateToSubscription: () => void;
}

const Landing: React.FC<LandingProps> = ({ onNavigateToSubscription }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCustomerServiceChatOpen, setIsCustomerServiceChatOpen] = useState(false);
  const [isServiceRequestOpen, setIsServiceRequestOpen] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed right-8 bottom-8 z-50 hidden lg:flex flex-col items-center space-y-2"
      >
        <span
          className="text-xs text-gray-400 tracking-widest"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          SCROLL DOWN
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </motion.div>

      {/* Hero Section with Wave Background */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-800 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-900/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl"></div>

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-20 px-4 sm:px-6 lg:px-8 py-6"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-20 h-20 md:w-24 md:h-24">
                  <img src="/AIbyML_Logo.png?v=6" alt="AIbyML Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex flex-col space-y-1">
                  <a
                    href="https://www.aibyml.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm md:text-base font-semibold text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    AIbyML.com
                  </a>
                  <h2 className="text-xl md:text-2xl font-bold text-white">AI Service Platform</h2>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex space-x-8 text-white"
            >
              <a href="#features" className="hover:text-blue-200 transition-colors">
                AI Service Types
              </a>
              <a href="#how-it-works" className="hover:text-blue-200 transition-colors">
                How It Works
              </a>
              <a href="#about" className="hover:text-blue-200 transition-colors">
                About
              </a>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src="/chaticon_2.JPG"
                alt="Chat"
                className="w-16 h-16 object-contain"
              />
              <span className="text-blue-600 font-semibold">Let's Chat</span>
            </motion.button>
          </div>
        </motion.nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-white"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <h3 className="text-blue-200 text-xl md:text-2xl font-bold tracking-wide uppercase">
                  - What we do
                </h3>
              </motion.div>

              {/* Two Service Options */}
              <div className="space-y-8">
                {/* First Choice */}
                <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                    Customized AI Services
                  </h3>
                  <h4 className="text-base md:text-lg text-blue-100 leading-relaxed mb-4 font-normal">
                    Deploy AI as your intelligent workforce. Manage intelligence, not just tasks.
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection('contact')}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                {/* Second Choice */}
                <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 leading-tight">
                    AI-Powered Customer Services
                  </h3>
                  <h4 className="text-base md:text-lg text-blue-100 leading-relaxed mb-4 font-normal">
                    Instant classification, smart routing, quick response and real-time tracking in one platform.
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsServiceRequestOpen(true)}
                    className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2"
                  >
                    <span>Submit Request</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Video Container */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="aspect-video rounded-2xl relative overflow-hidden bg-black mb-6">
                  {/* Video Player */}
                  <video
                    className="w-full h-full object-cover rounded-2xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                  >
                    <source src="/Human&AI.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Video Caption */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-white/90 leading-relaxed"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">AI & Human Evolution:</h3>
                  <p className="text-sm text-blue-100">
                    From <strong>passive assistant</strong> today to <strong>active manager</strong> in 2-3 years.
                    Future AI will <strong>co-create</strong> with humans, solving challenges like
                    <em> cancer</em>, <em>space exploration</em>, and enriching lives through robotics.
                  </p>
                </motion.div>
              </div>

              {/* Floating decorative element */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-full shadow-2xl flex items-center justify-center"
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 100C240 150 480 50 720 100C960 150 1200 50 1440 100V200H0V100Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Overview Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">AI Intelligence</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Advanced AI works in agentic, memory allocation, cognitive and character performance with high accuracy.
              </p>
              <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                Business Areas
              </button>
            </motion.div>

            {/* Audience Card */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Multi-Modal & Channel</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Serves include image generation, speech2text, text2speech, text generation, across multiple channels: voice, chat, or form.
              </p>
              <button className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300">
                User Interface
              </button>
            </motion.div>

            {/* Competitors Card - Featured */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10, boxShadow: '0 30px 60px rgba(59, 130, 246, 0.3)' }}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 shadow-xl text-white transition-all duration-300 md:col-span-2 lg:col-span-1"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Updates</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                Dashboard-powered instant notifications keep everyone informed of service performance and status changes as they happen in real-time.
              </p>
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-xl transition-all duration-300">
                Demo
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section with Wave Background */}
      <section id="how-it-works" className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
        {/* Top Wave */}
        <div className="absolute top-0 left-0 right-0 transform -translate-y-full">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 50C240 0 480 100 720 50C960 0 1200 100 1440 50V100H0V50Z"
              fill="rgb(239 246 255)"
            />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl font-semibold text-gray-800 max-w-2xl mx-auto">
              From enquiry to AI service delivery in four simple steps
            </p>
          </motion.div>

          {/* First Branch */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {[
              {
                number: '01',
                icon: MessageSquare,
                title: 'Initial Enquiry',
                description: 'Submit your AI service requirements through our intuitive interface or consultation.',
              },
              {
                number: '02',
                icon: Brain,
                title: 'Needs Analysis',
                description: 'Our AI experts analyze your requirements and develop "Proof of Concept" prototype.',
              },
              {
                number: '03',
                icon: Target,
                title: 'Service Configuration',
                description: 'Customize the prototype to product service qualify AI services tailored to your specific business needs.',
              },
              {
                number: '04',
                icon: CheckCircle2,
                title: 'Delivery & Deployment',
                description: 'Receive your AI services ready for testing, refinement, integration and service launch.',
              },
            ].map((step, index) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-7xl font-bold text-blue-600/10 mb-4">{step.number}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Middle Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center my-16"
          >
            <p className="text-xl font-semibold text-gray-800">
              From request to solution in four simple steps
            </p>
          </motion.div>

          {/* Second Branch */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                number: '01',
                icon: MessageSquare,
                title: 'Submit Request',
                description: 'Use our AI chatbot or form to describe your service needs naturally.',
              },
              {
                number: '02',
                icon: Brain,
                title: 'AI Classification',
                description: 'Our AI engine analyzes and categorizes with intelligent priority.',
              },
              {
                number: '03',
                icon: Target,
                title: 'Smart Routing',
                description: 'Automatically routes to the most qualified team member.',
              },
              {
                number: '04',
                icon: CheckCircle2,
                title: 'Track & Complete',
                description: 'Monitor progress in real-time with instant updates.',
              },
            ].map((step, index) => (
              <motion.div key={step.number} variants={fadeInUp} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-7xl font-bold text-blue-600/10 mb-4">{step.number}</div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '15K+', label: 'Requests Processed', icon: BarChart3 },
              { value: '98%', label: 'Satisfaction Rate', icon: Users },
              { value: '2 min', label: 'Response Time', icon: Clock },
              { value: '5K+', label: 'Active Users', icon: Target },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
              >
                <stat.icon className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-700 via-blue-600 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied users who streamlined their service with AI
          </p>

          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToSubscription}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 inline-flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Sign up Free Subscription</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 50C240 100 480 0 720 50C960 100 1200 0 1440 50V100H0V50Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Talk to Us Directly
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and our team will get in touch with you shortly
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="Your Company"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Interest *
                </label>
                <select
                  id="service"
                  name="service"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                >
                  <option value="">Select a service...</option>
                  <option value="build-private-ai">Build Private AI</option>
                  <option value="consultation">General Consultation</option>
                  <option value="maintain-ai">Maintain AI Services</option>
                  <option value="managing-intelligence">Managing Intelligence Services</option>
                  <option value="standard-customized">Standard or Customized AI Services</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Tell us about your project or requirements..."
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  required
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="privacy" className="text-sm text-gray-600">
                  I agree to the privacy policy and terms of service *
                </label>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send Message</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              {/* Branding section removed */}
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    AI Service Types
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                    How to Subscribe
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-500">
              © 2025 AIbyML AI Service Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 z-40 group overflow-hidden"
        aria-label="Open AI Chat Assistant"
      >
        <img
          src="/chaticon_1.JPG"
          alt="Chat with us"
          className="w-full h-full object-cover"
        />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
      </motion.button>

      {/* Mary - AI Service Assistant (General inquiries) */}
      <AIChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        mode="general"
      />

      {/* John - AI Customer Service Manager (For subscribers) */}
      <AIChatBot
        isOpen={isCustomerServiceChatOpen}
        onClose={() => setIsCustomerServiceChatOpen(false)}
        mode="customer-service"
      />

      {/* Service Request Form */}
      <ServiceRequestForm
        isOpen={isServiceRequestOpen}
        onClose={() => setIsServiceRequestOpen(false)}
        onOpenChat={() => {
          setIsServiceRequestOpen(false);
          setIsCustomerServiceChatOpen(true);
        }}
      />
    </div>
  );
};

export default Landing;
