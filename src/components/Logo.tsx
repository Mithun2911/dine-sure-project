
import React from 'react';
import { motion } from 'framer-motion';

const Logo = () => {
  return (
    <motion.div 
      className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <img 
        src="/lovable-uploads/eeb73cf9-57d7-4044-aad2-455101ddd77a.png" 
        alt="DineSure Logo" 
        className="w-full h-full object-contain" 
      />
    </motion.div>
  );
};

export default Logo;
