import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTutorial } from './TutorialProvider';

interface TutorialButtonProps {
  className?: string;
}

const TutorialButton: React.FC<TutorialButtonProps> = ({ className }) => {
  const { showTutorial, hasSeenTutorial } = useTutorial();

  const tutorials = [
    { id: 'main-dashboard', name: 'Dashboard Features' },
    { id: 'digital-twin', name: 'Digital Twin' },
    { id: 'plants', name: 'Plants Management' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`tutorial-button relative rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-700 ${className}`}
        >
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">Help & Tutorials</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tutorials & Help</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tutorials.map((tutorial) => (
          <DropdownMenuItem 
            key={tutorial.id} 
            onClick={() => showTutorial(tutorial.id)}
            className="flex items-center justify-between"
          >
            <span>{tutorial.name}</span>
            {hasSeenTutorial(tutorial.id) && (
              <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                Viewed
              </span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>Knowledge Base</DropdownMenuItem>
        <DropdownMenuItem>Contact Support</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TutorialButton;