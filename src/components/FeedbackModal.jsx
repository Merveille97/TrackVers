import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const FeedbackModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-slate-950/95 border-slate-800 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            We'd Love Your Feedback!
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-6 pt-2"
        >
          <p className="text-gray-300 leading-relaxed">
            TrackVers is constantly evolving! We're developing better versions and your feedback is invaluable. If you have suggestions or remarks, please share them with us!
          </p>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onClose(false)}
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg shadow-blue-500/20 gap-2"
              onClick={() => window.location.href = "mailto:merveillemadilu442@gmail.com"}
            >
              <Mail className="w-4 h-4" />
              Send Feedback
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;