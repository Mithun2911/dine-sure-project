
import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onBookTable: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookTable }) => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8 flex justify-center w-full"
      >
        <Logo />
      </motion.div>
      
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
      >
        Make Sure With DineSure
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-white/80 max-w-2xl mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
      >
        Book your perfect dining experience with ease. Reserve tables at the finest restaurants and pre-order your meal.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
      >
        <Button 
          onClick={onBookTable}
          className="primary-button text-lg"
          size="lg"
        >
          Book Your Table
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Hero;
