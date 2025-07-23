import { Link, useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MlModelStatus from "./MlModelStatus";
import { 
  LayoutDashboard,
  Brain,
  Database,
  LineChart,
  Settings
} from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();
  
  const isActive = (path: string) => {
    return location === path;
  };
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="w-5" /> },
    { path: "/scan", label: "AI Scanner", icon: <Brain className="w-5" /> },
    { path: "/minerals", label: "Mineral Database", icon: <Database className="w-5" /> },
    { path: "/analysis", label: "ML Analysis", icon: <LineChart className="w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5" /> }
  ];

  return (
    <div className="w-64 bg-dark-lighter border-r border-dark-light flex flex-col">
      <div className="p-4">
        <div className="bg-dark-light rounded-lg p-3 mb-4">
          <div className="flex items-center mb-3">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src="" alt="User" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Alex Morgan</div>
              <div className="text-xs text-light-dark">Field Geologist</div>
            </div>
          </div>
          <div className="flex text-xs text-light-dark bg-dark rounded-md p-2">
            <div className="flex-1">
              <div>Device</div>
              <div className="text-light font-medium mt-1">Scanner Pro X3</div>
            </div>
            <div className="flex-1">
              <div>Status</div>
              <div className="text-secondary font-medium mt-1">Connected</div>
            </div>
          </div>
        </div>
        
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.path} className="mb-1">
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive(item.path) 
                      ? "bg-primary text-white" 
                      : "hover:bg-dark-light text-light-dark hover:text-light"
                  }`}
                  asChild
                >
                  <Link href={item.path}>
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-2">{item.label}</span>
                    </div>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <div className="mt-auto p-4">
        <MlModelStatus />
      </div>
    </div>
  );
}
