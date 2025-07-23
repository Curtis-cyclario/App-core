import { Link } from "wouter";
import { 
  HomeIcon, 
  CameraIcon, 
  DatabaseIcon, 
  TrendingUpIcon,
  BrainIcon 
} from "lucide-react";

interface MobileNavigationProps {
  currentPath: string;
}

export default function MobileNavigation({ currentPath }: MobileNavigationProps) {
  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="lg:hidden bg-dark-lighter border-t border-dark-light py-2 px-4">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center ${isActive("/") ? "text-primary" : "text-light-dark"}`}>
            <HomeIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/scan">
          <a className={`flex flex-col items-center ${isActive("/scan") ? "text-primary" : "text-light-dark"}`}>
            <BrainIcon className="w-5 h-5" />
            <span className="text-xs mt-1">AI Scan</span>
          </a>
        </Link>
        <Link href="/minerals">
          <a className={`flex flex-col items-center ${isActive("/minerals") ? "text-primary" : "text-light-dark"}`}>
            <DatabaseIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Database</span>
          </a>
        </Link>
        <Link href="/analysis">
          <a className={`flex flex-col items-center ${isActive("/analysis") ? "text-primary" : "text-light-dark"}`}>
            <TrendingUpIcon className="w-5 h-5" />
            <span className="text-xs mt-1">Analysis</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
