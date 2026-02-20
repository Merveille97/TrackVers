import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import TechCard from '@/components/TechCard';

const TechGrid = ({ technologies, favorites, toggleFavorite, toggleTrack }) => {
  useEffect(() => {
    // Console log for debugging
    if (technologies && technologies.length > 0) {
      console.log('TechGrid technologies prop:', technologies);
      console.log('TechGrid - First Item Dates:', {
        name: technologies[0].name,
        eol: technologies[0].eol_date,
        support: technologies[0].end_of_support_date,
        maintenance: technologies[0].end_of_maintenance_date
      });
    } else {
      console.log('TechGrid: No technologies available');
    }
  }, [technologies]);

  if (technologies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-2xl text-gray-400">No technologies found matching your criteria</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {technologies.map((tech, index) => (
        <TechCard
          key={tech.id}
          tech={tech}
          index={index}
          isFavorite={favorites.includes(tech.id)}
          toggleFavorite={toggleFavorite}
          isTracked={!!tech.current_version}
          toggleTrack={toggleTrack}
        />
      ))}
    </motion.div>
  );
};

export default TechGrid;