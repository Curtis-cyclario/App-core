import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PlantIcon from '@/components/icons/PlantIcon';
import CropTokenization from '@/components/crop-tokenization/CropTokenization';
import { apiRequest } from '@/lib/queryClient';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Droplet, 
  Sun, 
  ThermometerSun,
  Clock,
  Calendar,
  TrendingUp,
  BellRing,
  Building2,
  Layers,
  Filter
} from 'lucide-react';

// Define tower information
interface Tower {
  id: number;
  name: string;
  capacity: number;
  location: string;
  status: string;
}

// Define plant genetics data structure
interface Plant {
  id: number;
  name: string;
  species: string;
  strain: string;
  growthStage: string;
  growthProgress: number;
  plantedDate: string;
  harvestDate?: string;
  optimalTemp: string;
  optimalHumidity: string;
  optimalLight: string;
  towerId: number;
  towerPosition?: number;
  imageUrl?: string;
  description: string;
  nutritionalValue?: string;
  yieldEstimate?: string;
  healthStatus?: string;
}

// Sample tower data
const sampleTowers: Tower[] = [
  { id: 1, name: 'Tower 1', capacity: 8, location: 'Section A', status: 'active' },
  { id: 2, name: 'Tower 2', capacity: 8, location: 'Section A', status: 'active' },
  { id: 3, name: 'Tower 3', capacity: 8, location: 'Section B', status: 'active' },
  { id: 4, name: 'Tower 4', capacity: 8, location: 'Section B', status: 'active' },
  { id: 5, name: 'Tower 5', capacity: 8, location: 'Section C', status: 'active' },
  { id: 6, name: 'Tower 6', capacity: 8, location: 'Section C', status: 'maintenance' },
  { id: 7, name: 'Tower 7', capacity: 8, location: 'Section D', status: 'active' },
  { id: 8, name: 'Tower 8', capacity: 8, location: 'Section D', status: 'active' },
  { id: 9, name: 'Tower 9', capacity: 8, location: 'Section E', status: 'active' },
  { id: 10, name: 'Tower 10', capacity: 8, location: 'Section E', status: 'inactive' }
];

