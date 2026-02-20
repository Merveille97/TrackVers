
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Code, 
  Terminal, 
  Database, 
  Cloud, 
  Layout, 
  Shield, 
  Server, 
  Smartphone,
  Cpu,
  Globe,
  Box
} from 'lucide-react';

const DocumentationPage = () => {
  // Comprehensive category list for documentation view
  const categories = [
    {
      id: 'languages',
      name: 'Languages',
      description: 'Programming languages including JavaScript, Python, Rust, Go, and more.',
      icon: Code,
      color: 'text-yellow-400',
      bg: 'from-yellow-400/20 to-orange-400/20'
    },
    {
      id: 'frameworks',
      name: 'Frameworks',
      description: 'Web and application frameworks like React, Vue, Angular, Django, and Next.js.',
      icon: Layout,
      color: 'text-cyan-400',
      bg: 'from-cyan-400/20 to-blue-400/20'
    },
    {
      id: 'databases',
      name: 'Databases',
      description: 'SQL and NoSQL database management systems including PostgreSQL, MongoDB, and Redis.',
      icon: Database,
      color: 'text-green-400',
      bg: 'from-green-400/20 to-emerald-400/20'
    },
    {
      id: 'devops',
      name: 'DevOps & Tools',
      description: 'Containerization, CI/CD, and infrastructure tools like Docker, Kubernetes, and Terraform.',
      icon: Terminal,
      color: 'text-purple-400',
      bg: 'from-purple-400/20 to-indigo-400/20'
    },
    {
      id: 'cloud',
      name: 'Cloud Services',
      description: 'Cloud computing platforms and services like AWS, Google Cloud, and Azure.',
      icon: Cloud,
      color: 'text-sky-400',
      bg: 'from-sky-400/20 to-blue-400/20'
    },
    {
      id: 'security',
      name: 'Security',
      description: 'Cybersecurity tools, encryption libraries, and authentication services.',
      icon: Shield,
      color: 'text-red-400',
      bg: 'from-red-400/20 to-rose-400/20'
    },
    {
      id: 'os',
      name: 'Operating Systems',
      description: 'Major OS platforms including Linux distributions, Windows, and macOS.',
      icon: Server,
      color: 'text-slate-400',
      bg: 'from-slate-400/20 to-gray-400/20'
    },
    {
      id: 'mobile',
      name: 'Mobile Development',
      description: 'Tools for iOS and Android development like React Native, Flutter, and Swift.',
      icon: Smartphone,
      color: 'text-pink-400',
      bg: 'from-pink-400/20 to-fuchsia-400/20'
    },
    {
      id: 'browsers',
      name: 'Browsers',
      description: 'Web browsers and engines including Chrome, Firefox, Safari, and Edge.',
      icon: Globe,
      color: 'text-blue-400',
      bg: 'from-blue-400/20 to-cyan-400/20'
    },
    {
      id: 'hardware',
      name: 'Hardware & IoT',
      description: 'Embedded systems, IoT platforms, and hardware-related software stacks.',
      icon: Cpu,
      color: 'text-orange-400',
      bg: 'from-orange-400/20 to-red-400/20'
    },
    {
      id: 'other',
      name: 'Utilities & Others',
      description: 'General productivity tools, graphic software, and miscellaneous applications.',
      icon: Box,
      color: 'text-teal-400',
      bg: 'from-teal-400/20 to-green-400/20'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Documentation - TrackVers Categories</title>
        <meta name="description" content="Explore TrackVers documentation categories to find organized software information across languages, frameworks, databases, and more." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16 container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white"
          >
            Software Categories
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Browse our comprehensive documentation organized by technology type. Find exactly what you need quickly and efficiently.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-cyan-900/20 hover:border-cyan-500/30 transition-all cursor-default group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <category.icon className={`w-7 h-7 ${category.color}`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {category.name}
              </h3>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                {category.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DocumentationPage;
