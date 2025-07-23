import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Database, 
  Sparkles, 
  Info,
  Filter,
  Star,
  Atom,
  Layers,
  Zap
} from 'lucide-react';
import { MINERAL_DATABASE } from '@/lib/advancedMineralAI';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComprehensiveMineralDB() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMineral, setSelectedMineral] = useState<string | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'hardness' | 'rarity'>('all');

  const minerals = Object.entries(MINERAL_DATABASE);

  const filteredMinerals = useMemo(() => {
    let filtered = minerals.filter(([key, mineral]) =>
      mineral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mineral.formula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mineral.color.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterBy === 'hardness') {
      filtered.sort(([, a], [, b]) => b.hardness - a.hardness);
    } else if (filterBy === 'rarity') {
      const rarityOrder = { 'Very Common': 0, 'Common': 1, 'Uncommon': 2, 'Rare': 3 };
      filtered.sort(([, a], [, b]) => 
        (rarityOrder[b.rarity as keyof typeof rarityOrder] || 0) - 
        (rarityOrder[a.rarity as keyof typeof rarityOrder] || 0)
      );
    }

    return filtered;
  }, [searchTerm, filterBy, minerals]);

  const getHardnessColor = (hardness: number) => {
    if (hardness >= 7) return 'bg-red-500';
    if (hardness >= 5) return 'bg-yellow-500';
    if (hardness >= 3) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Very Common': return 'bg-gray-500';
      case 'Common': return 'bg-green-500';
      case 'Uncommon': return 'bg-yellow-500';
      case 'Rare': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedMineralData = selectedMineral ? MINERAL_DATABASE[selectedMineral as keyof typeof MINERAL_DATABASE] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Database className="h-10 w-10 text-blue-400" />
            Comprehensive Mineral Database
          </h1>
          <p className="text-blue-200 text-lg">
            Detailed geological data for {minerals.length} minerals with scientific accuracy
          </p>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, formula, or color..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterBy === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterBy('all')}
                    className="border-white/20"
                  >
                    All
                  </Button>
                  <Button
                    variant={filterBy === 'hardness' ? 'default' : 'outline'}
                    onClick={() => setFilterBy('hardness')}
                    className="border-white/20"
                  >
                    <Filter className="h-4 w-4 mr-1" />
                    Hardness
                  </Button>
                  <Button
                    variant={filterBy === 'rarity' ? 'default' : 'outline'}
                    onClick={() => setFilterBy('rarity')}
                    className="border-white/20"
                  >
                    <Star className="h-4 w-4 mr-1" />
                    Rarity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Mineral List */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Mineral Collection ({filteredMinerals.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                <div className="grid gap-3">
                  <AnimatePresence>
                    {filteredMinerals.map(([key, mineral], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedMineral === key 
                            ? 'bg-blue-600/30 border border-blue-400' 
                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                        }`}
                        onClick={() => setSelectedMineral(key)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-white font-medium text-lg">{mineral.name}</h3>
                            <p className="text-gray-300 text-sm">{mineral.formula}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge 
                              className={`${getHardnessColor(mineral.hardness)} text-white border-0`}
                            >
                              H: {mineral.hardness}
                            </Badge>
                            <Badge 
                              className={`${getRarityColor(mineral.rarity)} text-white border-0`}
                            >
                              {mineral.rarity}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                          <div>
                            <span className="text-gray-500">System:</span>
                            <br />
                            <span className="text-white">{mineral.crystalSystem}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Luster:</span>
                            <br />
                            <span className="text-white">{mineral.luster}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Density:</span>
                            <br />
                            <span className="text-white">{mineral.density}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed View */}
          <div>
            <AnimatePresence mode="wait">
              {selectedMineralData ? (
                <motion.div
                  key={selectedMineral}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-black/40 backdrop-blur-lg border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Atom className="h-5 w-5" />
                        {selectedMineralData.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Basic Properties */}
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          Basic Properties
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Formula:</span>
                            <span className="text-white font-mono">{selectedMineralData.formula}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Crystal System:</span>
                            <span className="text-white">{selectedMineralData.crystalSystem}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Color:</span>
                            <span className="text-white">{selectedMineralData.color}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-white/20" />

                      {/* Physical Properties */}
                      <div>
                        <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Physical Properties
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-400">Hardness (Mohs):</span>
                              <span className="text-white">{selectedMineralData.hardness}/10</span>
                            </div>
                            <Progress 
                              value={(selectedMineralData.hardness / 10) * 100} 
                              className="h-2"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-white/5 p-2 rounded">
                              <span className="text-gray-400 block">Density</span>
                              <span className="text-white font-medium">{selectedMineralData.density} g/cm³</span>
                            </div>
                            <div className="bg-white/5 p-2 rounded">
                              <span className="text-gray-400 block">Sp. Gravity</span>
                              <span className="text-white font-medium">{selectedMineralData.specificGravity}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-white/20" />

                      {/* Optical Properties */}
                      <div>
                        <h4 className="text-white font-medium mb-2">Optical Properties</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Luster:</span>
                            <span className="text-white">{selectedMineralData.luster}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Transparency:</span>
                            <span className="text-white">{selectedMineralData.transparency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Streak:</span>
                            <span className="text-white">{selectedMineralData.streak}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-white/20" />

                      {/* Applications */}
                      <div>
                        <h4 className="text-white font-medium mb-2">Applications & Uses</h4>
                        <p className="text-gray-300 text-sm">{selectedMineralData.uses}</p>
                        <div className="mt-2">
                          <Badge className={`${getRarityColor(selectedMineralData.rarity)} text-white border-0`}>
                            {selectedMineralData.rarity}
                          </Badge>
                        </div>
                      </div>

                      <Separator className="bg-white/20" />

                      {/* Geological Context */}
                      <div>
                        <h4 className="text-white font-medium mb-2">Geological Context</h4>
                        <p className="text-gray-300 text-sm mb-2">{selectedMineralData.commonLocations}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-white/5 p-2 rounded">
                            <span className="text-gray-400 block">Cleavage</span>
                            <span className="text-white">{selectedMineralData.cleavage}</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded">
                            <span className="text-gray-400 block">Fracture</span>
                            <span className="text-white">{selectedMineralData.fracture}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="no-selection"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-gray-400 py-12"
                >
                  <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a mineral to view detailed information</p>
                  <p className="text-sm">Comprehensive geological data and properties</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}