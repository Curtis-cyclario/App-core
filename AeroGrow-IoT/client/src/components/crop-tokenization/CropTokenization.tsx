import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Leaf, 
  Sprout, 
  Filter, 
  BarChart3, 
  Plus, 
  Search, 
  X, 
  PlusCircle, 
  Layers, 
  Tag, 
  Share2, 
  Dna, 
  Clock,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { CropTokenizationData, CropTokenStatus, Tower } from '@shared/schema';
import CropTokenCard from './CropTokenCard';

// Mock data for crop tokens
const generateMockCropTokens = (): CropTokenizationData[] => {
  const plantTypes = ['Basil', 'Lettuce', 'Spinach', 'Kale', 'Arugula', 'Mint'];
  const plantVarieties: Record<string, string[]> = {
    'Basil': ['Sweet Basil', 'Thai Basil', 'Purple Basil', 'Genovese Basil'],
    'Lettuce': ['Butterhead', 'Romaine', 'Iceberg', 'Oak Leaf'],
    'Spinach': ['Savoy', 'Semi-Savoy', 'Flat Leaf', 'Baby Spinach'],
    'Kale': ['Curly', 'Lacinato', 'Red Russian', 'Redbor'],
    'Arugula': ['Wild Rocket', 'Garden Rocket', 'Italian Rocket', 'Astro'],
    'Mint': ['Peppermint', 'Spearmint', 'Chocolate Mint', 'Apple Mint']
  };
  const statuses: CropTokenStatus[] = ['planted', 'growing', 'harvested', 'processed', 'sold'];
  const owners = ['VertiGrow', 'FarmCoop', 'GreenHarvest', 'OrganicMarket', 'FoodChain'];
  const certifications = ['Organic', 'Non-GMO', 'Pesticide-Free', 'Carbon Neutral', 'Water Efficient', 'Fair Trade'];
  
  const mockTokens: CropTokenizationData[] = [];
  
  // Generate 15 tokens
  for (let i = 0; i < 15; i++) {
    const plantType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
    const plantVariety = plantVarieties[plantType][Math.floor(Math.random() * plantVarieties[plantType].length)];
    const status = statuses[Math.floor(Math.random() * 3)]; // Bias towards growing
    const tokenId = `tk-${i.toString().padStart(4, '0')}-${Math.random().toString(36).substring(2, 8)}`;
    const plantedDate = new Date();
    plantedDate.setDate(plantedDate.getDate() - Math.floor(Math.random() * 60) - 10); // 10-70 days ago
    
    const harvestDate = status === 'harvested' || status === 'processed' || status === 'sold' 
      ? new Date(plantedDate.getTime() + (Math.floor(Math.random() * 20) + 40) * 24 * 60 * 60 * 1000) 
      : undefined;
      
    // Tower IDs from 1-10 for demo purposes
    const towerIds = [Math.floor(Math.random() * 10) + 1];
    if (Math.random() > 0.7) {
      towerIds.push(Math.floor(Math.random() * 10) + 1);
    }
    
    // Growth metrics - one per week from planting
    const growthMetrics = [];
    const weeksPassed = Math.floor((new Date().getTime() - plantedDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    for (let week = 0; week <= weeksPassed; week++) {
      const metricDate = new Date(plantedDate.getTime() + week * 7 * 24 * 60 * 60 * 1000);
      growthMetrics.push({
        timestamp: metricDate.toISOString(),
        height: Math.floor(week * 2.5 + Math.random() * 5), // Height increases with time
        leafCount: Math.floor(week * 3 + Math.random() * 6), // Leaf count increases with time
        stemDiameter: Math.floor(week * 0.5 + Math.random() * 2) / 10, // Diameter increases with time
        healthScore: Math.floor(85 + Math.random() * 15), // Usually high health score
        notes: week === 0 ? "Planted" : week === weeksPassed ? "Current" : ""
      });
    }
    
    // Random selections of certifications
    const tokenCertifications: string[] = [];
    const certCount = Math.floor(Math.random() * 3) + 1;
    for (let c = 0; c < certCount; c++) {
      const cert = certifications[Math.floor(Math.random() * certifications.length)];
      if (!tokenCertifications.includes(cert)) {
        tokenCertifications.push(cert);
      }
    }
    
    // Quality score between 70-100
    const qualityScore = Math.floor(Math.random() * 30) + 70;
    
    // Market value $5-$20 based on quality
    const marketValue = 5 + (qualityScore - 70) / 30 * 15 + Math.random() * 2;
    
    mockTokens.push({
      id: `id-${tokenId}`,
      tokenId,
      plantType,
      plantVariety,
      plantedDate: plantedDate.toISOString(),
      harvestDate: harvestDate?.toISOString(),
      towerIds,
      batchId: `batch-${Math.floor(Math.random() * 100)}`,
      status,
      nutritionalProfile: {
        vitamins: {
          'A': Math.floor(Math.random() * 100),
          'C': Math.floor(Math.random() * 100),
          'K': Math.floor(Math.random() * 100)
        },
        minerals: {
          'Calcium': Math.floor(Math.random() * 100),
          'Iron': Math.floor(Math.random() * 100),
          'Magnesium': Math.floor(Math.random() * 100)
        },
        protein: Math.floor(Math.random() * 10),
        fiber: Math.floor(Math.random() * 10),
        antioxidants: Math.floor(Math.random() * 100),
        otherNutrients: {}
      },
      growthMetrics,
      qualityScore,
      carbonFootprint: Math.floor(Math.random() * 20) + 10,
      waterUsage: Math.floor(Math.random() * 50) + 20,
      energyUsage: Math.floor(Math.random() * 30) + 10,
      blockchainRecordIds: [`br-${tokenId}-1`, `br-${tokenId}-2`],
      ownershipHistory: [
        {
          timestamp: plantedDate.toISOString(),
          owner: 'VertiGrow',
          transactionId: `tx-${Math.random().toString(36).substring(2, 10)}`
        },
        ...(status === 'sold' ? [{
          timestamp: harvestDate!.toISOString(),
          owner: owners[Math.floor(Math.random() * owners.length)],
          transactionId: `tx-${Math.random().toString(36).substring(2, 10)}`,
          price: marketValue
        }] : [])
      ],
      certifications: tokenCertifications,
      imageUrls: [
        plantType === 'Basil' ? 'https://images.unsplash.com/photo-1601598851547-4302969d0614?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' :
        plantType === 'Lettuce' ? 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80' :
        plantType === 'Spinach' ? 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80' :
        plantType === 'Kale' ? 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80' :
        plantType === 'Arugula' ? 'https://images.unsplash.com/photo-1506073881649-4e23be3e9ed0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' :
        'https://images.unsplash.com/photo-1563053476-10e069f6b3c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      ],
      marketValue,
      currentOwner: status === 'sold' ? 
        owners[Math.floor(Math.random() * owners.length)] : 
        'VertiGrow'
    });
  }
  
  return mockTokens;
};

interface CropTokenizationProps {
  towers?: Tower[];
}

const CropTokenization: React.FC<CropTokenizationProps> = ({ towers = [] }) => {
  const [tokens] = useState<CropTokenizationData[]>(generateMockCropTokens());
  const [selectedToken, setSelectedToken] = useState<CropTokenizationData | null>(null);
  const [tokenDetailsOpen, setTokenDetailsOpen] = useState<boolean>(false);
  const [filterByTower, setFilterByTower] = useState<number | null>(null);
  const [filterByStatus, setFilterByStatus] = useState<CropTokenStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter tokens based on search query, tower id and status
  const filteredTokens = tokens.filter(token => {
    const matchesSearch = searchQuery === '' || 
      token.plantType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.plantVariety.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.tokenId.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTowerId = filterByTower === null || token.towerIds.includes(filterByTower);
    
    const matchesStatus = filterByStatus === null || token.status === filterByStatus;
    
    return matchesSearch && matchesTowerId && matchesStatus;
  });
  
  // Group tokens by status
  const groupedTokens: Record<CropTokenStatus, CropTokenizationData[]> = {
    'planted': [],
    'growing': [],
    'harvested': [],
    'processed': [],
    'sold': []
  };
  
  filteredTokens.forEach(token => {
    groupedTokens[token.status].push(token);
  });
  
  // Handle token click to open details
  const handleTokenClick = (token: CropTokenizationData) => {
    setSelectedToken(token);
    setTokenDetailsOpen(true);
  };
  
  // Total counts
  const totalTokens = tokens.length;
  const activeTokens = tokens.filter(t => t.status === 'planted' || t.status === 'growing').length;
  const harvestedTokens = tokens.filter(t => t.status === 'harvested' || t.status === 'processed').length;
  const soldTokens = tokens.filter(t => t.status === 'sold').length;

  return (
    <div>
      {/* Futuristic Tab Navigation with Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-opacity-80 backdrop-blur-sm border border-green-100 dark:border-green-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{totalTokens}</div>
              <div className="text-sm text-muted-foreground">Total Tokens</div>
            </div>
            <div className="h-12 w-12 bg-primary-50 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Dna className="h-6 w-6 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-opacity-80 backdrop-blur-sm border border-blue-100 dark:border-blue-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{activeTokens}</div>
              <div className="text-sm text-muted-foreground">Growing</div>
            </div>
            <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Sprout className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-opacity-80 backdrop-blur-sm border border-amber-100 dark:border-amber-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{harvestedTokens}</div>
              <div className="text-sm text-muted-foreground">Harvested</div>
            </div>
            <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900 rounded-full flex items-center justify-center">
              <Leaf className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-opacity-80 backdrop-blur-sm border border-purple-100 dark:border-purple-900">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{soldTokens}</div>
              <div className="text-sm text-muted-foreground">Sold</div>
            </div>
            <div className="h-12 w-12 bg-purple-50 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <CreditCardIcon className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tokens by type, variety, or ID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={filterByStatus === null ? "default" : "outline"}
            onClick={() => setFilterByStatus(null)}
            className="text-xs whitespace-nowrap"
          >
            All
          </Button>
          <Button 
            variant={filterByStatus === 'planted' ? "default" : "outline"}
            onClick={() => setFilterByStatus('planted')}
            className="text-xs whitespace-nowrap"
          >
            Planted
          </Button>
          <Button 
            variant={filterByStatus === 'growing' ? "default" : "outline"}
            onClick={() => setFilterByStatus('growing')}
            className="text-xs whitespace-nowrap"
          >
            Growing
          </Button>
          <Button 
            variant={filterByStatus === 'harvested' ? "default" : "outline"}
            onClick={() => setFilterByStatus('harvested')}
            className="text-xs whitespace-nowrap"
          >
            Harvested
          </Button>
        </div>
      </div>

      {/* Token grid with futuristic styles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTokens.map(token => (
          <CropTokenCard 
            key={token.id} 
            tokenData={token} 
            onClick={() => handleTokenClick(token)}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {filteredTokens.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Sprout className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tokens found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-center mt-2 max-w-md">
            {searchQuery 
              ? "No tokens match your search criteria. Try adjusting your filters." 
              : "Start by creating a new crop token to track its growth journey."}
          </p>
          {searchQuery && (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setFilterByStatus(null);
              }}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </div>
      )}

      {/* Floating Create Button */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-10" size="icon">
            <PlusCircle className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Crop Token</DialogTitle>
            <DialogDescription>
              Create a new tokenized record for tracking a plant from seed to sale.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Create Token Form would go here */}
            <p className="text-amber-600 dark:text-amber-400">
              This feature is coming soon. Token creation requires integration with blockchain services.
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline">Cancel</Button>
            <Button type="button" disabled>Create Token</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CropTokenization;