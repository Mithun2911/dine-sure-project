
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RestaurantTypeSelectorProps {
  onSelectType: (isVeg: boolean) => void;
  onBack: () => void;
}

const RestaurantTypeSelector: React.FC<RestaurantTypeSelectorProps> = ({ onSelectType, onBack }) => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="card-container w-full max-w-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button 
          onClick={onBack} 
          variant="outline" 
          className="mb-6"
        >
          ← Back
        </Button>
        
        <h2 className="section-heading text-center">Select Restaurant Type</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => onSelectType(true)} 
              className="w-full h-40 text-xl bg-gradient-to-br from-green-500/80 to-emerald-700/80 backdrop-blur-sm border border-white/10 rounded-xl"
              variant="outline"
            >
              Vegetarian Restaurants
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => onSelectType(false)} 
              className="w-full h-40 text-xl bg-gradient-to-br from-red-500/80 to-rose-700/80 backdrop-blur-sm border border-white/10 rounded-xl"
              variant="outline"
            >
              Non-Vegetarian Restaurants
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RestaurantTypeSelector;
