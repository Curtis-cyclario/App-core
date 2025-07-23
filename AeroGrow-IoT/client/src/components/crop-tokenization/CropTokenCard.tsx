import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Leaf, Droplet, Sun, Sprout as Plant, ShieldCheck, BarChart4, CreditCard as CreditCardIcon, Dna, Clock, Sprout } from 'lucide-react';
import { CropTokenizationData, CropTokenStatus } from '@shared/schema';

interface CropTokenCardProps {
  tokenData: CropTokenizationData;
  onClick?: () => void;
}

const CropTokenCard: React.FC<CropTokenCardProps> = ({ tokenData, onClick }) => {
  // Calculate days since planting
  const plantedDate = new Date(tokenData.plantedDate);
  const currentDate = new Date();
  const daysSincePlanting = Math.floor((currentDate.getTime() - plantedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Get status color
  const getStatusColor = (status: CropTokenStatus): string => {
    switch(status) {
      case 'planted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'growing': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'harvested': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'processed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'sold': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: CropTokenStatus) => {
    switch(status) {
      case 'planted': return <Sprout className="h-4 w-4" />;
      case 'growing': return <Plant className="h-4 w-4" />;
      case 'harvested': return <Leaf className="h-4 w-4" />;
      case 'processed': return <BarChart4 className="h-4 w-4" />;
      case 'sold': return <CreditCardIcon className="h-4 w-4" />;
      default: return <Dna className="h-4 w-4" />;
    }
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden h-full backdrop-blur-sm border border-opacity-30 hover:border-opacity-60 transition-all cursor-pointer"
        onClick={onClick}
      >
        {tokenData.imageUrls && tokenData.imageUrls.length > 0 && (
          <div className="relative h-40 w-full overflow-hidden">
            <img 
              src={tokenData.imageUrls[0]} 
              alt={tokenData.plantVariety}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge className={`${getStatusColor(tokenData.status)} flex items-center gap-1`}>
                {getStatusIcon(tokenData.status)}
                {tokenData.status.charAt(0).toUpperCase() + tokenData.status.slice(1)}
              </Badge>
            </div>
            {tokenData.certifications.length > 0 && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {tokenData.certifications.length} certifications
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>{tokenData.plantVariety}</span>
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400 flex items-center">
              <Dna className="h-3 w-3 mr-1" />
              {tokenData.tokenId.slice(0, 10)}...
            </span>
          </CardTitle>
          <CardDescription>{tokenData.plantType}</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{daysSincePlanting} days</span>
            </div>
            <div className="flex items-center gap-1">
              <Sun className="h-3 w-3 text-amber-500" />
              <span className="text-gray-600 dark:text-gray-400">Quality: {tokenData.qualityScore}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Droplet className="h-3 w-3 text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">{tokenData.waterUsage}L water</span>
            </div>
            <div className="flex items-center gap-1">
              <Plant className="h-3 w-3 text-green-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {tokenData.growthMetrics.length > 0 
                  ? `${tokenData.growthMetrics[tokenData.growthMetrics.length - 1].height}cm`
                  : '0cm'
                }
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-sm font-medium">
            ${tokenData.marketValue.toFixed(2)}
          </div>
          <Button 
            size="sm" 
            variant="ghost"
            className="text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
            }}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CropTokenCard;