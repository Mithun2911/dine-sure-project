
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Restaurant, RestaurantTable } from '@/types/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onBookTable: (
    restaurantName: string, 
    tableNumber: number, 
    selectedTime: string, 
    selectedCapacity: string, 
    isVeg: boolean
  ) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onBookTable }) => {
  const [selectedCapacities, setSelectedCapacities] = React.useState<Record<number, string>>({});
  const [selectedTimes, setSelectedTimes] = React.useState<Record<number, string>>({});

  const handleCapacityChange = (tableNumber: number, capacity: string) => {
    setSelectedCapacities({
      ...selectedCapacities,
      [tableNumber]: capacity
    });
  };

  const handleTimeChange = (tableNumber: number, time: string) => {
    setSelectedTimes({
      ...selectedTimes,
      [tableNumber]: time
    });
  };

  const handleBookTable = (table: RestaurantTable) => {
    const capacity = selectedCapacities[table.number] || '';
    const time = selectedTimes[table.number] || '';
    
    if (!capacity) {
      alert('Please select capacity');
      return;
    }
    
    if (!time) {
      alert('Please select a time slot');
      return;
    }
    
    onBookTable(restaurant.name, table.number, time, capacity, restaurant.isVeg);
  };

  // Generate time slots from 11:00 to 22:30
  const timeSlots = [];
  for (let hour = 11; hour <= 22; hour++) {
    timeSlots.push(`${hour}:00`);
    timeSlots.push(`${hour}:30`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <Card className="overflow-hidden bg-white/10 backdrop-blur-md border border-white/20">
        <CardHeader className="bg-brand-gold/90 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{restaurant.name}</CardTitle>
            <Badge variant={restaurant.isVeg ? "outline" : "default"} className={restaurant.isVeg ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
              {restaurant.isVeg ? "Vegetarian" : "Non-Vegetarian"}
            </Badge>
          </div>
          <p className="text-white/90 mt-1">Cuisine: {restaurant.cuisine}</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Table</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurant.tables.map((table) => (
                  <TableRow 
                    key={`${restaurant.name}-table-${table.number}`}
                    className={table.status === 'Booked' ? 'bg-red-50/20' : 'bg-green-50/20'}
                  >
                    <TableCell className="font-medium">{table.number}</TableCell>
                    <TableCell>
                      <Select
                        disabled={table.status === 'Booked'}
                        onValueChange={(value) => handleCapacityChange(table.number, value)}
                        value={selectedCapacities[table.number] || ''}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Capacity" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Person' : 'People'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${
                          table.status === 'Available' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        disabled={table.status === 'Booked'}
                        onValueChange={(value) => handleTimeChange(table.number, value)}
                        value={selectedTimes[table.number] || ''}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleBookTable(table)}
                        disabled={table.status === 'Booked'}
                        className={table.status === 'Booked' 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-brand-gold hover:bg-brand-gold/90 text-white'}
                        size="sm"
                      >
                        {table.status === 'Booked' ? 'Booked' : 'Book Now'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RestaurantCard;
