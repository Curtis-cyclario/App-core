import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DeviceStatus } from '@/types';
import { Waves, Lightbulb } from 'lucide-react';

interface EquipmentControlProps {
  deviceStatus: DeviceStatus;
  togglePump: (active: boolean) => void;
  toggleLight: (on: boolean) => void;
}

const EquipmentControl: React.FC<EquipmentControlProps> = ({
  deviceStatus,
  togglePump,
  toggleLight
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          Equipment Control
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-gray-200 dark:divide-dark-600">
          {/* Pump Control */}
          <li className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                  <Waves className="h-6 w-6 text-primary-600 dark:text-primary-200" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Water Pump</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Controls water circulation in the system</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={deviceStatus.pump.active ? "success" : "secondary"}
                  className="px-2 text-xs font-semibold mr-4"
                >
                  {deviceStatus.pump.status}
                </Badge>
                <Switch 
                  checked={deviceStatus.pump.active} 
                  onCheckedChange={togglePump} 
                />
              </div>
            </div>
          </li>
          
          {/* Lighting Control */}
          <li className="py-4 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-200" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Grow Lights</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Controls LED lighting for plant growth</p>
                </div>
              </div>
              <div className="flex items-center">
                <Badge 
                  variant={deviceStatus.light.active ? "success" : "secondary"}
                  className="px-2 text-xs font-semibold mr-4"
                >
                  {deviceStatus.light.status}
                </Badge>
                <Switch 
                  checked={deviceStatus.light.active} 
                  onCheckedChange={toggleLight} 
                />
              </div>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default EquipmentControl;