// Sample plant data for all 10 towers
const samplePlants: Plant[] = [
  // Tower 1 plants
  {
    id: 1,
    name: 'Basil Alpha',
    species: 'Ocimum basilicum',
    strain: 'Sweet Genovese',
    growthStage: 'Vegetative',
    growthProgress: 65,
    plantedDate: '2025-05-01',
    harvestDate: '2025-05-21',
    optimalTemp: '20-25°C',
    optimalHumidity: '60-70%',
    optimalLight: '12-16 hrs',
    towerId: 1,
    towerPosition: 1,
    nutritionalValue: 'High in vitamin K, manganese, iron, calcium',
    yieldEstimate: '200g per plant',
    healthStatus: 'Excellent',
    description: 'Sweet basil variety with large leaves, ideal for culinary use. High essential oil content.'
  },
  {
    id: 2,
    name: 'Cilantro Prime',
    species: 'Coriandrum sativum',
    strain: 'Calypso',
    growthStage: 'Mature',
    growthProgress: 90,
    plantedDate: '2025-04-15',
    harvestDate: '2025-05-15',
    optimalTemp: '18-24°C',
    optimalHumidity: '50-70%',
    optimalLight: '14-16 hrs',
    towerId: 1,
    towerPosition: 2,
    nutritionalValue: 'Rich in vitamins A, C, K and minerals',
    yieldEstimate: '150g per plant',
    healthStatus: 'Good',
    description: 'Slow-bolting cilantro variety with excellent flavor profile and aroma. Disease resistant.'
  },
  
  // Tower 2 plants
  {
    id: 3,
    name: 'Lettuce Beta',
    species: 'Lactuca sativa',
    strain: 'Butterhead',
    growthStage: 'Harvest Ready',
    growthProgress: 100,
    plantedDate: '2025-04-10',
    harvestDate: '2025-05-14',
    optimalTemp: '15-20°C',
    optimalHumidity: '60-80%',
    optimalLight: '10-12 hrs',
    towerId: 2,
    towerPosition: 1,
    nutritionalValue: 'Good source of vitamin A, K and folate',
    yieldEstimate: '250g per head',
    healthStatus: 'Excellent',
    description: 'Butterhead lettuce with tender, buttery leaves. High vitamin A and K content.'
  },
  {
    id: 4,
    name: 'Spinach Gamma',
    species: 'Spinacia oleracea',
    strain: 'Bloomsdale',
    growthStage: 'Seedling',
    growthProgress: 25,
    plantedDate: '2025-05-05',
    optimalTemp: '15-18°C',
    optimalHumidity: '50-70%',
    optimalLight: '10-14 hrs',
    towerId: 2,
    towerPosition: 2,
    nutritionalValue: 'Extremely high in iron, vitamins A, C',
    yieldEstimate: '180g per plant',
    healthStatus: 'Moderate - minor pest issue',
    description: 'Slow-bolting spinach variety with savoy leaves. High iron and nutrient density.'
  },
  
  // Tower 3 plants
  {
    id: 5,
    name: 'Kale Delta',
    species: 'Brassica oleracea',
    strain: 'Lacinato',
    growthStage: 'Mature',
    growthProgress: 85,
    plantedDate: '2025-04-15',
    harvestDate: '2025-05-25',
    optimalTemp: '15-20°C',
    optimalHumidity: '50-70%',
    optimalLight: '10-14 hrs',
    towerId: 3,
    towerPosition: 1,
    nutritionalValue: 'Very high in vitamins K, A, C and antioxidants',
    yieldEstimate: '300g per plant',
    healthStatus: 'Excellent',
    description: 'Italian kale variety with dark blue-green leaves. Excellent cold tolerance.'
  },
  {
    id: 6,
    name: 'Mint Epsilon',
    species: 'Mentha spicata',
    strain: 'Spearmint',
    growthStage: 'Vegetative',
    growthProgress: 70,
    plantedDate: '2025-04-20',
    harvestDate: '2025-05-30',
    optimalTemp: '18-24°C',
    optimalHumidity: '65-75%',
    optimalLight: '12-16 hrs',
    towerId: 3,
    towerPosition: 2,
    nutritionalValue: 'Contains menthol, vitamins A and C',
    yieldEstimate: '120g per plant',
    healthStatus: 'Excellent',
    description: 'Fast-growing, aromatic mint variety with high essential oil content. Excellent for teas and garnishes.'
  },
  
  // Tower 4 plants
  {
    id: 7,
    name: 'Arugula Zeta',
    species: 'Eruca vesicaria',
    strain: 'Rocket',
    growthStage: 'Vegetative',
    growthProgress: 60,
    plantedDate: '2025-04-25',
    harvestDate: '2025-05-20',
    optimalTemp: '15-18°C',
    optimalHumidity: '50-70%',
    optimalLight: '10-14 hrs',
    towerId: 4,
    towerPosition: 1,
    nutritionalValue: 'Rich in calcium, vitamin K, and antioxidants',
    yieldEstimate: '150g per plant',
    healthStatus: 'Good',
    description: 'Peppery-flavored arugula with characteristic serrated leaves. Fast growing with excellent yield.'
  },
  {
    id: 8,
    name: 'Bok Choy Eta',
    species: 'Brassica rapa',
    strain: 'Shanghai',
    growthStage: 'Seedling',
    growthProgress: 30,
    plantedDate: '2025-05-04',
    harvestDate: '2025-06-04',
    optimalTemp: '15-22°C',
    optimalHumidity: '60-70%',
    optimalLight: '12-16 hrs',
    towerId: 4,
    towerPosition: 2,
    nutritionalValue: 'High in vitamins A, C and calcium',
    yieldEstimate: '220g per plant',
    healthStatus: 'Good',
    description: 'Compact Asian green with tender stalks and crisp leaves. Fast growing with high yield potential.'
  },
  
  // Tower 5 plants
  {
    id: 9,
    name: 'Parsley Theta',
    species: 'Petroselinum crispum',
    strain: 'Italian Flat Leaf',
    growthStage: 'Vegetative',
    growthProgress: 55,
    plantedDate: '2025-04-28',
    harvestDate: '2025-06-15',
    optimalTemp: '15-20°C',
    optimalHumidity: '60-70%',
    optimalLight: '10-14 hrs',
    towerId: 5,
    towerPosition: 1,
    nutritionalValue: 'Exceptional source of vitamin K and C',
    yieldEstimate: '110g per plant',
    healthStatus: 'Excellent',
    description: 'Flat-leaf parsley with robust flavor and higher yield than curly varieties. Drought tolerant.'
  },
  {
    id: 10,
    name: 'Microgreens Mix',
    species: 'Various',
    strain: 'Gourmet Blend',
    growthStage: 'Seedling',
    growthProgress: 40,
    plantedDate: '2025-05-08',
    harvestDate: '2025-05-18',
    optimalTemp: '18-22°C',
    optimalHumidity: '50-70%',
    optimalLight: '12-16 hrs',
    towerId: 5,
    towerPosition: 3,
    nutritionalValue: 'Extremely high nutrient density, varies by variety',
    yieldEstimate: '200g per tray',
    healthStatus: 'Excellent',
    description: 'Premium mix of microgreens including radish, broccoli, mustard, and amaranth. Harvested at cotyledon stage.'
  },
  
  // Remaining towers would have more plants in a full implementation
  {
    id: 11,
    name: 'Strawberry Alpha',
    species: 'Fragaria × ananassa',
    strain: 'Alpine',
    growthStage: 'Flowering',
    growthProgress: 75,
    plantedDate: '2025-03-15',
    harvestDate: '2025-06-01',
    optimalTemp: '18-24°C',
    optimalHumidity: '65-75%',
    optimalLight: '14-16 hrs',
    towerId: 7,
    towerPosition: 1,
    nutritionalValue: 'Rich in vitamin C and antioxidants',
    yieldEstimate: '250g per plant',
    healthStatus: 'Excellent',
    description: 'Compact, everbearing strawberry variety ideal for vertical systems. Sweet, aromatic berries with extended harvest period.'
  }
];

