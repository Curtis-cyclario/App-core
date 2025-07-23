import React, { useState } from 'react';
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
import PlantIcon from '@/components/icons/PlantIcon';
import CropTokenization from '@/components/crop-tokenization/CropTokenization';
import { 
  Leaf, 
  Droplet, 
  Sun, 
  ThermometerSun,
  Clock,
  Calendar,
  TrendingUp,
  BellRing
} from 'lucide-react';

// Define plant genetics data structure
interface PlantGenetics {
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
  imageUrl?: string;
  description: string;
}

// Sample plant data
const samplePlants: PlantGenetics[] = [
  {
    id: 1,
    name: 'Basil Alpha',
    species: 'Ocimum basilicum',
    strain: 'Sweet Genovese',
    growthStage: 'Vegetative',
    growthProgress: 65,
    plantedDate: '2023-05-15',
    harvestDate: '2023-06-30',
    optimalTemp: '20-25°C',
    optimalHumidity: '60-70%',
    optimalLight: '12-16 hrs',
    description: 'Sweet basil variety with large leaves, ideal for culinary use. High essential oil content.'
  },
  {
    id: 2,
    name: 'Lettuce Beta',
    species: 'Lactuca sativa',
    strain: 'Butterhead',
    growthStage: 'Harvest Ready',
    growthProgress: 100,
    plantedDate: '2023-05-01',
    harvestDate: '2023-06-10',
    optimalTemp: '15-20°C',
    optimalHumidity: '60-80%',
    optimalLight: '10-12 hrs',
    description: 'Butterhead lettuce with tender, buttery leaves. High vitamin A and K content.'
  },
  {
    id: 3,
    name: 'Spinach Gamma',
    species: 'Spinacia oleracea',
    strain: 'Bloomsdale',
    growthStage: 'Seedling',
    growthProgress: 25,
    plantedDate: '2023-06-01',
    optimalTemp: '15-18°C',
    optimalHumidity: '50-70%',
    optimalLight: '10-14 hrs',
    description: 'Slow-bolting spinach variety with savoy leaves. High iron and nutrient density.'
  },
  {
    id: 4,
    name: 'Kale Delta',
    species: 'Brassica oleracea',
    strain: 'Lacinato',
    growthStage: 'Mature',
    growthProgress: 85,
    plantedDate: '2023-04-15',
    harvestDate: '2023-06-25',
    optimalTemp: '15-20°C',
    optimalHumidity: '50-70%',
    optimalLight: '10-14 hrs',
    description: 'Italian kale variety with dark blue-green leaves. Excellent cold tolerance.'
  }
];

// Component for displaying the genetic history of plants
const PlantGenetics = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedPlant, setSelectedPlant] = useState<PlantGenetics | null>(null);

  // Filter plants based on active tab
  const filteredPlants = samplePlants.filter(plant => {
    if (activeTab === 'current') {
      return plant.growthProgress < 100;
    } else if (activeTab === 'harvest-ready') {
      return plant.growthProgress >= 100;
    }
    return true;
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

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Plant Genetics</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Plants</TabsTrigger>
          <TabsTrigger value="current">Current Growth</TabsTrigger>
          <TabsTrigger value="harvest-ready">Harvest Ready</TabsTrigger>
          <TabsTrigger value="history">Growth History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history">
          <CropTokenization />
        </TabsContent>
        
        <TabsContent value={activeTab !== 'history' ? activeTab : ''}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map(plant => (
              <Card 
                key={plant.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
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
                <CardContent className="py-2">
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
                      <ThermometerSun className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Temp: {plant.optimalTemp}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="p-0 h-auto">View Details</Button>
                </CardFooter>
              </Card>
            ))}
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
                <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
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
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Growth Analytics</h3>
                <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg flex items-center justify-center h-48">
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

export default PlantGenetics;
