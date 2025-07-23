import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Tower } from '@/types';

interface Tower3DProps {
  tower: Tower;
  activeDataType: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  sections: any[];
  highlightedSection?: number | null;
  onSectionHover?: (sectionIndex: number | null) => void;
  onSectionClick?: (sectionIndex: number) => void;
}

// Create a cylindrical tower with pods/sections
const Tower3D: React.FC<Tower3DProps> = ({
  tower,
  activeDataType,
  position,
  rotation,
  scale,
  sections,
  highlightedSection,
  onSectionHover,
  onSectionClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate color based on data type and value
  const getColor = (type: string, value: number): string => {
    if (type === 'temperature') {
      // Temperature color scale: blue (cold) to red (hot)
      const normalizedValue = Math.min(Math.max((value - 15) / 25, 0), 1); // Assuming range 15-40°C
      return `hsl(${220 - normalizedValue * 220}, 100%, 50%)`;
    } else if (type === 'humidity') {
      // Humidity color scale: yellow (dry) to blue (humid)
      const normalizedValue = Math.min(Math.max(value / 100, 0), 1);
      return `hsl(${60 + normalizedValue * 160}, 100%, 50%)`;
    } else if (type === 'light') {
      // Light intensity color scale: dark yellow to bright yellow
      const normalizedValue = Math.min(Math.max(value / 2000, 0), 1); // Assuming range 0-2000 lux
      return `hsl(60, 100%, ${30 + normalizedValue * 70}%)`;
    } else if (type === 'co2') {
      // CO2 color scale: green (low) to red (high)
      const normalizedValue = Math.min(Math.max((value - 400) / 1600, 0), 1); // Assuming range 400-2000 ppm
      return `hsl(${120 - normalizedValue * 120}, 100%, 50%)`;
    } else if (type === 'nutrient') {
      // Nutrient level color scale: red (low) to green (optimal)
      const normalizedValue = Math.min(Math.max(value / 10, 0), 1); // Assuming range 0-10
      return `hsl(${normalizedValue * 120}, 100%, 50%)`;
    } else {
      return '#aaaaaa'; // Default gray
    }
  };

  // Animate gentle rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Create geometry for each section based on tower type
  const renderSections = useMemo(() => {
    return sections.map((section, index) => {
      const isHighlighted = highlightedSection === index;
      const sectionHeight = 0.5;
      const yPosition = index * sectionHeight - (sections.length * sectionHeight) / 2 + sectionHeight / 2;
      
      const sectionColor = getColor(activeDataType, section.metrics[activeDataType] || 0);
      
      // For vertical towers, we'll use cylinders
      if (tower.type === 'vertical' || tower.type === 'verti-garden') {
        return (
          <mesh
            key={`section-${index}`}
            position={[0, yPosition, 0]}
            onPointerOver={() => onSectionHover && onSectionHover(index)}
            onPointerOut={() => onSectionHover && onSectionHover(null)}
            onClick={() => onSectionClick && onSectionClick(index)}
          >
            <cylinderGeometry args={[0.5, 0.5, sectionHeight, 32]} />
            <meshStandardMaterial 
              color={sectionColor} 
              transparent={true}
              opacity={isHighlighted ? 0.9 : 0.7}
              emissive={isHighlighted ? sectionColor : '#000000'}
              emissiveIntensity={isHighlighted ? 0.3 : 0}
            />
          </mesh>
        );
      } 
      // For A-frame towers, we'll use cones
      else if (tower.type === 'a-frame') {
        const radius = 0.5 - (index * 0.05);
        return (
          <mesh
            key={`section-${index}`}
            position={[0, yPosition, 0]}
            onPointerOver={() => onSectionHover && onSectionHover(index)}
            onPointerOut={() => onSectionHover && onSectionHover(null)}
            onClick={() => onSectionClick && onSectionClick(index)}
          >
            <cylinderGeometry args={[radius, radius, sectionHeight, 32]} />
            <meshStandardMaterial 
              color={sectionColor} 
              transparent={true}
              opacity={isHighlighted ? 0.9 : 0.7}
              emissive={isHighlighted ? sectionColor : '#000000'}
              emissiveIntensity={isHighlighted ? 0.3 : 0}
            />
          </mesh>
        );
      } 
      // For hydroponic rafts, we'll use boxes
      else if (tower.type === 'raft') {
        return (
          <mesh
            key={`section-${index}`}
            position={[0, yPosition, 0]}
            onPointerOver={() => onSectionHover && onSectionHover(index)}
            onPointerOut={() => onSectionHover && onSectionHover(null)}
            onClick={() => onSectionClick && onSectionClick(index)}
          >
            <boxGeometry args={[1, sectionHeight, 1]} />
            <meshStandardMaterial 
              color={sectionColor} 
              transparent={true}
              opacity={isHighlighted ? 0.9 : 0.7}
              emissive={isHighlighted ? sectionColor : '#000000'}
              emissiveIntensity={isHighlighted ? 0.3 : 0}
            />
          </mesh>
        );
      } 
      // Default to cylinder for any other type
      else {
        return (
          <mesh
            key={`section-${index}`}
            position={[0, yPosition, 0]}
            onPointerOver={() => onSectionHover && onSectionHover(index)}
            onPointerOut={() => onSectionHover && onSectionHover(null)}
            onClick={() => onSectionClick && onSectionClick(index)}
          >
            <cylinderGeometry args={[0.5, 0.5, sectionHeight, 32]} />
            <meshStandardMaterial 
              color={sectionColor} 
              transparent={true}
              opacity={isHighlighted ? 0.9 : 0.7}
              emissive={isHighlighted ? sectionColor : '#000000'}
              emissiveIntensity={isHighlighted ? 0.3 : 0}
            />
          </mesh>
        );
      }
    });
  }, [tower, sections, activeDataType, highlightedSection, onSectionHover, onSectionClick]);

  // Add water flow tube for hydroponic systems
  const renderWaterFlow = useMemo(() => {
    if (tower.type !== 'raft') {
      return (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, sections.length * 0.5 + 0.2, 16]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.1}
            distortion={0.5}
            distortionScale={0.5}
            temporalDistortion={0.1}
            color={"#57c7ff"}
            thickness={0.1}
            transmission={0.95}
            ior={1.5}
          />
        </mesh>
      );
    }
    return null;
  }, [tower.type, sections.length]);

  // Add base for tower
  const renderBase = useMemo(() => {
    return (
      <mesh position={[0, -((sections.length * 0.5) / 2 + 0.25), 0]}>
        <cylinderGeometry args={[0.7, 0.7, 0.2, 32]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
    );
  }, [sections.length]);

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={[rotation[0], rotation[1], rotation[2]]}
      scale={[scale, scale, scale]}
    >
      {renderSections}
      {renderWaterFlow}
      {renderBase}
    </group>
  );
};

export default Tower3D;