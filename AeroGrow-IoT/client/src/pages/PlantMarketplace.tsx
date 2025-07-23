import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PlantListingCard from '@/components/marketplace/PlantListingCard';
import { 
  Leaf, 
  Plus, 
  Search, 
  MapPin, 
  Calendar,
  Star,
  MessageCircle,
  Heart,
  ShoppingCart,
  Filter,
  User,
  Package,
  Clock,
  TrendingUp,
  Award
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
  images: string[];
  sellerId: number;
  sellerName: string;
  sellerRating: number;
  createdAt: string;
  status: 'available' | 'pending' | 'sold' | 'traded';
  likes: number;
  views: number;
}

interface TradeOffer {
  id: number;
  listingId: number;
  offererName: string;
  offeredPlants: string[];
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

const PlantMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCondition, setFilterCondition] = useState('all');
  const [selectedListing, setSelectedListing] = useState<PlantListing | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const queryClient = useQueryClient();

  // Fetch plant listings
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ['/api/marketplace/listings'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/listings');
      return response.json();
    }
  });

  // Fetch user's trade offers
  const { data: tradeOffers = [] } = useQuery({
    queryKey: ['/api/marketplace/offers'],
    queryFn: async () => {
      const response = await fetch('/api/marketplace/offers');
      return response.json();
    }
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
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

  const filteredListings = listings.filter((listing: PlantListing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.plantType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || listing.plantType === filterCategory;
    const matchesCondition = filterCondition === 'all' || listing.condition === filterCondition;
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-emerald-900 overflow-hidden">
      <div className="absolute inset-0 z-1 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-emerald-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-gradient-radial from-teal-500/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 organic-card p-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Leaf className="h-8 w-8 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Plant Marketplace</h1>
                <p className="text-emerald-200">Community plant swap and trade platform</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="organic-button-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              List Plant
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="organic-card p-2 flex flex-wrap justify-center gap-2">
            <TabsTrigger value="browse" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Search className="h-4 w-4 mr-2" />
              Browse Plants
            </TabsTrigger>
            <TabsTrigger value="my-listings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Package className="h-4 w-4 mr-2" />
              My Listings
            </TabsTrigger>
            <TabsTrigger value="trades" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <MessageCircle className="h-4 w-4 mr-2" />
              Trade Offers
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white text-emerald-200 hover:text-white transition-all duration-300 rounded-xl px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              Community
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Search and Filters */}
              <Card className="organic-card">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search plants, varieties, or species..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 bg-gray-800/50 border-emerald-500/20 text-white"
                        />
                      </div>
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="bg-gray-800/50 border-emerald-500/20 text-white">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-emerald-500/20">
                        <SelectItem value="all" className="text-white">All Categories</SelectItem>
                        <SelectItem value="herb" className="text-white">Herbs</SelectItem>
                        <SelectItem value="vegetable" className="text-white">Vegetables</SelectItem>
                        <SelectItem value="flower" className="text-white">Flowers</SelectItem>
                        <SelectItem value="houseplant" className="text-white">Houseplants</SelectItem>
                        <SelectItem value="succulent" className="text-white">Succulents</SelectItem>
                        <SelectItem value="tree" className="text-white">Trees</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterCondition} onValueChange={setFilterCondition}>
                      <SelectTrigger className="bg-gray-800/50 border-emerald-500/20 text-white">
                        <SelectValue placeholder="Condition" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-emerald-500/20">
                        <SelectItem value="all" className="text-white">All Conditions</SelectItem>
                        <SelectItem value="excellent" className="text-white">Excellent</SelectItem>
                        <SelectItem value="good" className="text-white">Good</SelectItem>
                        <SelectItem value="fair" className="text-white">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Plant Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {isLoading ? (
                  <div className="col-span-full text-center text-emerald-300">Loading plants...</div>
                ) : filteredListings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Leaf className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No plants found</h3>
                    <p className="text-gray-400">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  filteredListings.map((listing: PlantListing) => (
                    <PlantListingCard
                      key={listing.id}
                      listing={listing}
                      onClick={() => setSelectedListing(listing)}
                    />
                  ))
                )}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="my-listings">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">My Plant Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No listings yet</h3>
                    <p className="text-gray-400 mb-4">Start by listing your first plant</p>
                    <Button onClick={() => setShowAddForm(true)} className="organic-button-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Listing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="trades">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="organic-card">
                <CardHeader>
                  <CardTitle className="text-white">Trade Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">No trade offers</h3>
                    <p className="text-gray-400">Trade offers will appear here when you receive them</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="community">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="organic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <TrendingUp className="h-5 w-5 text-emerald-400" />
                      <span>Trending Plants</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white">Monstera Deliciosa</span>
                        <span className="text-emerald-400">+24%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Snake Plant</span>
                        <span className="text-emerald-400">+18%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white">Pothos</span>
                        <span className="text-emerald-400">+15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="organic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Award className="h-5 w-5 text-yellow-400" />
                      <span>Top Traders</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <span className="text-yellow-400 text-sm font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">PlantMom87</div>
                          <div className="text-xs text-gray-400">142 successful trades</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-500/20 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">GreenThumb_Joe</div>
                          <div className="text-xs text-gray-400">98 successful trades</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                          <span className="text-orange-400 text-sm font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">SucculentSarah</div>
                          <div className="text-xs text-gray-400">76 successful trades</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="organic-card">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="text-gray-300">
                        <span className="text-emerald-400">PlantMom87</span> traded a Monstera for Fiddle Leaf Fig
                      </div>
                      <div className="text-gray-300">
                        <span className="text-emerald-400">GreenGuru</span> listed new Snake Plant cuttings
                      </div>
                      <div className="text-gray-300">
                        <span className="text-emerald-400">CactusKing</span> sold Rare Echeveria for $45
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PlantMarketplace;