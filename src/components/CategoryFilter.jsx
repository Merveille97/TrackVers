import React from 'react';
import { motion } from 'framer-motion';
import { Code, Layers, Database, Wrench, Star, Terminal, Palette, Globe, Shield, Server, FolderGit, Box, Settings } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All', icon: Layers },
  { id: 'os', label: 'OS', icon: Server },
  { id: 'sysadmin', label: 'Sys Mgmt', icon: Settings },
  { id: 'virtualization', label: 'Virtualization', icon: Box },
  { id: 'language', label: 'Languages', icon: Code },
  { id: 'framework', label: 'Frameworks', icon: Wrench },
  { id: 'database', label: 'Databases', icon: Database },
  { id: 'devtool', label: 'Dev Tools', icon: Terminal },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'browser', label: 'Browsers', icon: Globe },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'transfer', label: 'File Transfer', icon: FolderGit },
  { id: 'favorites', label: 'Favorites', icon: Star },
];

const CategoryFilter = ({ selectedCategory, setSelectedCategory, favoritesCount }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category, index) => {
        const Icon = category.icon;
        const isActive = selectedCategory === category.id;
        
        return (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`
              px-4 py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-300
              flex items-center gap-2 text-xs md:text-sm
              ${isActive 
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50' 
                : 'bg-transparent text-gray-300 hover:bg-white/10' // Updated for transparency
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {category.label}
            {category.id === 'favorites' && favoritesCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {favoritesCount}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;