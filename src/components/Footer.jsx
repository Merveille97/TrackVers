
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-20 border-t border-white/10 bg-gradient-to-b from-transparent to-slate-900/50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <motion.p
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-gray-400 text-sm md:text-base font-medium tracking-wide"
          >
            Built By{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">
              Merveille Solutions
            </span>
          </motion.p>
          <motion.p className="text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} TrackVers. All rights reserved.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-3 h-px w-24 mx-auto bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
          />
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
