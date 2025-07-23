import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from '@/lib/queryClient';
import { 
  RefreshCw, 
  PlusCircle, 
  WifiOff, 
  Settings,
  Edit,
  Trash2,
  ChevronRight,
  Rows3,
  Grid3x3,
  Sprout // Using Sprout instead of Plant which may not be available
} from 'lucide-react';
import { TowerType } from './types';

// Types for managing towers
export interface TowerProps {
  onSelectTower: (towerId: number) => void;
}

const TowerList: React.FC<TowerProps> = ({ onSelectTower }) => {
  const [towers, setTowers] = useState<TowerType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddTowerOpen, setIsAddTowerOpen] = useState(false);
  const [newTower, setNewTower] = useState({
    name: '',
    type: 'vertical',
    addressingType: 'column',
    totalColumns: 0,
    totalPods: 0,
    plantCapacity: 0,
    location: '',
    notes: ''
  });

  const fetchTowers = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('GET', '/api/towers');
      const data = await response.json();
      setTowers(data);
    } catch (error) {
      console.error('Failed to fetch towers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTowers();
  }, []);

  const handleAddTower = async () => {
    try {
      const response = await apiRequest('POST', '/api/towers', newTower);
      const data = await response.json();
      setTowers([...towers, data]);
      setIsAddTowerOpen(false);
      setNewTower({
        name: '',
        type: 'vertical',
        addressingType: 'column',
        totalColumns: 0,
        totalPods: 0,
        plantCapacity: 0,
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to add tower:', error);
    }
  };

  const handleSelectTower = (id: number) => {
    onSelectTower(id);
  };

  // Generate addressing labels based on tower type
  const getAddressingLabel = (tower: TowerType) => {
    switch (tower.addressingType) {
      case 'column':
        return `${tower.totalColumns} columns`;
      case 'pod':
        return `${tower.totalPods} pods`;
      case 'none':
      default:
        return 'No addressing';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Growing Towers</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchTowers}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setIsAddTowerOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add Tower
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading towers...</div>
      ) : towers.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No towers configured yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsAddTowerOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Tower
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {towers.map((tower) => (
            <Card key={tower.id} className="overflow-hidden transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium">{tower.name}</CardTitle>
                  <Badge variant={tower.status === 'active' ? 'default' : tower.status === 'maintenance' ? 'secondary' : 'destructive'}>
                    {tower.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                  {tower.type} - {tower.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">Addressing:</span>
                    <p>{getAddressingLabel(tower)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plants:</span>
                    <p>{tower.currentOccupancy} / {tower.plantCapacity}</p>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Occupancy</span>
                    <span>{Math.round((tower.currentOccupancy / tower.plantCapacity) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(tower.currentOccupancy / tower.plantCapacity) * 100} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => handleSelectTower(tower.id)}>
                  View Devices <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Add Tower Dialog */}
      <Dialog open={isAddTowerOpen} onOpenChange={setIsAddTowerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Tower</DialogTitle>
            <DialogDescription>
              Create a new growing tower with addressing configuration
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input
                  id="name"
                  placeholder="Tower name"
                  value={newTower.name}
                  onChange={(e) => setNewTower({ ...newTower, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location</label>
                <Input
                  id="location"
                  placeholder="Tower location"
                  value={newTower.location}
                  onChange={(e) => setNewTower({ ...newTower, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Tower Type</label>
                <Select 
                  value={newTower.type} 
                  onValueChange={(value) => setNewTower({ ...newTower, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="vertical">Vertical</SelectItem>
                      <SelectItem value="aframe">A-Frame</SelectItem>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="nft">NFT</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="addressingType" className="text-sm font-medium">Addressing Type</label>
                <Select 
                  value={newTower.addressingType} 
                  onValueChange={(value) => setNewTower({ ...newTower, addressingType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select addressing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="column">
                        <div className="flex items-center">
                          <Rows3 className="mr-2 h-4 w-4" />
                          <span>By Column</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pod">
                        <div className="flex items-center">
                          <Grid3x3 className="mr-2 h-4 w-4" />
                          <span>By Pod</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="none">
                        <div className="flex items-center">
                          <Sprout className="mr-2 h-4 w-4" />
                          <span>No Addressing</span>
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <label htmlFor="totalColumns" className="text-sm font-medium">Columns</label>
                <Input
                  id="totalColumns"
                  type="number"
                  min="0"
                  value={newTower.totalColumns}
                  onChange={(e) => setNewTower({ ...newTower, totalColumns: parseInt(e.target.value) || 0 })}
                  className={newTower.addressingType !== 'column' ? 'opacity-50' : ''}
                  disabled={newTower.addressingType !== 'column'}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="totalPods" className="text-sm font-medium">Pods</label>
                <Input
                  id="totalPods"
                  type="number"
                  min="0"
                  value={newTower.totalPods}
                  onChange={(e) => setNewTower({ ...newTower, totalPods: parseInt(e.target.value) || 0 })}
                  className={newTower.addressingType !== 'pod' && newTower.addressingType !== 'column' ? 'opacity-50' : ''}
                  disabled={newTower.addressingType !== 'pod' && newTower.addressingType !== 'column'}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="plantCapacity" className="text-sm font-medium">Plant Capacity</label>
                <Input
                  id="plantCapacity"
                  type="number"
                  min="0"
                  value={newTower.plantCapacity}
                  onChange={(e) => setNewTower({ ...newTower, plantCapacity: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Input
                id="notes"
                placeholder="Additional notes"
                value={newTower.notes}
                onChange={(e) => setNewTower({ ...newTower, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTowerOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleAddTower}
              disabled={!newTower.name || (newTower.addressingType === 'column' && !newTower.totalColumns)}
            >
              Add Tower
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TowerList;