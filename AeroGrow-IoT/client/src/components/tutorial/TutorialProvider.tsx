import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, X, Info, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Tutorial Context Types
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetSelector: string; // CSS selector for highlighting
  position: 'top' | 'right' | 'bottom' | 'left' | 'center';
  image?: string; // Optional image URL
  isNew?: boolean; // Indicates a new feature
  isImportant?: boolean; // Indicates an important feature
}

interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  tutorialSteps: TutorialStep[];
  showTutorial: (tutorialId: string) => void;
  hideTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  skipTutorial: () => void;
  hasSeenTutorial: (tutorialId: string) => boolean;
  markTutorialAsSeen: (tutorialId: string) => void;
}

const TutorialContext = createContext<TutorialContextType>({
  isActive: false,
  currentStepIndex: 0,
  currentStep: null,
  tutorialSteps: [],
  showTutorial: () => {},
  hideTutorial: () => {},
  nextStep: () => {},
  prevStep: () => {},
  goToStep: () => {},
  skipTutorial: () => {},
  hasSeenTutorial: () => false,
  markTutorialAsSeen: () => {},
});

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTutorialId, setCurrentTutorialId] = useState<string>('');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([]);
  const { toast } = useToast();
  
  // Keep track of which tutorials the user has seen
  const [seenTutorials, setSeenTutorials] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('seenTutorials');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('Error loading seen tutorials:', error);
      return {};
    }
  });
  
  // Tutorials data
  const tutorials: Record<string, TutorialStep[]> = {
    'main-dashboard': [
      {
        id: 'welcome',
        title: 'Welcome to VertiGrow',
        description: 'This quick tour will help you get familiar with the core features of the system. You can restart this tutorial any time from the help menu.',
        targetSelector: 'body',
        position: 'center',
        isImportant: true
      },
      {
        id: 'dashboard-overview',
        title: 'Main Dashboard',
        description: 'The dashboard gives you a quick overview of all your vertical farming operations. Monitor key metrics and take action when needed.',
        targetSelector: '.dashboard-content',
        position: 'top'
      },
      {
        id: 'navigation',
        title: 'Navigation Menu',
        description: 'Use the sidebar to navigate between different sections like Plants, Device Management, and Reports.',
        targetSelector: '.sidebar',
        position: 'right'
      },
      {
        id: 'network-topology',
        title: 'Network Topology',
        description: 'The network view shows all your connected towers and devices. Click on any node to see details and controls.',
        targetSelector: '.network-topology',
        position: 'bottom',
        isNew: true
      },
      {
        id: 'notifications',
        title: 'Notifications Center',
        description: 'Never miss important alerts. You can filter notifications by criticality level to focus on what matters most.',
        targetSelector: '.notifications-trigger',
        position: 'left'
      }
    ],
    'digital-twin': [
      {
        id: 'digital-twin-intro',
        title: 'Digital Twin Technology',
        description: 'Our 3D visualization lets you monitor and control your vertical farm from anywhere. Interact with the 3D model to select specific towers.',
        targetSelector: '.digital-twin-canvas',
        position: 'top',
        isNew: true
      },
      {
        id: 'twin-controls',
        title: 'Interactive Controls',
        description: 'Use these controls to rotate, zoom, and pan around your virtual farm. Click on any tower to see detailed metrics and controls.',
        targetSelector: '.digital-twin-controls',
        position: 'right'
      }
    ],
    'plants': [
      {
        id: 'plants-intro',
        title: 'Plants Management',
        description: 'Track the growth and performance metrics of all your plants across multiple towers and harvests.',
        targetSelector: '.plants-dashboard',
        position: 'top'
      },
      {
        id: 'plants-charts',
        title: 'Performance Analytics',
        description: 'These charts show how different plant varieties perform under various conditions. Use this data to optimize growth parameters.',
        targetSelector: '.plants-charts',
        position: 'bottom',
        isImportant: true
      }
    ]
  };
  
  const showTutorial = (tutorialId: string) => {
    if (tutorials[tutorialId]) {
      setCurrentTutorialId(tutorialId);
      setTutorialSteps(tutorials[tutorialId]);
      setCurrentStepIndex(0);
      setIsActive(true);
    } else {
      console.error(`Tutorial with ID "${tutorialId}" not found`);
    }
  };
  
  const hideTutorial = () => {
    setIsActive(false);
    
    // If the tutorial was completed, mark it as seen
    if (currentStepIndex === tutorialSteps.length - 1) {
      markTutorialAsSeen(currentTutorialId);
    }
  };
  
  const nextStep = () => {
    if (currentStepIndex < tutorialSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Last step - mark as completed and close
      markTutorialAsSeen(currentTutorialId);
      hideTutorial();
      
      toast({
        title: "Tutorial Completed",
        description: "You've completed the tutorial. You can restart it anytime from the help menu.",
        variant: "default"
      });
    }
  };
  
  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const goToStep = (index: number) => {
    if (index >= 0 && index < tutorialSteps.length) {
      setCurrentStepIndex(index);
    }
  };
  
  const skipTutorial = () => {
    markTutorialAsSeen(currentTutorialId);
    hideTutorial();
    
    toast({
      title: "Tutorial Skipped",
      description: "You can restart the tutorial anytime from the help menu.",
      variant: "default"
    });
  };
  
  const hasSeenTutorial = (tutorialId: string): boolean => {
    return !!seenTutorials[tutorialId];
  };
  
  const markTutorialAsSeen = (tutorialId: string) => {
    const updated = { ...seenTutorials, [tutorialId]: true };
    setSeenTutorials(updated);
    
    // Save to localStorage
    try {
      localStorage.setItem('seenTutorials', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving seen tutorials:', error);
    }
  };
  
  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStepIndex,
        currentStep: isActive ? tutorialSteps[currentStepIndex] : null,
        tutorialSteps,
        showTutorial,
        hideTutorial,
        nextStep,
        prevStep,
        goToStep,
        skipTutorial,
        hasSeenTutorial,
        markTutorialAsSeen
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);

export default TutorialProvider;