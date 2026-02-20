
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Database, Clock, LayoutGrid, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Database,
      title: "Centralized Database",
      description: "Access a comprehensive repository of software applications, tools, and operating systems in one single, organized location."
    },
    {
      icon: Search,
      title: "Easy Information Access",
      description: "Stop wasting hours searching multiple vendor sites. Find version numbers, download links, and critical details instantly."
    },
    {
      icon: Clock,
      title: "Lifecycle Intelligence",
      description: "Stay ahead with critical dates including End of Life (EOL), End of Support (EOS), and maintenance schedules for your entire stack."
    },
    {
      icon: LayoutGrid,
      title: "Organized Categories",
      description: "Navigate effortlessly through intuitive categories designed for developers, sysadmins, and tech enthusiasts."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About TrackVers - Centralized Software Intelligence</title>
        <meta name="description" content="TrackVers is a centralized platform built to help users find software information, lifecycle dates, and version details without wasting time searching the internet." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-16">
        {/* Hero Section */}
        <section className="relative px-4 mb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-500/20 blur-[100px] -z-10 rounded-full pointer-events-none" />
          
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Simplifying Software Discovery
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light"
            >
              TrackVers is a centralized platform built to help users find software information without wasting time searching the internet.
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center bg-slate-900/40 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 text-cyan-400 mb-2">
                <Globe className="w-6 h-6" />
                <span className="font-semibold tracking-wider uppercase text-sm">Our Mission</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Why We Built TrackVers</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                In today's fragmented digital landscape, finding reliable information about software versions and lifecycle dates often requires visiting dozens of different vendor websites.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                We believe that accurate software intelligence should be accessible, organized, and centralized. Whether you're a developer maintaining a stack, an IT manager planning upgrades, or an enthusiast staying current, TrackVers saves you time by bringing everything into one clear view.
              </p>
              <Button 
                onClick={() => navigate('/documentation')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white mt-4"
              >
                Explore Documentation
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-auto md:h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/5 p-8 flex flex-col justify-center items-center text-center shadow-2xl overflow-hidden group"
            >
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              
              <ShieldCheck className="w-24 h-24 text-cyan-400 mb-6 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Reliable Intelligence</h3>
              <p className="text-gray-400 relative z-10 max-w-xs">
                Data-driven insights to help you make informed decisions about your software ecosystem.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 pb-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Core Features</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your software knowledge in one place.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-900/60 border border-white/10 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors group cursor-default"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
