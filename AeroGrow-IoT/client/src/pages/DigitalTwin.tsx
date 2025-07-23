import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InfoIcon, Mail, Crop } from 'lucide-react';

const DigitalTwin = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Crop className="h-6 w-6 text-primary" />
            Digital Twin Visualization
          </h1>
        </div>
        
        <Card className="overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle>3D Digital Twin Visualization</CardTitle>
            <CardDescription>
              Interactive 3D visualization of vertical farming towers with real-time data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative min-h-[500px] w-full bg-gradient-to-b from-primary/5 to-background/80 flex flex-col items-center justify-center p-8 text-center">
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
              
              <div className="relative z-10 flex flex-col items-center justify-center gap-4 max-w-lg">
                <div className="bg-primary/10 p-4 rounded-full animate-pulse mb-4">
                  <Crop className="h-8 w-8 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold">Enhanced 3D Visualization</h2>
                <p className="text-muted-foreground">
                  Our next-generation digital twin technology is currently under development. This module will provide interactive 3D visualization of vertical farming towers with real-time sensor data overlay.
                </p>
                
                <div className="mt-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Coming Soon</h3>
                      <p className="text-sm text-muted-foreground">
                        The 3D visualization module is currently being enhanced with advanced rendering capabilities and interactive features.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Enquire for More Info
                  </Button>
                </div>
              </div>
              
              {/* Decorative orbiting elements */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-20 h-20 left-1/4 top-1/4 bg-primary/10 rounded-full animate-orbit"></div>
                <div className="absolute w-12 h-12 right-1/4 top-1/3 bg-primary/20 rounded-full animate-orbit animation-delay-1000"></div>
                <div className="absolute w-16 h-16 left-1/3 bottom-1/4 bg-primary/5 rounded-full animate-orbit animation-delay-2000"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DigitalTwin;