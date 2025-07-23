import * as React from "react"

const MOBILE_BREAKPOINT = 768

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: DeviceType;
  isNativeMobile: boolean; // true if accessed via native mobile app
  isPWA: boolean; // true if running as Progressive Web App
  isStandalone: boolean; // true if in standalone mode
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
    isNativeMobile: false,
    isPWA: false,
    isStandalone: false
  });

  React.useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      
      // Check for standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone || false;
      
      // Check for mobile app webview
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isNativeMobile = /vertigrow-app/.test(userAgent);
      
      // Check if it's a PWA
      const isPWA = isStandalone || 
                   (window.matchMedia('(display-mode: fullscreen)').matches) || 
                   (window.navigator as any).standalone;
      
      // Determine device type based on screen width
      let deviceType: DeviceType = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = true;
      
      if (width < 768) {
        deviceType = 'mobile';
        isMobile = true;
        isTablet = false;
        isDesktop = false;
      } else if (width >= 768 && width < 1024) {
        deviceType = 'tablet';
        isMobile = false;
        isTablet = true;
        isDesktop = false;
      }
      
      setDeviceInfo({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
        isNativeMobile,
        isPWA,
        isStandalone
      });
    };

    // Initial check
    checkDevice();
    
    // Check on resize
    window.addEventListener('resize', checkDevice);
    
    // Check on orientation change for mobile devices
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return deviceInfo;
}
