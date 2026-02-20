import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Debug on mount
  useEffect(() => {
    console.log("NotificationBell: Component successfully mounted");
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    console.log("NotificationBell: Toggled. New State:", !isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDropdown}
        className="relative hover:bg-white/10 transition-colors text-white"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {/* Active notification indicator (commented out until logic is ready) */}
        {/* <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" /> */}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="font-semibold text-white">Notifications</h3>
              <span className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded-full">0 new</span>
            </div>

            <ScrollArea className="h-[250px] w-full">
              <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-300 font-medium">No notifications yet</p>
                <p className="text-xs text-gray-500 mt-1 max-w-[200px]">
                  We'll notify you when important software updates arrive.
                </p>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;