import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import TechCard from '@/components/TechCard';

const FavoritesCarousel = ({ items, favorites, toggleFavorite, toggleTrack }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approx card width + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group w-full my-8">
      <div className="flex items-center gap-2 mb-4 px-4">
        <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
        <h2 className="text-2xl font-bold text-white">Your Favorites & Tracked Apps</h2>
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block backdrop-blur-sm -ml-4"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hidden md:block backdrop-blur-sm -mr-4"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 pt-4 px-4 snap-x snap-mandatory scrollbar-hide mask-gradient"
        style={{ scrollBehavior: 'smooth' }}
      >
        {items.map((tech, index) => (
          <div key={tech.id} className="snap-center shrink-0 w-[300px] h-full">
            <TechCard
              tech={tech}
              index={index}
              isFavorite={favorites.includes(tech.id)}
              toggleFavorite={toggleFavorite}
              isTracked={!!tech.current_version}
              toggleTrack={toggleTrack}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesCarousel;