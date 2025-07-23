import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/scan", icon: "camera", label: "Scan" },
    { href: "/map", icon: "map", label: "Map" },
    { href: "/database", icon: "database", label: "Data" },
    { href: "/profile", icon: "user", label: "Profile" }
  ];

  return (
    <div className="lg:hidden bg-card border-t border-border py-2 px-4">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "flex flex-col items-center",
              location === item.href ? "text-primary" : "text-muted-foreground"
            )}>
              <i className={`fa-solid fa-${item.icon} text-lg`}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
