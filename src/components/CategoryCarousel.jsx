import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import TechCard from '@/components/TechCard';

const CategoryCarousel = ({ 
  category, 
  items, 
  favorites = [], 
  toggleFavorite, 
  toggleTrack,
  isLastCategory 
}) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group w-full pt-4 pb-8"> {/* Reduced top padding from py-8 to pt-4 and kept pb-8 */}
      {/* Category Header */}
      <motion.div 
         initial={{ opacity: 0, y: 10 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.5 }}
         className="flex items-center gap-3 mb-6 px-4 md:px-8"
      >
        <div className="p-2 rounded-lg bg-blue-500/10">
          <Layers className="w-6 h-6 text-blue-400" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white capitalize tracking-tight">
          {category}
        </h2>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-blue-500/30 to-transparent ml-4" />
      </motion.div>

      <div className="relative group/slider">
        {/* Navigation Buttons */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all duration-300 disabled:opacity-0 hidden md:flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-xl hover:scale-110"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover/slider:opacity-100 transition-all duration-300 disabled:opacity-0 hidden md:flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-xl hover:scale-110"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 pt-4 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide mask-gradient"
          style={{ 
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {items.map((tech, index) => (
            <div 
              key={tech.id} 
              className="snap-start shrink-0 h-full w-[280px] md:w-[300px]"
            >
              <div className="h-full hover:scale-[1.02] transition-transform duration-200">
                <TechCard
                  tech={tech}
                  index={index}
                  isFavorite={favorites.includes(tech.id)}
                  toggleFavorite={toggleFavorite}
                  isTracked={!!tech.current_version}
                  toggleTrack={toggleTrack}
                />
              </div>
            </div>
          ))}
          
          {/* Spacer */}
          <div className="w-8 shrink-0 snap-start" />
        </div>
      </div>
      
      {!isLastCategory && (
        <div className="container mx-auto px-4 md:px-8 mt-12 mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent w-full" />
        </div>
      )}
    </div>
  );
};

export default CategoryCarousel;