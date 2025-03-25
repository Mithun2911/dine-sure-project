
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '@/types/restaurant';

interface RestaurantListProps {
  restaurants: Restaurant[];
  onBack: () => void;
  onBookTable: (
    restaurantName: string, 
    tableNumber: number, 
    selectedTime: string, 
    selectedCapacity: string, 
    isVeg: boolean
  ) => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({
  restaurants,
  onBack,
  onBookTable
}) => {
  return (
    <motion.div 
      className="container max-w-5xl mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-8">
        <Button 
          onClick={onBack}
          variant="outline"
          className="bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
        >
          ← Back
        </Button>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white">Nearby Restaurants</h2>
      </div>
      
      {restaurants.length === 0 ? (
        <div className="text-center p-8 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <p className="text-white text-xl">No restaurants found.</p>
        </div>
      ) : (
        restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onBookTable={onBookTable}
          />
        ))
      )}
    </motion.div>
  );
};

export default RestaurantList;
