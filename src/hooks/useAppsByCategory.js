import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

const useAppsByCategory = () => {
  const { user } = useAuth();
  const [groupedData, setGroupedData] = useState({});
  const [flatData, setFlatData] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching software data from Supabase...');
      
      // 1. Fetch global software list with explicit field selection including dates
      const { data: softwareData, error: softwareError } = await supabase
        .from('software')
        .select('id, name, icon, category, description, latest_version, last_updated, status, logo_url, source_url, last_checked, eol_date, end_of_support_date, end_of_maintenance_date')
        .order('name');
      
      if (softwareError) {
        console.error('Supabase error fetching software:', softwareError);
        throw softwareError;
      }

      console.log('Raw software data fetched:', softwareData);
      // Log specifically for date fields to verify they are present
      if (softwareData && softwareData.length > 0) {
        console.log('Date fields verification (first item):', {
          name: softwareData[0].name,
          eol_date: softwareData[0].eol_date,
          end_of_support_date: softwareData[0].end_of_support_date,
          end_of_maintenance_date: softwareData[0].end_of_maintenance_date
        });
      }

      // 2. Fetch User Favorites
      let userFavorites = [];
      if (user) {
        const { data: favData, error: favError } = await supabase
          .from('user_favorites')
          .select('software_id')
          .eq('user_id', user.id);
        
        if (favError) throw favError;
        userFavorites = favData.map(f => f.software_id);
      } else {
        const local = localStorage.getItem('tech-favorites');
        if (local) userFavorites = JSON.parse(local);
      }
      setFavorites(userFavorites);

      // 3. Process Software Data (merge with user tracking info)
      let processedData = softwareData;

      if (user) {
        const { data: userVersions, error: versionError } = await supabase
          .from('user_software_versions')
          .select('id, software_id, current_version')
          .eq('user_id', user.id);

        if (versionError) throw versionError;

        const versionMap = new Map(userVersions.map(uv => [uv.software_id, uv]));

        processedData = softwareData.map(tech => {
          const trackedData = versionMap.get(tech.id);
          const currentVer = trackedData?.current_version;
          let status = null;
          
          if (currentVer) {
            status = currentVer === tech.latest_version ? 'latest' : 'update-available';
          }

          return {
            ...tech,
            current_version: currentVer,
            tracked_id: trackedData?.id,
            status: status 
          };
        });
      }

      setFlatData(processedData);

      // 4. Group by Category
      const grouped = processedData.reduce((acc, tech) => {
        const category = tech.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(tech);
        return acc;
      }, {});

      setGroupedData(grouped);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFavorite = async (techId) => {
    if (!user) {
      // Local storage fallback
      const newFavorites = favorites.includes(techId) 
        ? favorites.filter(id => id !== techId) 
        : [...favorites, techId];
      setFavorites(newFavorites);
      localStorage.setItem('tech-favorites', JSON.stringify(newFavorites));
      return;
    }

    const isFavorite = favorites.includes(techId);
    try {
      if (isFavorite) {
        const { error } = await supabase.from('user_favorites').delete().match({ user_id: user.id, software_id: techId });
        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== techId));
      } else {
        const { error } = await supabase.from('user_favorites').insert({ user_id: user.id, software_id: techId });
        if (error) throw error;
        setFavorites(prev => [...prev, techId]);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      throw err; // Let component handle UI feedback
    }
  };

  const toggleTrack = async (tech) => {
    if (!user) throw new Error("Must be logged in to track");

    const isTracked = !!tech.current_version;

    try {
      if (isTracked) {
        // Untrack
        const { error } = await supabase
          .from('user_software_versions')
          .delete()
          .eq('user_id', user.id)
          .eq('software_id', tech.id);
        
        if (error) throw error;

        // Optimistic update
        const updater = (prev) => prev.map(t => 
          t.id === tech.id ? { ...t, current_version: undefined, status: undefined, tracked_id: undefined } : t
        );
        setFlatData(updater);
        
        // Re-group
        setGroupedData(prevGrouped => {
           const newGrouped = { ...prevGrouped };
           Object.keys(newGrouped).forEach(cat => {
             newGrouped[cat] = updater(newGrouped[cat]);
           });
           return newGrouped;
        });

        return 'untracked';

      } else {
        // Track
        const { data, error } = await supabase
          .from('user_software_versions')
          .insert({
            user_id: user.id,
            software_id: tech.id,
            current_version: tech.latest_version || '1.0.0'
          })
          .select()
          .single();

        if (error) throw error;

        // Optimistic update
        const updater = (prev) => prev.map(t => 
          t.id === tech.id ? { 
            ...t, 
            current_version: tech.latest_version || '1.0.0',
            status: 'latest',
            tracked_id: data.id
          } : t
        );
        
        setFlatData(updater);
        setGroupedData(prevGrouped => {
           const newGrouped = { ...prevGrouped };
           Object.keys(newGrouped).forEach(cat => {
             newGrouped[cat] = updater(newGrouped[cat]);
           });
           return newGrouped;
        });

        return 'tracked';
      }
    } catch (err) {
      console.error("Error toggling track status:", err);
      throw err;
    }
  };

  return {
    groupedData,
    flatData,
    favorites,
    loading,
    error,
    refresh: fetchData,
    toggleFavorite,
    toggleTrack
  };
};

export default useAppsByCategory;