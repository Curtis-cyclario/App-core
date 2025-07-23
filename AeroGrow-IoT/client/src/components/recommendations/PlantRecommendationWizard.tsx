import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Thermometer,
  Droplets,
  Sun,
  Calendar,
  TrendingUp,
  Leaf,
  DollarSign,
  Target,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Users,
  Package
} from 'lucide-react';

interface PlantData {
  id: string;
  name: string;
  scientificName: string;
  category: 'leafy-greens' | 'herbs' | 'fruits' | 'microgreens';
  growthTime: number; // days
  optimalTemp: { min: number; max: number };
  optimalHumidity: { min: number; max: number };
  marketPrice: number; // per kg
  yieldPerTower: number; // kg per month
  difficulty: 'easy' | 'moderate' | 'advanced';
  seasonalBonus: string[];
  marketDemand: 'high' | 'medium' | 'low';
  profitMargin: number;
  waterRequirement: 'low' | 'medium' | 'high';
  lightRequirement: 'low' | 'medium' | 'high';
  description: string;
  benefits: string[];
  challenges: string[];
  score?: number;
}

interface EnvironmentalData {
  currentTemp: number;
  currentHumidity: number;
  season: string;
  location: string;
  energyCost: number;
}

interface UserPreferences {
  operation: 'commercial' | 'research' | 'personal';
  experience: 'beginner' | 'intermediate' | 'expert';
  priority: 'profit' | 'yield' | 'sustainability' | 'research';
  budget: 'low' | 'medium' | 'high';
  timeframe: 'short' | 'medium' | 'long';
}

const PlantRecommendationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    operation: 'commercial',
    experience: 'intermediate',
    priority: 'profit',
    budget: 'medium',
    timeframe: 'medium'
  });
  const [environmentalData] = useState<EnvironmentalData>({
    currentTemp: 22.4,
    currentHumidity: 65,
    season: 'spring',
    location: 'temperate',
    energyCost: 0.12 // per kWh
  });
  const [recommendations, setRecommendations] = useState<PlantData[]>([]);
  const [loading, setLoading] = useState(false);

  const plantDatabase: PlantData[] = [
    {
      id: 'lettuce-butterhead',
      name: 'Butterhead Lettuce',
      scientificName: 'Lactuca sativa',
      category: 'leafy-greens',
      growthTime: 35,
      optimalTemp: { min: 18, max: 24 },
      optimalHumidity: { min: 60, max: 70 },
      marketPrice: 8.50,
      yieldPerTower: 12,
      difficulty: 'easy',
      seasonalBonus: ['spring', 'fall'],
      marketDemand: 'high',
      profitMargin: 65,
      waterRequirement: 'low',
      lightRequirement: 'medium',
      description: 'Premium lettuce variety with excellent market value and consistent yields',
      benefits: ['High market demand', 'Fast growth cycle', 'Low maintenance', 'Year-round production'],
      challenges: ['Temperature sensitive', 'Requires consistent lighting']
    },
    {
      id: 'basil-genovese',
      name: 'Genovese Basil',
      scientificName: 'Ocimum basilicum',
      category: 'herbs',
      growthTime: 28,
      optimalTemp: { min: 20, max: 28 },
      optimalHumidity: { min: 50, max: 65 },
      marketPrice: 24.00,
      yieldPerTower: 8,
      difficulty: 'moderate',
      seasonalBonus: ['summer', 'fall'],
      marketDemand: 'high',
      profitMargin: 78,
      waterRequirement: 'medium',
      lightRequirement: 'high',
      description: 'Premium culinary herb with exceptional market value and aroma',
      benefits: ['Highest profit margin', 'Premium market positioning', 'Continuous harvest'],
      challenges: ['Higher light requirements', 'Temperature sensitive', 'Pest management']
    },
    {
      id: 'kale-curly',
      name: 'Curly Kale',
      scientificName: 'Brassica oleracea',
      category: 'leafy-greens',
      growthTime: 45,
      optimalTemp: { min: 15, max: 22 },
      optimalHumidity: { min: 55, max: 70 },
      marketPrice: 12.00,
      yieldPerTower: 15,
      difficulty: 'easy',
      seasonalBonus: ['fall', 'winter'],
      marketDemand: 'high',
      profitMargin: 58,
      waterRequirement: 'medium',
      lightRequirement: 'medium',
      description: 'Nutrient-dense superfood with strong market demand and reliable growth',
      benefits: ['Superfood market appeal', 'Cold tolerance', 'High yields', 'Long shelf life'],
      challenges: ['Longer growth cycle', 'Pest susceptibility']
    },
    {
      id: 'strawberry-alpine',
      name: 'Alpine Strawberry',
      scientificName: 'Fragaria vesca',
      category: 'fruits',
      growthTime: 90,
      optimalTemp: { min: 18, max: 24 },
      optimalHumidity: { min: 60, max: 75 },
      marketPrice: 45.00,
      yieldPerTower: 6,
      difficulty: 'advanced',
      seasonalBonus: ['spring', 'summer'],
      marketDemand: 'medium',
      profitMargin: 85,
      waterRequirement: 'high',
      lightRequirement: 'high',
      description: 'Premium gourmet berries with exceptional market value for specialized markets',
      benefits: ['Highest market price', 'Gourmet positioning', 'Unique product'],
      challenges: ['Complex cultivation', 'Long growth cycle', 'High resource needs']
    },
    {
      id: 'microgreens-pea',
      name: 'Pea Microgreens',
      scientificName: 'Pisum sativum',
      category: 'microgreens',
      growthTime: 10,
      optimalTemp: { min: 16, max: 22 },
      optimalHumidity: { min: 50, max: 60 },
      marketPrice: 35.00,
      yieldPerTower: 4,
      difficulty: 'easy',
      seasonalBonus: ['winter', 'spring'],
      marketDemand: 'medium',
      profitMargin: 72,
      waterRequirement: 'low',
      lightRequirement: 'low',
      description: 'Fast-growing microgreens perfect for quick turnover and high-end markets',
      benefits: ['Fastest growth cycle', 'High profit margin', 'Low resource needs', 'Year-round demand'],
      challenges: ['Specialized market', 'Short shelf life', 'Handling requirements']
    }
  ];

  const steps = [
    { title: 'Operation Type', icon: <Users className="h-5 w-5" /> },
    { title: 'Experience Level', icon: <Target className="h-5 w-5" /> },
    { title: 'Priorities', icon: <TrendingUp className="h-5 w-5" /> },
    { title: 'Resources', icon: <Package className="h-5 w-5" /> },
    { title: 'Recommendations', icon: <Lightbulb className="h-5 w-5" /> }
  ];

  const generateRecommendations = () => {
    setLoading(true);
    
    setTimeout(() => {
      let scoredPlants = plantDatabase.map(plant => {
        let score = 0;
        
        // Environmental compatibility
        const tempMatch = environmentalData.currentTemp >= plant.optimalTemp.min && 
                         environmentalData.currentTemp <= plant.optimalTemp.max;
        const humidityMatch = environmentalData.currentHumidity >= plant.optimalHumidity.min && 
                             environmentalData.currentHumidity <= plant.optimalHumidity.max;
        
        if (tempMatch) score += 25;
        if (humidityMatch) score += 15;
        
        // Seasonal bonus
        if (plant.seasonalBonus.includes(environmentalData.season)) score += 20;
        
        // User preferences scoring
        if (userPreferences.operation === 'commercial') {
          if (plant.marketDemand === 'high') score += 20;
          if (userPreferences.priority === 'profit' && plant.profitMargin > 70) score += 25;
          if (userPreferences.priority === 'yield' && plant.yieldPerTower > 10) score += 25;
        }
        
        if (userPreferences.experience === 'beginner' && plant.difficulty === 'easy') score += 15;
        if (userPreferences.experience === 'expert' && plant.difficulty === 'advanced') score += 10;
        
        if (userPreferences.timeframe === 'short' && plant.growthTime < 30) score += 15;
        if (userPreferences.timeframe === 'long' && plant.growthTime > 60) score += 10;
        
        return { ...plant, score };
      });
      
      scoredPlants.sort((a, b) => b.score - a.score);
      setRecommendations(scoredPlants.slice(0, 3));
      setLoading(false);
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === steps.length - 2) {
      generateRecommendations();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateROI = (plant: PlantData) => {
    const monthlyRevenue = plant.yieldPerTower * plant.marketPrice;
    const monthlyCosts = 150; // Estimated operational costs
    const monthlyProfit = monthlyRevenue - monthlyCosts;
    const annualROI = ((monthlyProfit * 12) / 2000) * 100; // Assuming $2000 initial investment
    return Math.round(annualROI);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">What type of operation are you running?</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'commercial', label: 'Commercial Farm', desc: 'Focus on profit and market demand' },
                { value: 'research', label: 'Research Facility', desc: 'Experimental and educational goals' },
                { value: 'personal', label: 'Personal Use', desc: 'Home consumption and hobby growing' }
              ].map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all duration-300 ${
                    userPreferences.operation === option.value 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-gray-600 hover:border-emerald-400'
                  }`}
                  onClick={() => setUserPreferences({...userPreferences, operation: option.value as any})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{option.label}</h4>
                        <p className="text-sm text-gray-300">{option.desc}</p>
                      </div>
                      {userPreferences.operation === option.value && (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">What's your experience level?</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'New to hydroponic farming' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Some experience with growing' },
                { value: 'expert', label: 'Expert', desc: 'Advanced knowledge and skills' }
              ].map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all duration-300 ${
                    userPreferences.experience === option.value 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-gray-600 hover:border-emerald-400'
                  }`}
                  onClick={() => setUserPreferences({...userPreferences, experience: option.value as any})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{option.label}</h4>
                        <p className="text-sm text-gray-300">{option.desc}</p>
                      </div>
                      {userPreferences.experience === option.value && (
                        <CheckCircle className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">What's your primary goal?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'profit', label: 'Maximum Profit', icon: <DollarSign className="h-5 w-5" /> },
                { value: 'yield', label: 'High Yield', icon: <BarChart3 className="h-5 w-5" /> },
                { value: 'sustainability', label: 'Sustainability', icon: <Leaf className="h-5 w-5" /> },
                { value: 'research', label: 'Research', icon: <Target className="h-5 w-5" /> }
              ].map((option) => (
                <Card 
                  key={option.value}
                  className={`cursor-pointer transition-all duration-300 ${
                    userPreferences.priority === option.value 
                      ? 'border-emerald-500 bg-emerald-500/10' 
                      : 'border-gray-600 hover:border-emerald-400'
                  }`}
                  onClick={() => setUserPreferences({...userPreferences, priority: option.value as any})}
                >
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-emerald-400">{option.icon}</div>
                      <h4 className="font-medium text-white text-sm">{option.label}</h4>
                      {userPreferences.priority === option.value && (
                        <CheckCircle className="h-4 w-4 text-emerald-400" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white mb-4">Resource Allocation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Budget Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map((level) => (
                    <Button
                      key={level}
                      variant={userPreferences.budget === level ? "default" : "outline"}
                      onClick={() => setUserPreferences({...userPreferences, budget: level as any})}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Timeframe</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'short', label: 'Short Term (1-3 months)' },
                    { value: 'medium', label: 'Medium Term (3-12 months)' },
                    { value: 'long', label: 'Long Term (1+ years)' }
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={userPreferences.timeframe === option.value ? "default" : "outline"}
                      onClick={() => setUserPreferences({...userPreferences, timeframe: option.value as any})}
                      className="text-xs h-auto py-2"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Current Environmental Conditions</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-orange-400" />
                  <span className="text-gray-300">Temperature: {environmentalData.currentTemp}°C</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-gray-300">Humidity: {environmentalData.currentHumidity}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-400" />
                  <span className="text-gray-300">Season: {environmentalData.season}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sun className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300">Energy: ${environmentalData.energyCost}/kWh</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Recommended Plants</h3>
              <p className="text-gray-300">Based on your preferences and current conditions</p>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="inline-block w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-emerald-300 mt-2">Analyzing optimal plant combinations...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((plant, index) => (
                  <motion.div
                    key={plant.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card className="organic-card border-emerald-500/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white flex items-center space-x-2">
                              <span>#{index + 1}</span>
                              <span>{plant.name}</span>
                              <Badge className="bg-emerald-500/20 text-emerald-300">
                                {plant.score || 0}% Match
                              </Badge>
                            </CardTitle>
                            <p className="text-gray-300 text-sm italic">{plant.scientificName}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-emerald-400">${plant.marketPrice}/kg</div>
                            <div className="text-xs text-gray-400">{calculateROI(plant)}% ROI</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-200 mb-4">{plant.description}</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Growth Time</div>
                            <div className="font-medium text-white">{plant.growthTime} days</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Monthly Yield</div>
                            <div className="font-medium text-white">{plant.yieldPerTower} kg</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Difficulty</div>
                            <div className="font-medium text-white capitalize">{plant.difficulty}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-400">Market Demand</div>
                            <div className="font-medium text-white capitalize">{plant.marketDemand}</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-emerald-300 mb-1">Benefits</h5>
                            <div className="flex flex-wrap gap-1">
                              {plant.benefits.map((benefit, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-green-500/30 text-green-300">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-orange-300 mb-1">Considerations</h5>
                            <div className="flex flex-wrap gap-1">
                              {plant.challenges.map((challenge, i) => (
                                <Badge key={i} variant="outline" className="text-xs border-orange-500/30 text-orange-300">
                                  {challenge}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="organic-card w-full">
      <CardHeader>
        <CardTitle className="text-white flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-emerald-400" />
          <span>Plant Recommendation Wizard</span>
        </CardTitle>
        <div className="flex items-center space-x-2 mt-4">
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="flex-1" />
          <span className="text-sm text-gray-300">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center space-x-1 text-xs ${
                index <= currentStep ? 'text-emerald-400' : 'text-gray-500'
              }`}
            >
              {step.icon}
              <span className="hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-gray-600"
          >
            Previous
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Next <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentStep(0)}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              Start Over
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantRecommendationWizard;