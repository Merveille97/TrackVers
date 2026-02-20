import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { subscribeUserToPush, unsubscribeUserFromPush } from '@/lib/pushNotifications';

function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isNotifyEmail, setIsNotifyEmail] = useState(false);
  const [isNotifyBrowser, setIsNotifyBrowser] = useState(false);

  const getProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, email, notify_email, notify_browser`)
        .eq('id', user.id)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setProfile(data);
        setIsNotifyEmail(data.notify_email);
        setIsNotifyBrowser(data.notify_browser);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error fetching profile", description: error.message });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);
  
  const handleUpdatePreferences = async (updates) => {
    try {
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      toast({ title: "Success", description: "Preferences updated successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error updating preferences", description: error.message });
    }
  };

  const handleEmailToggle = (checked) => {
    setIsNotifyEmail(checked);
    handleUpdatePreferences({ notify_email: checked });
  };

  const handleBrowserToggle = async (checked) => {
    if (!user) return;

    if (checked) {
      if (Notification.permission === 'denied') {
        toast({ variant: 'destructive', title: 'Permission Denied', description: 'Please enable push notifications in browser settings to proceed.'});
        return;
      }
      
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setIsNotifyBrowser(true);
        await handleUpdatePreferences({ notify_browser: true });
        await subscribeUserToPush(user.id);
      } else {
        toast({ variant: 'destructive', title: 'Permission not granted', description: 'Browser notifications remain disabled.' });
      }
    } else {
      setIsNotifyBrowser(false);
      await handleUpdatePreferences({ notify_browser: false });
      await unsubscribeUserFromPush(user.id);
    }
  };


  if (loading) {
    return <div className="text-center py-20 text-xl text-gray-400">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-20 text-xl text-red-400">Could not load profile.</div>;
  }

  return (
    <>
      <Helmet>
        <title>My Profile - TrackVers</title>
        <meta name="description" content="Manage your TrackVers profile and notification settings." />
      </Helmet>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-lg text-gray-300 mt-2">Manage your account and notification settings.</p>
        </div>

        <div className="glass-effect rounded-2xl p-8">
          <div className="space-y-6">
            <div>
              <Label className="text-gray-400">Full Name</Label>
              <p className="text-white text-lg mt-1">{profile.full_name || 'Not set'}</p>
            </div>
            <div>
              <Label className="text-gray-400">Email</Label>
              <p className="text-white text-lg mt-1">{profile.email}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Notification Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="text-lg text-gray-300">
                      Email Notifications
                      <p className="text-sm text-gray-500">Receive updates via email.</p>
                  </Label>
                  <Switch
                      id="email-notifications"
                      checked={isNotifyEmail}
                      onCheckedChange={handleEmailToggle}
                  />
              </div>
              <div className="flex items-center justify-between">
                  <Label htmlFor="browser-notifications" className="text-lg text-gray-300">
                      Browser Push Notifications
                      <p className="text-sm text-gray-500">Get real-time browser alerts.</p>
                  </Label>
                  <Switch
                      id="browser-notifications"
                      checked={isNotifyBrowser}
                      onCheckedChange={handleBrowserToggle}
                  />
              </div>
            </div>
        </div>
      </motion.div>
    </>
  );
}

export default ProfilePage;