// Component for displaying plants and tower information
const Plants = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [selectedTower, setSelectedTower] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'growthProgress' | 'plantedDate'>('name');
  const [loading, setLoading] = useState(false);

  // Filter plants based on active tab, selected tower, and search term
  const filteredPlants = samplePlants.filter(plant => {
    // Filter by tab
    if (activeTab === 'current' && plant.growthProgress >= 100) return false;
    if (activeTab === 'harvest-ready' && plant.growthProgress < 100) return false;
    
    // Filter by tower if one is selected
    if (selectedTower !== null && plant.towerId !== selectedTower) return false;
    
    // Filter by search term if provided
    if (searchTerm && !plant.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !plant.species.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !plant.strain.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Sort the filtered plants
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'growthProgress') {
      return b.growthProgress - a.growthProgress;
    } else if (sortBy === 'plantedDate') {
      return new Date(b.plantedDate).getTime() - new Date(a.plantedDate).getTime();
    }
    return 0;
  });
  
  // Group plants by tower for tower-based view
  const plantsByTower = sampleTowers.map(tower => {
    const towerPlants = samplePlants.filter(plant => plant.towerId === tower.id);
    return {
      tower,
      plants: towerPlants
    };
  });

  // Get badge color based on growth stage
  const getGrowthStageBadge = (stage: string) => {
    switch (stage.toLowerCase()) {
      case 'seedling':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'vegetative':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'flowering':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'mature':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'harvest ready':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  
  // Get tower status badge color
  const getTowerStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedTower(null);
    setSearchTerm('');
    setSortBy('name');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 plants-dashboard">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
          <Leaf className="h-6 w-6 mr-2 text-green-600 dark:text-green-500" />
          Plants
        </h1>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search plants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            )}
          </div>
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="growthProgress">Growth Progress</SelectItem>
              <SelectItem value="plantedDate">Planting Date</SelectItem>
            </SelectContent>
          </Select>
          {(selectedTower !== null || searchTerm || sortBy !== 'name') && (
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          )}
        </div>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 border-[10px] border-transparent p-2 flex flex-wrap justify-center gap-3">
          <TabsTrigger value="all" className="m-[10px]">All Plants</TabsTrigger>
          <TabsTrigger value="current" className="m-[10px]">Growing</TabsTrigger>
          <TabsTrigger value="harvest-ready" className="m-[10px]">Harvest Ready</TabsTrigger>
          <TabsTrigger value="towers" className="m-[10px]">By Tower</TabsTrigger>
          <TabsTrigger value="history" className="m-[10px]">Growth History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-[10px]">
          <CropTokenization />
        </TabsContent>
        
        <TabsContent value="towers" className="mt-[10px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {sampleTowers.map(tower => (
              <Card 
                key={tower.id}
                className={`hover:shadow-md transition-all cursor-pointer border-2 ${selectedTower === tower.id ? 'border-blue-500 dark:border-blue-400' : 'border-transparent'}`}
                onClick={() => setSelectedTower(selectedTower === tower.id ? null : tower.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                        <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                        {tower.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Location: {tower.location}
                      </CardDescription>
                    </div>
                    <Badge className={getTowerStatusBadge(tower.status)}>
                      {tower.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <span className="font-medium">Capacity:</span> {tower.capacity} plants
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {plantsByTower.find(t => t.tower.id === tower.id)?.plants.map(plant => (
                      <Badge 
                        key={plant.id} 
                        variant="outline" 
                        className={`${getGrowthStageBadge(plant.growthStage)} cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlant(plant);
                        }}
                      >
                        {plant.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex justify-between w-full">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {plantsByTower.find(t => t.tower.id === tower.id)?.plants.length || 0} plants
                    </div>
                    <Button variant="link" className="p-0 h-auto" onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTower(tower.id);
                      setActiveTab('all');
                    }}>
                      View Plants
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value={activeTab !== 'history' && activeTab !== 'towers' ? activeTab : ''} className="mt-[10px]">
          {selectedTower && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Viewing plants in {sampleTowers.find(t => t.id === selectedTower)?.name}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTower(null)}>
                View All Towers
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 plants-charts">
            {sortedPlants.length === 0 ? (
              <div className="col-span-3 py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Leaf className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg">No plants match your filter criteria</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              sortedPlants.map(plant => (
                <motion.div
                  key={plant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
                    onClick={() => setSelectedPlant(plant)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
                            {plant.name}
                          </CardTitle>
                          <CardDescription className="text-sm italic">
                            {plant.species}
                          </CardDescription>
                        </div>
                        <Badge className={getGrowthStageBadge(plant.growthStage)}>
                          {plant.growthStage}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="py-2 flex-1">
                      <div className="flex items-center mb-2">
                        <PlantIcon className="h-10 w-10 text-green-600 dark:text-green-400 mr-2" />
                        <div className="flex-1">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Growth Progress
                          </div>
                          <Progress value={plant.growthProgress} className="h-2" />
                          <div className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                            {plant.growthProgress}%
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Planted: {formatDate(plant.plantedDate)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Tower: {sampleTowers.find(t => t.id === plant.towerId)?.name}
                          </span>
                        </div>
                      </div>
                      {plant.healthStatus && (
                        <div className="mt-3 text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Health:</span>
                          <span className={`ml-1 ${
                            plant.healthStatus.toLowerCase().includes('excellent') ? 'text-green-600 dark:text-green-400' :
                            plant.healthStatus.toLowerCase().includes('good') ? 'text-blue-600 dark:text-blue-400' :
                            'text-yellow-600 dark:text-yellow-400'
                          }`}>
                            {plant.healthStatus}
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 mt-auto">
                      <Button 
                        variant="link" 
                        className="p-0 h-auto border-[10px] border-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlant(plant);
                        }}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Plant Details Dialog */}
      {selectedPlant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl font-medium text-gray-900 dark:text-white">
                    {selectedPlant.name}
                  </CardTitle>
                  <CardDescription className="text-sm italic">
                    {selectedPlant.species} ({selectedPlant.strain})
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPlant(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Growth Status</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    <Badge className={getGrowthStageBadge(selectedPlant.growthStage)}>
                      {selectedPlant.growthStage}
                    </Badge>
                    <div className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                      {selectedPlant.growthProgress}% Complete
                    </div>
                  </div>
                  <Progress value={selectedPlant.growthProgress} className="h-2 mb-4" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Planted Date</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedPlant.plantedDate)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Est. Harvest</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(selectedPlant.harvestDate)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Description</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedPlant.description}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tower Information</h3>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {sampleTowers.find(t => t.id === selectedPlant.towerId)?.name} - Position {selectedPlant.towerPosition || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Optimal Conditions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <ThermometerSun className="h-8 w-8 text-blue-500 mr-3" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Temperature</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedPlant.optimalTemp}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Droplet className="h-8 w-8 text-blue-500 mr-3" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedPlant.optimalHumidity}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <Sun className="h-8 w-8 text-yellow-500 mr-3" />
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Light Cycle</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedPlant.optimalLight}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {selectedPlant.nutritionalValue && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nutritional Information</h3>
                  <p className="text-gray-700 dark:text-gray-300 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    {selectedPlant.nutritionalValue}
                  </p>
                </div>
              )}
              
              {selectedPlant.yieldEstimate && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Yield Estimate</h3>
                  <div className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Leaf className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-gray-700 dark:text-gray-300">{selectedPlant.yieldEstimate}</p>
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Growth Analytics</h3>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center justify-center h-48">
                  <div className="text-gray-500 dark:text-gray-400 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth chart visualization placeholder
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                <BellRing className="h-4 w-4 mr-2" />
                Set Alerts
              </Button>
              <Button>
                <Leaf className="h-4 w-4 mr-2" />
                Update Growth
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Plants;
