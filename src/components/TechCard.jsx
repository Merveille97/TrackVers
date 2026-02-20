
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, TrendingUp, CheckCircle, AlertCircle, Eye, EyeOff, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { cn } from '@/lib/utils';
import DateInfoTooltip from '@/components/DateInfoTooltip';

const TechCard = ({ tech, index, isFavorite, toggleFavorite, isTracked, toggleTrack }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isTrackLoading, setIsTrackLoading] = useState(false);
  const [imgError, setImgError] = useState(false);
  
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, [tech]);

  if (!tech) return null;

  const handleLearnMore = () => {
    if (tech.source_url) {
      window.open(tech.source_url, '_blank');
    } else {
      toast({
        title: "No URL available",
        description: "Source URL is not configured for this software.",
      });
    }
  };

  const handleTrackClick = async (e) => {
    e.stopPropagation();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to track software versions.",
        variant: "destructive"
      });
      return;
    }
    
    setIsTrackLoading(true);
    try {
      if (toggleTrack) await toggleTrack(tech);
    } catch (err) {
      console.error("Track error:", err);
    } finally {
      if (isMountedRef.current) setIsTrackLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!user || !status) return 'from-blue-500 to-cyan-500'; 
    switch (status) {
      case 'latest': return 'from-green-500 to-emerald-500';
      case 'update-available': return 'from-yellow-500 to-orange-500';
      case 'outdated': return 'from-red-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "glass-effect rounded-2xl p-6 card-hover relative overflow-hidden group flex flex-col h-full w-full bg-slate-900/40 backdrop-blur-xl border border-white/10",
        isTracked ? "border-l-4 border-l-cyan-400" : "border-l-4 border-l-transparent"
      )}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getStatusColor(tech.status)} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity pointer-events-none`} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-start gap-3 mb-2 mt-1">
          <div className="p-2 bg-white/10 rounded-xl flex items-center justify-center w-12 h-12 shrink-0 relative">
            {tech.logo_url && !imgError ? (
              <img 
                src={tech.logo_url} 
                alt={`${tech.name} logo`} 
                className="w-8 h-8 object-contain" 
                onError={() => setImgError(true)} 
              />
            ) : (
              <div className="w-8 h-8 bg-gray-700 rounded-full" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white break-words leading-tight" title={tech.name}>
              {tech.name}
            </h3>
            <p className="text-xs text-gray-400 capitalize mt-1">{tech.category}</p>
          </div>
        </div>

        <p className="text-gray-300 text-xs mb-4 line-clamp-3 flex-grow leading-relaxed">
          {tech.description}
        </p>
        
        <div className="space-y-2 mb-4 bg-black/20 p-3 rounded-lg border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" />
              Latest
            </span>
            <span className="text-sm font-bold text-white font-mono">{tech.latest_version || 'Unknown'}</span>
          </div>

          {user && tech.current_version && (
            <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
              <span className="text-xs text-gray-400 flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3" />
                Mine
              </span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{tech.current_version}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-1">
            <span className="text-xs text-gray-400 flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Updated
            </span>
            <span className="text-[10px] text-gray-300">{tech.last_updated || 'Not set'}</span>
          </div>
        </div>

        {user && tech.status ? (
          <div className={`px-2 py-1 rounded-md bg-gradient-to-r ${getStatusColor(tech.status)} bg-opacity-20 mb-3`}>
            <p className="text-[10px] font-bold text-center uppercase tracking-wider flex items-center justify-center gap-1.5 text-white shadow-sm">
              {tech.status === 'update-available' && <AlertCircle className="w-3 h-3" />}
              {tech.status === 'latest' && <CheckCircle className="w-3 h-3" />}
              {tech.status.replace('-', ' ')}
            </p>
          </div>
        ) : (
          <div className="h-0 mb-3"></div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center gap-2 mt-auto">
          <Button
            onClick={handleLearnMore}
            size="sm"
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs h-8 font-medium shadow-lg shadow-blue-500/20"
          >
            <ExternalLink className="w-3 h-3 mr-2" />
            {tech.source_url ? 'Visit Source' : 'Learn More'}
          </Button>

          {/* Action Buttons (Info, Track, Favorite) */}
          <div className="flex gap-1">
            <DateInfoTooltip tech={tech} />
            
            <button
              onClick={handleTrackClick}
              disabled={isTrackLoading}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors group/track bg-black/20 border border-white/5"
              title={isTracked ? "Stop tracking" : "Track this software"}
            >
              {isTrackLoading ? (
                <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
              ) : isTracked ? (
                <Eye className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400 group-hover/track:text-cyan-400 transition-colors" />
              )}
            </button>
            <button
              onClick={(e) => {
                 e.stopPropagation();
                 if (toggleFavorite) toggleFavorite(tech.id);
              }}
              className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors bg-black/20 border border-white/5"
              aria-label={`Favorite ${tech.name}`}
            >
              <Star
                className={`w-4 h-4 transition-all ${isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TechCard;
