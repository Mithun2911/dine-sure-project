
import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="w-32 h-32 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <img 
        src="/logo.png" 
        alt="DineSure Logo" 
        className="w-full h-full object-contain" 
      />
    </motion.div>
  );
};

export default Logo;
