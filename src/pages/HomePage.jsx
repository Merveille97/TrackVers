
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Bell, Zap, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import TechGrid from '@/components/TechGrid';
import FavoritesCarousel from '@/components/FavoritesCarousel';
import CategoryCarousel from '@/components/CategoryCarousel';
import FeedbackButton from '@/components/FeedbackButton';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import useAppsByCategory from '@/hooks/useAppsByCategory';

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { 
    groupedData, 
    flatData, 
    favorites, 
    loading, 
    toggleFavorite, 
    toggleTrack 
  } = useAppsByCategory();

  useEffect(() => {
    // Debug logging for HomePage receiving data
    if (!loading && flatData.length > 0) {
      console.log('HomePage received data from hook:', flatData.length, 'items');
      console.log('HomePage first item sample:', flatData[0]);
    }
  }, [loading, flatData]);

  const handleToggleTrack = async (tech) => {
    try {
      const result = await toggleTrack(tech);
      toast({ 
        title: result === 'tracked' ? "Started tracking" : "Stopped tracking", 
        description: `${tech.name} ${result === 'tracked' ? 'added to' : 'removed from'} your stack.` 
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Action failed", description: error.message });
    }
  };

  const handleToggleFavorite = async (techId) => {
    try {
      if (!user) {
        toast({
          title: "Please sign in",
          description: "You need to be logged in to save favorites.",
          action: <Button onClick={() => navigate('/login')}>Login</Button>
        });
      }
      await toggleFavorite(techId);
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const filteredTechnologies = flatData.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tech.description && tech.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesFavorites = selectedCategory === 'favorites' ? favorites.includes(tech.id) : true;
    
    return matchesSearch && (selectedCategory === 'favorites' ? matchesFavorites : matchesCategory);
  });

  const isBrowseMode = searchQuery === '' && selectedCategory === 'all';

  const favoriteItems = user ? flatData.filter(tech => 
    favorites.includes(tech.id) || !!tech.current_version
  ) : [];

  const sortedCategories = Object.keys(groupedData).sort();

  return (
    <>
      <Helmet>
        <title>TrackVers - Never Miss a Software Update Again</title>
        <meta name="description" content="Track the latest versions of your favorite software, operating systems, and development tools. Get instant notifications when updates are released." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 pb-20"
      >
        <div className="text-center space-y-6 mb-12">
          <div className="flex flex-col items-center justify-center pt-8 pb-4">
            <motion.div 
               initial={{ opacity: 0, y: -20 }} 
               animate={{ opacity: 1, y: 0 }} 
               transition={{ delay: 0.2 }} 
               className="flex flex-col items-center"
            >
              <motion.img 
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                src="https://horizons-cdn.hostinger.com/eb6b8d1e-e759-4a3a-a979-e2246f01f58c/dfde3ab90e6fabc50e2f7c3bab8fe4d0.png"
                alt="TrackVers Logo"
                className="w-48 h-48 md:w-64 md:h-64 object-contain mb-[-40px] md:mb-[-50px] filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
              <div className="flex items-baseline">
                <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  TrackVers
                </span>
              </div>
            </motion.div>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto px-4">
            Never miss a software update again. Track versions, get notifications, stay secure.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex gap-4 justify-center flex-wrap px-4">
            {!user && (
              <Button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-lg px-8 py-6 shadow-lg shadow-blue-500/20">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 text-lg px-8 py-6">
              View Dashboard
            </Button>
          </motion.div>
        </div>

        <div className="space-y-8 min-h-[600px]">
          <div className="py-4 border-b border-white/5">
            <h2 className="text-3xl font-bold text-center text-white mb-6">Browse Software Catalog</h2>
            <div className="container mx-auto px-4 max-w-6xl space-y-4">
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} favoritesCount={favorites.length} />
            </div>
          </div>
          
          {user && favoriteItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <FavoritesCarousel 
                items={favoriteItems} 
                favorites={favorites} 
                toggleFavorite={handleToggleFavorite}
                toggleTrack={handleToggleTrack}
              />
            </motion.div>
          )}

          {!isBrowseMode && !searchQuery && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-effect rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Stay Secure</h3>
                <p className="text-sm text-gray-400">Track security updates for critical software</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="glass-effect rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Get Notified</h3>
                <p className="text-sm text-gray-400">Instant alerts for new releases</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="glass-effect rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Save Time</h3>
                <p className="text-sm text-gray-400">Centralized dashboard for all tools</p>
              </motion.div>
            </div>
          )}

          <div className="container mx-auto px-0 md:px-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                 <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                 <p className="text-xl text-gray-400">Loading software catalog...</p>
              </div>
            ) : isBrowseMode ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {sortedCategories.map((category, index) => (
                  <CategoryCarousel
                    key={category}
                    category={category}
                    items={groupedData[category]}
                    favorites={favorites}
                    toggleFavorite={handleToggleFavorite}
                    toggleTrack={handleToggleTrack}
                    isLastCategory={index === sortedCategories.length - 1}
                  />
                ))}
                {Object.keys(groupedData).length === 0 && (
                  <div className="text-center py-20 text-gray-400">No categories found.</div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="px-4"
              >
                <div className="mb-6 flex items-center gap-2 text-gray-400 text-sm">
                  <Search className="w-4 h-4" />
                  <span>Found {filteredTechnologies.length} results</span>
                </div>
                <TechGrid 
                  technologies={filteredTechnologies} 
                  favorites={favorites} 
                  toggleFavorite={handleToggleFavorite} 
                  toggleTrack={handleToggleTrack}
                />
              </motion.div>
            )}
          </div>
        </div>
        
        <ScrollToTopButton />
        <FeedbackButton />
      </motion.div>
    </>
  );
}

export default HomePage;
