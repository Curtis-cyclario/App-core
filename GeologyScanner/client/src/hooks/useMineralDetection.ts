import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { detectMineralsFromImage } from "@/lib/mineralDetection";

interface MineralDetection {
  name: string;
  confidence: number;
  composition?: Record<string, number>;
}

interface DetectionResult {
  minerals: MineralDetection[];
  overallConfidence: number;
}

interface UseMineralDetectionHook {
  detectMinerals: (
    imageData: string, 
    latitude?: number, 
    longitude?: number
  ) => Promise<DetectionResult>;
  isProcessing: boolean;
  error: string | null;
}

export function useMineralDetection(): UseMineralDetectionHook {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const detectMinerals = async (
    imageData: string,
    latitude?: number,
    longitude?: number
  ): Promise<DetectionResult> => {
    setIsProcessing(true);
    setError(null);

    try {
      // First try to process the image client-side using TensorFlow.js
      try {
        const localResults = await detectMineralsFromImage(imageData);
        // If local detection is successful, return the results
        setIsProcessing(false);
        return localResults;
      } catch (localError) {
        // If local detection fails, fall back to server-side processing
        console.log("Local mineral detection failed, using server-side detection");
      }

      // Send the image to the server for processing
      const response = await apiRequest("POST", "/api/detect-minerals", {
        imageData,
        latitude,
        longitude
      });

      const results = await response.json();
      
      setIsProcessing(false);
      return results;
    } catch (error) {
      setIsProcessing(false);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      throw error;
    }
  };

  return { detectMinerals, isProcessing, error };
}
