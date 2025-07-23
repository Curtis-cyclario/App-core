import { useState, useEffect } from "react";

interface UseCameraHook {
  hasCamera: boolean;
  cameraError: string | null;
}

export function useCamera(): UseCameraHook {
  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    async function checkCameraAvailability() {
      try {
        // Check if media devices API is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setCameraError("Camera access is not supported by your browser");
          return;
        }

        // Try to access the camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        // Camera is available
        setHasCamera(true);
        
        // Stop tracks to release the camera
        stream.getTracks().forEach(track => track.stop());
      } catch (error) {
        // Camera access denied or error occurred
        if (error instanceof Error) {
          setCameraError(error.message);
        } else {
          setCameraError("Failed to access camera");
        }
        setHasCamera(false);
      }
    }

    checkCameraAvailability();
  }, []);

  return { hasCamera, cameraError };
}
