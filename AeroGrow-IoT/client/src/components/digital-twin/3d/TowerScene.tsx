import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  Environment, 
  OrbitControls, 
  Grid, 
  PerspectiveCamera, 
  Text
} from '@react-three/drei';
import * as THREE from 'three';
import Tower3D from './Tower3D';
import { Tower, TowerSection } from '@/types';

interface TowerSceneProps {
  tower: Tower;
  sections: TowerSection[];
  activeDataType: string;
  position: { x: number; y: number; z: number; rotationY: number; scale: number };
  timeOfDay: string;
  onSectionClick?: (sectionIndex: number) => void;
}

const TowerScene: React.FC<TowerSceneProps> = ({ 
  tower, 
  sections, 
  activeDataType, 
  position, 
  timeOfDay,
  onSectionClick
}) => {
  const [highlightedSection, setHighlightedSection] = useState<number | null>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  
  // Debug helper for the spotlight (only in development)
  // useHelper(spotLightRef, THREE.SpotLightHelper, 'red');
  
  // Set environment and lighting based on time of day
  const getEnvironmentPreset = () => {
    switch(timeOfDay) {
      case 'morning': return 'dawn';
      case 'day': return 'day';
      case 'evening': return 'sunset';
      case 'night': return 'night';
      default: return 'warehouse';
    }
  };
  
  // Define light intensity and color based on time of day
  const getLightIntensity = () => {
    switch(timeOfDay) {
      case 'morning': return 1.2;
      case 'day': return 1.5;
      case 'evening': return 1.0;
      case 'night': return 0.6;
      default: return 1.0;
    }
  };
  
  const getLightColor = () => {
    switch(timeOfDay) {
      case 'morning': return '#ffedd8';
      case 'day': return '#ffffff';
      case 'evening': return '#ffb86c';
      case 'night': return '#2c5a9b';
      default: return '#ffffff';
    }
  };

  // Handle section hover
  const handleSectionHover = (index: number | null) => {
    setHighlightedSection(index);
  };

  // Handle section click
  const handleSectionClick = (index: number) => {
    if (onSectionClick) {
      onSectionClick(index);
    }
  };

  return (
    <div className="w-full h-full">
      <Canvas shadows className="w-full h-full">
        <PerspectiveCamera 
          makeDefault 
          position={[5, 2, 5]} 
          fov={45}
        />
        
        {/* Environment and Lighting */}
        <Environment preset={getEnvironmentPreset() as any} />
        <ambientLight intensity={getLightIntensity() * 0.4} color={getLightColor()} />
        <pointLight 
          position={[5, 8, 5]} 
          intensity={getLightIntensity() * 2}
          color={getLightColor()}
          castShadow
        />
        
        {/* Grid for reference */}
        <Grid
          position={[0, -sections.length * 0.5 / 2 - 0.35, 0]}
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#6f6f6f"
          sectionSize={1}
          sectionThickness={1}
          sectionColor="#9d4b4b"
          fadeDistance={30}
          fadeStrength={1.5}
        />
        
        {/* Tower 3D Model */}
        <Tower3D
          tower={tower}
          activeDataType={activeDataType}
          position={[position.x, position.y, position.z]}
          rotation={[0, position.rotationY, 0]}
          scale={position.scale}
          sections={sections}
          highlightedSection={highlightedSection}
          onSectionHover={handleSectionHover}
          onSectionClick={handleSectionClick}
        />
        
        {/* Section label for hover state */}
        {highlightedSection !== null && (
          <Text
            position={[
              position.x + Math.sin(position.rotationY) * 1.5 * position.scale,
              position.y + (highlightedSection - sections.length / 2 + 0.5) * 0.5 * position.scale,
              position.z + Math.cos(position.rotationY) * 1.5 * position.scale
            ]}
            fontSize={0.2 * position.scale}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01 * position.scale}
            outlineColor="#000000"
          >
            {sections[highlightedSection]?.name || `Section ${highlightedSection + 1}`}
          </Text>
        )}
        
        {/* Tower label */}
        <Text
          position={[position.x, position.y + (sections.length * 0.5 / 2 + 0.5) * position.scale, position.z]}
          fontSize={0.3 * position.scale}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01 * position.scale}
          outlineColor="#000000"
        >
          {tower.name}
        </Text>
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={20}
          target={[position.x, position.y, position.z]}
        />
      </Canvas>
    </div>
  );
};

export default TowerScene;