import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { DemoButton } from '@/components/ui/demo-button';
import { 
  Leaf, 
  MapPin, 
  Calendar,
  Star,
  Heart,
  MessageCircle,
  DollarSign
} from 'lucide-react';

interface PlantListing {
  id: number;
  title: string;
  description: string;
  plantType: string;
  variety: string;
  age: string;
  condition: 'excellent' | 'good' | 'fair';
  location: string;
  price?: number;
  tradeOnly: boolean;
  wantedPlants: string[];
  sellerId: number;
  sellerName: string;
  sellerRating: number;
  createdAt: string;
  status: 'available' | 'pending' | 'sold' | 'traded';
  likes: number;
  views: number;
}

interface PlantListingCardProps {
  listing: PlantListing;
  onClick: () => void;
}

const PlantListingCard: React.FC<PlantListingCardProps> = ({ listing, onClick }) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'fair': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'sold': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'traded': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <motion.div
      className="group organic-card cursor-pointer overflow-hidden h-full"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Plant Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="h-16 w-16 text-emerald-400/60 group-hover:text-emerald-400 transition-colors duration-300" />
        </div>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge className={getStatusColor(listing.status)}>
            {listing.status}
          </Badge>
        </div>

        {/* Likes indicator */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
          <Heart className="h-3 w-3 text-red-400" />
          <span className="text-xs text-white">{listing.likes}</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-white text-sm leading-tight group-hover:text-emerald-300 transition-colors duration-300">
              {listing.title}
            </h3>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              {listing.plantType}
            </Badge>
            <Badge className={getConditionColor(listing.condition)}>
              {listing.condition}
            </Badge>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">
          {listing.description}
        </p>

        {/* Plant details */}
        <div className="space-y-1">
          <div className="text-xs text-emerald-300 font-medium">{listing.variety}</div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{listing.age}</span>
            </div>
          </div>
        </div>

        {/* Seller info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {listing.sellerName.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-xs font-medium text-white">{listing.sellerName}</div>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-300">{listing.sellerRating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price/Trade section */}
        <div className="border-t border-gray-700 pt-3">
          {listing.tradeOnly ? (
            <div className="space-y-2">
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                Trade Only
              </Badge>
              <div className="text-xs text-gray-400">
                Wants: {listing.wantedPlants.slice(0, 2).join(', ')}
                {listing.wantedPlants.length > 2 && '...'}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-emerald-400 flex items-center">
                <DollarSign className="h-4 w-4" />
                {listing.price}
              </div>
              <DemoButton 
                size="sm" 
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 text-xs rounded-lg transition-all duration-300"
                demoText="Contact feature coming soon!"
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                Contact
              </DemoButton>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PlantListingCard;