import * as tf from '@tensorflow/tfjs';
import { InsertDetection } from '@shared/schema';

// Mapping of model output indices to mineral names
const MINERAL_MAPPING: Record<number, { id: number, name: string }> = {
  0: { id: 1, name: 'Iron Ore' },
  1: { id: 2, name: 'Gold' },
  2: { id: 3, name: 'Copper' },
  3: { id: 4, name: 'Quartz' },
  4: { id: 5, name: 'Silver' }
};

// Simplified detector class for mineral detection
export class MineralDetector {
  private model: tf.LayersModel | null = null;
  private isLoading: boolean = false;
  private modelVersion: string = '1.0.0';

  constructor() {
    this.loadModel();
  }

  async loadModel(): Promise<void> {
    if (this.model || this.isLoading) return;
    
    this.isLoading = true;
    
    try {
      // For demo purposes, we'll just create a simple model
      const model = tf.sequential();
      
      model.add(tf.layers.conv2d({
        inputShape: [224, 224, 3],
        filters: 16,
        kernelSize: 3,
        activation: 'relu'
      }));
      
      model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
      model.add(tf.layers.conv2d({ filters: 32, kernelSize: 3, activation: 'relu' }));
      model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
      model.add(tf.layers.conv2d({ filters: 64, kernelSize: 3, activation: 'relu' }));
      model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
      model.add(tf.layers.flatten());
      model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
      model.add(tf.layers.dense({ units: 5, activation: 'softmax' }));
      
      model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });
      
      this.model = model;
    } catch (error) {
      console.error('Failed to load mineral detection model:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Pre-process the image for the model
  private preprocessImage(imageData: HTMLImageElement | HTMLCanvasElement | ImageData): tf.Tensor {
    return tf.tidy(() => {
      // Convert the image to a tensor
      let tensor = tf.browser.fromPixels(imageData);
      
      // Resize the image
      tensor = tf.image.resizeBilinear(tensor, [224, 224]);
      
      // Normalize the pixel values
      tensor = tensor.toFloat().div(tf.scalar(255));
      
      // Add batch dimension
      return tensor.expandDims(0);
    });
  }

  // Detect minerals in an image
  async detectMinerals(
    imageData: HTMLImageElement | HTMLCanvasElement | ImageData,
    sessionId: number
  ): Promise<InsertDetection[]> {
    if (!this.model) {
      await this.loadModel();
      if (!this.model) {
        throw new Error('Model failed to load');
      }
    }
    
    const detections: InsertDetection[] = [];
    
    try {
      const processedImage = this.preprocessImage(imageData);
      
      // Run the model
      const predictions = await this.model.predict(processedImage) as tf.Tensor;
      
      // Get the results
      const values = await predictions.data();
      
      // Convert image to Base64 for storage if it's a canvas or ImageData
      let imageBase64 = '';
      if (imageData instanceof HTMLCanvasElement) {
        imageBase64 = imageData.toDataURL('image/jpeg', 0.7);
      }
      
      // Create detection objects
      for (let i = 0; i < values.length; i++) {
        const confidence = values[i] * 100; // Convert to percentage
        
        // Only include detections with confidence over 30%
        if (confidence > 30) {
          const mineral = MINERAL_MAPPING[i];
          
          detections.push({
            sessionId,
            mineralId: mineral.id,
            confidence,
            imageData: imageBase64,
            metadata: {
              modelVersion: this.modelVersion,
              timestamp: new Date().toISOString()
            }
          });
        }
      }
      
      // Clean up tensors
      processedImage.dispose();
      predictions.dispose();
      
      return detections;
    } catch (error) {
      console.error('Detection error:', error);
      throw error;
    }
  }

  // Simulate detection for demo/testing
  simulateDetection(sessionId: number): InsertDetection[] {
    const detections: InsertDetection[] = [];
    const detectionCount = Math.floor(Math.random() * 3) + 1; // 1-3 detections
    
    for (let i = 0; i < detectionCount; i++) {
      const mineralIndex = Math.floor(Math.random() * 5); // 0-4
      const mineral = MINERAL_MAPPING[mineralIndex];
      
      // Generate a random confidence between 50-100%
      const baseConfidence = 50;
      const randomConfidence = Math.random() * (100 - baseConfidence);
      const confidence = baseConfidence + randomConfidence;
      
      detections.push({
        sessionId,
        mineralId: mineral.id,
        confidence,
        imageData: '',
        metadata: {
          modelVersion: this.modelVersion,
          simulated: true,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    return detections;
  }
}

// Create a singleton instance
export const mineralDetector = new MineralDetector();
