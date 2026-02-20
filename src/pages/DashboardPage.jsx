
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Plus, Trash2, Search, AlertCircle, CheckCircle2, Package, MoreVertical, Edit2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import TechCard from '@/components/TechCard';
import { useTrackSoftware } from '@/hooks/useTrackSoftware';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TutorialGuide from '@/components/TutorialGuide';
import { dashboardTutorialSteps } from '@/lib/tutorialSteps';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AnimatePresence, motion } from "framer-motion"

// Helper function for semantic version comparison
const compareVersions = (v1, v2) => {
  if (!v1 || !v2) return 0;
  // Remove non-numeric/dot characters for safety
  const cleanV1 = v1.replace(/[^0-9.]/g, '');
  const cleanV2 = v2.replace(/[^0-9.]/g, '');
  
  const v1Parts = cleanV1.split('.').map(Number);
  const v2Parts = cleanV2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const val1 = v1Parts[i] || 0;
    const val2 = v2Parts[i] || 0;
    if (val1 > val2) return 1;
    if (val1 < val2) return -1;
  }
  return 0;
};


const DashboardPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackSoftware, untrackSoftware } = useTrackSoftware();
  
  const [mySoftware, setMySoftware] = useState([]);
  const [availableSoftware, setAvailableSoftware] = useState([]);
  const [favoritesData, setFavoritesData] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  
  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSoftwareId, setSelectedSoftwareId] = useState('');
  const [initialVersion, setInitialVersion] = useState('');
  const [versionError, setVersionError] = useState('');

  const [deleteId, setDeleteId] = useState(null);
  
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingVersion, setEditingVersion] = useState('');
  const [editingVersionError, setEditingVersionError] = useState('');

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditingVersion(item.current_version);
    setEditingVersionError('');
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingVersion('');
    setEditingVersionError('');
  };

  const fetchMySoftware = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: versions, error } = await supabase
        .from('user_software_versions')
        .select(`
          id,
          current_version,
          software_id,
          software:software_id (
            id,
            name,
            latest_version,
            category,
            last_updated
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      if (versions && versions.length > 0) {
          const softwareIds = versions.map(v => v.software_id);
          const { data: eolData } = await supabase
            .from('eol_eos_dates')
            .select('*')
            .in('software_id', softwareIds);
            
          const merged = versions.map(v => {
             const eol = eolData?.find(e => e.software_id === v.software_id);
             return { ...v, eolData: eol };
          });
          setMySoftware(merged);
      } else {
          setMySoftware([]);
      }
    } catch (error) {
       console.error("Fetch Error:", error);
    } finally {
       setLoading(false);
    }
  }, [user]);

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    try {
      const { data: favs, error: favError } = await supabase
        .from('user_favorites')
        .select('software_id')
        .eq('user_id', user.id);
      
      if (favError) throw favError;
      
      const ids = favs.map(f => f.software_id);

      if (ids.length === 0) {
        setFavoritesData([]);
      } else {
        const { data: software, error: softError } = await supabase
          .from('software')
          .select('*')
          .in('id', ids)
          .order('name');
          
        if (softError) throw softError;
        setFavoritesData(software);
      }
    } catch (error) {
      console.error("Favorites Error:", error);
    }
  }, [user]);

  const fetchAvailableSoftware = useCallback(async () => {
    const { data, error } = await supabase
      .from('software')
      .select('id, name, latest_version, category')
      .order('name');
      
    if (error) {
      console.error('Error fetching available software:', error);
    } else {
      setAvailableSoftware(data || []);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchMySoftware();
      fetchFavorites();
      fetchAvailableSoftware();
    }
  }, [user, fetchMySoftware, fetchFavorites, fetchAvailableSoftware]);

  // Add Modal Version Validation Effect
  useEffect(() => {
    if (!selectedSoftwareId || !initialVersion) {
      setVersionError('');
      return;
    }

    const software = availableSoftware.find(s => s.id === selectedSoftwareId);
    if (software?.latest_version) {
      const comparison = compareVersions(initialVersion, software.latest_version);
      console.log(`Add Modal Validation: User version: ${initialVersion}, Latest: ${software.latest_version}, Comparison: ${comparison}`);
      if (comparison > 0) {
        setVersionError(`Version cannot be higher than latest: ${software.latest_version}`);
      } else {
        setVersionError('');
      }
    }
  }, [selectedSoftwareId, initialVersion, availableSoftware]);

  // Edit-in-place Version Validation Effect
  useEffect(() => {
    if (!editingItemId || !editingVersion) {
        setEditingVersionError('');
        return;
    }
    const item = mySoftware.find(s => s.id === editingItemId);
    if (item && item.software?.latest_version) {
        const comparison = compareVersions(editingVersion, item.software.latest_version);
        console.log(`Edit Validation: User version: ${editingVersion}, Latest: ${item.software.latest_version}, Comparison: ${comparison}`);
        if (comparison > 0) {
            setEditingVersionError(`Version cannot be higher than latest: ${item.software.latest_version}`);
        } else {
            setEditingVersionError('');
        }
    }
  }, [editingItemId, editingVersion, mySoftware]);

  const handleAddSoftware = async () => {
    if (!selectedSoftwareId || !initialVersion) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please select software and enter a version." });
      return;
    }

    if (versionError) {
      toast({ variant: "destructive", title: "Invalid Version", description: versionError });
      return;
    }

    const result = await trackSoftware(selectedSoftwareId, initialVersion);
    if (result.success) {
      setIsAddOpen(false);
      resetAddModal();
      fetchMySoftware();
    }
  };

  const resetAddModal = () => {
    setSelectedSoftwareId('');
    setInitialVersion('');
    setSearchQuery('');
    setVersionError('');
  };

  const handleUpdateVersion = async (recordId, newVersion) => {
    if (editingVersionError) {
        toast({ variant: "destructive", title: "Invalid Version", description: editingVersionError });
        return;
    }
    
    try {
        const { error } = await supabase
          .from('user_software_versions')
          .update({ current_version: newVersion })
          .eq('id', recordId);

        if (error) throw error;

        toast({ title: "Updated", description: "Version updated successfully." });
        setMySoftware(prev => prev.map(item => 
          item.id === recordId ? { ...item, current_version: newVersion } : item
        ));
        handleCancelEdit();
    } catch(error) {
        toast({ variant: "destructive", title: "Update failed", description: error.message });
        fetchMySoftware(); // Re-fetch to reset state on error
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
        setLoading(true);
        const result = await untrackSoftware(deleteId);
        if (result.success) {
            setMySoftware(prev => prev.filter(item => item.id !== deleteId));
        }
    } catch (error) {
        console.error("Error during delete confirmation:", error);
        toast({ variant: "destructive", title: "Deletion Failed", description: "An unexpected error occurred." });
    } finally {
        setDeleteId(null);
        setLoading(false);
    }
  };

  const handleCheckUpdates = async () => {
    setIsChecking(true);
    try {
      const softwareIds = mySoftware.map(item => item.software_id);
      if (softwareIds.length === 0) {
        toast({ title: "No software", description: "Add software to check." });
        return;
      }
      const { error } = await supabase.functions.invoke('check-versions', { body: { softwareIds } });
      if (error) throw error;
      toast({ title: "Check Complete", description: "Updates checked." });
      await fetchMySoftware();
    } catch (error) {
      toast({ variant: "destructive", title: "Check failed", description: error.message });
    } finally {
      setIsChecking(false);
    }
  };

  const filteredSoftware = availableSoftware.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedSoftware = availableSoftware.find(s => s.id === selectedSoftwareId);
  const shouldShowTutorial = !loading && mySoftware.length === 0;

  return (
    <>
      <Helmet>
        <title>Dashboard - TrackVers</title>
      </Helmet>
      
      {shouldShowTutorial && <TutorialGuide steps={dashboardTutorialSteps} />}
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div id="dashboard-title">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your software stack.</p>
          </div>
          <div className="flex gap-2">
            <Button id="tutorial-add-btn" onClick={() => setIsAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Software
            </Button>
            {user?.role === 'admin' && (
              <Button id="tutorial-check-btn" variant="outline" onClick={handleCheckUpdates} disabled={isChecking}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                Check Updates
              </Button>
            )}
          </div>
        </div>

        {loading && mySoftware.length === 0 ? (
          <div className="text-center py-10 text-slate-400">Loading your stack...</div>
        ) : mySoftware.length > 0 ? (
          <div id="tutorial-software-table" className="space-y-3">
             <AnimatePresence>
             {mySoftware.map((item) => (
               <motion.div 
                 key={item.id}
                 layout
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, x: -50 }}
                 transition={{ duration: 0.3 }}
                 className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/70 hover:border-slate-700/80 transition-all duration-200 card-hover shadow-lg shadow-black/20"
               >
                 <div className="flex-1 min-w-0">
                   <p className="text-lg font-bold text-slate-100 truncate">{item.software?.name}</p>
                   {item.software?.category && <Badge variant="secondary" className="mt-1">{item.software.category}</Badge>}
                 </div>
                 
                 <div className="flex flex-col text-left md:text-center w-full md:w-auto">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Your Version</span>
                    {editingItemId === item.id ? (
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2 mt-1">
                          <Input 
                              value={editingVersion} 
                              onChange={(e) => setEditingVersion(e.target.value)} 
                              className={cn("h-8 bg-slate-700 border-slate-600", editingVersionError && "border-red-500")}
                          />
                          <Button size="sm" className="h-8" onClick={() => handleUpdateVersion(item.id, editingVersion)} disabled={!!editingVersionError}>Save</Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>X</Button>
                        </div>
                        {editingVersionError && <p className="text-xs text-red-400 mt-1">{editingVersionError}</p>}
                      </div>
                    ) : (
                      <p className="text-md font-mono text-slate-300">{item.current_version}</p>
                    )}
                 </div>
                 
                 <div className="flex flex-col text-left md:text-center w-full md:w-auto">
                    <span className="text-xs text-slate-500 uppercase font-semibold">Latest</span>
                    <p className="text-md font-mono text-cyan-400">{item.software?.latest_version}</p>
                 </div>
                 
                 <div className="flex flex-col text-left md:text-center w-full md:w-auto">
                    <span className="text-xs text-slate-500 uppercase font-semibold">EOL Status</span>
                    {item.eolData?.eol_date ? (
                      <Badge variant="destructive" className="mt-1 self-start md:self-center">EOL: {item.eolData.eol_date}</Badge>
                    ) : (
                      <Badge variant="outline" className="mt-1 self-start md:self-center">N/A</Badge>
                    )}
                 </div>
                 
                 <div className="self-end md:self-center">
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                           <MoreVertical className="h-4 w-4"/>
                         </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                         <DropdownMenuItem onSelect={() => handleEditClick(item)} className="cursor-pointer">
                           <Edit2 className="mr-2 h-4 w-4" />
                           <span>Edit Version</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem onSelect={() => handleDeleteClick(item.id)} className="text-red-500 focus:text-white focus:bg-red-600/80 cursor-pointer">
                           <Trash2 className="mr-2 h-4 w-4" />
                           <span>Delete</span>
                         </DropdownMenuItem>
                       </DropdownMenuContent>
                     </DropdownMenu>
                 </div>
               </motion.div>
             ))}
             </AnimatePresence>
          </div>
        ) : (
          <div id="tutorial-software-table" className="text-center py-16 border-2 border-dashed border-gray-700 rounded-xl bg-slate-900/30">
             <p className="text-gray-400 text-lg">Your dashboard is empty.</p>
             <p className="text-gray-500 text-sm mt-2">Start by adding software to track versions and EOL dates.</p>
             <Button className="mt-6" variant="secondary" onClick={() => setIsAddOpen(true)}>
                Add Your First Software
             </Button>
          </div>
        )}
        
        {favoritesData.length > 0 && (
          <div id="tutorial-favorites">
            <h2 className="text-xl font-bold text-white mb-4">Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {favoritesData.map((tech, idx) => (
                 <TechCard 
                   key={tech.id} 
                   tech={tech} 
                   index={idx} 
                   isFavorite={true}
                   toggleFavorite={() => {}} 
                   isTracked={false}
                   toggleTrack={() => {}} 
                 />
               ))}
            </div>
          </div>
        )}

        <Dialog open={isAddOpen} onOpenChange={(open) => {
            if (!open) resetAddModal();
            setIsAddOpen(open);
        }}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col bg-slate-900 border-slate-700 text-slate-100">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-100">Add Software to Track</DialogTitle>
            </DialogHeader>
            
            <div className="flex flex-col gap-4 py-4 flex-1 overflow-hidden">
               <div className="relative">
                 <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                 <Input 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   placeholder="Search software..." 
                   className="pl-10 bg-slate-800 border-slate-700 text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                 />
               </div>

               <div className="flex-1 min-h-[200px] max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar border border-slate-800 rounded-md p-1 bg-slate-950/30">
                  {filteredSoftware.length > 0 ? (
                    filteredSoftware.map((software) => {
                      const isSelected = selectedSoftwareId === software.id;
                      return (
                        <div
                          key={software.id}
                          onClick={() => setSelectedSoftwareId(software.id)}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border border-transparent",
                            isSelected 
                              ? "bg-blue-600/20 border-blue-500/50 shadow-md shadow-blue-900/20" 
                              : "hover:bg-slate-800 hover:border-slate-700 hover:translate-x-1"
                          )}
                        >
                          <div className="flex flex-col">
                            <span className={cn("font-medium", isSelected ? "text-blue-400" : "text-slate-200")}>
                              {software.name}
                            </span>
                            {software.category && (
                              <Badge variant="outline" className="text-[10px] h-5 px-1.5 border-slate-700 text-slate-400 bg-slate-900/50 w-fit mt-1">
                                {software.category}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-right">
                             {isSelected && <CheckCircle2 className="h-5 w-5 text-blue-500 mb-1 ml-auto" />}
                             <span className="text-xs text-slate-500 block">Latest: {software.latest_version}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8">
                       <Package className="h-8 w-8 mb-2 opacity-50" />
                       <p>No software found</p>
                    </div>
                  )}
               </div>

               <div className="space-y-2 pt-2 border-t border-slate-800">
                 <div className="flex justify-between items-center">
                   <Label className="text-slate-300">Current Version</Label>
                   {selectedSoftware && (
                     <span className="text-xs text-slate-500">
                       Latest stable: <span className="text-slate-300 font-mono">{selectedSoftware.latest_version}</span>
                     </span>
                   )}
                 </div>
                 
                 <div className="relative">
                    <Input 
                      value={initialVersion} 
                      onChange={(e) => setInitialVersion(e.target.value)} 
                      placeholder={selectedSoftware?.latest_version || "e.g., 1.0.0"}
                      disabled={!selectedSoftwareId}
                      className={cn(
                        "bg-slate-800 border-slate-700 text-slate-100",
                        versionError && "border-red-500 focus:ring-red-500"
                      )}
                    />
                    {versionError && (
                      <div className="flex items-center mt-2 text-xs text-red-400 font-medium animate-in slide-in-from-top-1">
                        <AlertCircle className="h-3 w-3 mr-1.5" />
                        {versionError}
                      </div>
                    )}
                 </div>
               </div>
            </div>

            <DialogFooter className="border-t border-slate-800 pt-4">
               <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">
                 Cancel
               </Button>
               <Button 
                 onClick={handleAddSoftware} 
                 disabled={!selectedSoftwareId || !initialVersion || !!versionError}
                 className="bg-blue-600 hover:bg-blue-500 text-white"
               >
                 Add Software
               </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
           <AlertDialogContent>
             <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
             <p className="text-slate-400">This will permanently remove the software from your dashboard.</p>
             <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
             </AlertDialogFooter>
           </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export default DashboardPage;
