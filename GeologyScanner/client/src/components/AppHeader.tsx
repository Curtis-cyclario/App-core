import { useState } from "react";
import { Link } from "wouter";
import { 
  FolderSync,
  MenuIcon,
  ChevronDownIcon,
  UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function AppHeader() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);

  // Get active ML model
  const { data: mlModel } = useQuery({
    queryKey: ['/api/ml-models/active'],
  });

  const handleSync = async () => {
    setSyncing(true);
    // Simulate sync with backend
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: "Data synchronized",
        description: "All local data has been synchronized with the server.",
      });
    }, 1500);
  };

  return (
    <header className="bg-dark-lighter shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-xl font-bold">
              <span className="text-primary">GeoScan</span>
              <span className="text-secondary">Pro</span>
            </a>
          </Link>
        </div>
        
        <div className="md:flex items-center hidden">
          <div className="mr-4 text-light-dark text-sm scanning-indicator">
            <span>ML Model: Active</span>
          </div>
          
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleSync}
            disabled={syncing}
          >
            <FolderSync className={`mr-1 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync Data'}
          </Button>
          
          <div className="ml-4 relative">
            <button className="flex items-center text-light-dark hover:text-light">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="" alt="User" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              <span>Alex Morgan</span>
              <ChevronDownIcon className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-light">
              <MenuIcon className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-dark-lighter text-light border-dark-light">
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex items-center mb-6">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Alex Morgan</div>
                  <div className="text-xs text-light-dark">Field Geologist</div>
                </div>
              </div>

              <Button className="justify-start" onClick={handleSync} disabled={syncing}>
                <FolderSync className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Data'}
              </Button>

              <div className="text-sm text-light-dark scanning-indicator">
                <span>ML Model: Active</span>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
