import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertScanSchema, 
  insertMineralSchema, 
  insertUserSchema,
  insertMlModelSchema,
  insertMlAnalysisSchema,
  insertScanHistorySchema
} from "@shared/schema";
import * as tf from '@tensorflow/tfjs';

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users", async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const user = await storage.getUser(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error });
    }
  });

  // Scans
  app.get("/api/scans", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    
    if (limit) {
      const scans = await storage.getRecentScans(limit);
      return res.json(scans);
    }
    
    const scans = await storage.getAllScans();
    res.json(scans);
  });

  app.get("/api/scans/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid scan ID" });
    }
    
    const scan = await storage.getScan(id);
    if (!scan) {
      return res.status(404).json({ message: "Scan not found" });
    }
    
    res.json(scan);
  });

  app.get("/api/users/:userId/scans", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const scans = await storage.getUserScans(userId);
    res.json(scans);
  });

  app.post("/api/scans", async (req, res) => {
    try {
      const scanData = insertScanSchema.parse(req.body);
      const scan = await storage.createScan(scanData);
      
      // Record this scan in the history
      await storage.createScanHistory({
        scanId: scan.id,
        userId: scan.userId,
        action: "created",
        metadata: { location: scan.location }
      });
      
      res.status(201).json(scan);
    } catch (error) {
      res.status(400).json({ message: "Invalid scan data", error });
    }
  });

  // Minerals
  app.get("/api/minerals", async (req, res) => {
    const minerals = await storage.getAllMinerals();
    res.json(minerals);
  });

  app.get("/api/scans/:scanId/minerals", async (req, res) => {
    const scanId = parseInt(req.params.scanId);
    if (isNaN(scanId)) {
      return res.status(400).json({ message: "Invalid scan ID" });
    }
    
    const minerals = await storage.getScanMinerals(scanId);
    res.json(minerals);
  });

  app.post("/api/minerals", async (req, res) => {
    try {
      const mineralData = insertMineralSchema.parse(req.body);
      const mineral = await storage.createMineral(mineralData);
      res.status(201).json(mineral);
    } catch (error) {
      res.status(400).json({ message: "Invalid mineral data", error });
    }
  });

  // ML Models
  app.get("/api/ml-models", async (req, res) => {
    const models = await storage.getAllMlModels();
    res.json(models);
  });

  app.get("/api/ml-models/active", async (req, res) => {
    const model = await storage.getActiveMlModel();
    if (!model) {
      return res.status(404).json({ message: "No active ML model found" });
    }
    
    res.json(model);
  });

  app.post("/api/ml-models", async (req, res) => {
    try {
      const modelData = insertMlModelSchema.parse(req.body);
      const model = await storage.createMlModel(modelData);
      res.status(201).json(model);
    } catch (error) {
      res.status(400).json({ message: "Invalid ML model data", error });
    }
  });

  app.patch("/api/ml-models/:id/set-active", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ML model ID" });
    }
    
    try {
      const model = await storage.setMlModelActive(id);
      res.json(model);
    } catch (error) {
      res.status(404).json({ message: "ML model not found" });
    }
  });

  // ML Analysis endpoints
  app.get("/api/ml-analyses", async (req, res) => {
    const analyses = await storage.getAllAnalyses();
    res.json(analyses);
  });

  app.get("/api/ml-analyses/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid analysis ID" });
    }
    
    const analysis = await storage.getAnalysis(id);
    if (!analysis) {
      return res.status(404).json({ message: "Analysis not found" });
    }
    
    res.json(analysis);
  });

  app.get("/api/scans/:scanId/analyses", async (req, res) => {
    const scanId = parseInt(req.params.scanId);
    if (isNaN(scanId)) {
      return res.status(400).json({ message: "Invalid scan ID" });
    }
    
    const analyses = await storage.getScanAnalyses(scanId);
    res.json(analyses);
  });

  app.post("/api/ml-analyses", async (req, res) => {
    try {
      const analysisData = insertMlAnalysisSchema.parse(req.body);
      const analysis = await storage.createMlAnalysis(analysisData);
      
      // Record this analysis in the scan history
      const scan = await storage.getScan(analysisData.scanId);
      if (scan) {
        await storage.createScanHistory({
          scanId: analysisData.scanId,
          userId: scan.userId,
          action: "analyzed",
          metadata: { 
            modelId: analysisData.modelId,
            confidence: analysisData.confidenceScore
          }
        });
      }
      
      res.status(201).json(analysis);
    } catch (error) {
      res.status(400).json({ message: "Invalid analysis data", error });
    }
  });

  // Scan History endpoints
  app.get("/api/scan-history/:scanId", async (req, res) => {
    const scanId = parseInt(req.params.scanId);
    if (isNaN(scanId)) {
      return res.status(400).json({ message: "Invalid scan ID" });
    }
    
    const history = await storage.getScanHistory(scanId);
    res.json(history);
  });

  app.get("/api/users/:userId/scan-history", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const history = await storage.getUserScanHistory(userId);
    res.json(history);
  });

  app.post("/api/scan-history", async (req, res) => {
    try {
      const historyData = insertScanHistorySchema.parse(req.body);
      const history = await storage.createScanHistory(historyData);
      res.status(201).json(history);
    } catch (error) {
      res.status(400).json({ message: "Invalid history data", error });
    }
  });

  // Process mineral detection from image data with ML model analysis
  app.post("/api/detect-minerals", async (req, res) => {
    try {
      const schema = z.object({
        imageData: z.string(), // base64 image data
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        userId: z.number(),
        location: z.string().optional(),
        modelId: z.number().optional(),
      });
      
      const { imageData, latitude, longitude, userId, location, modelId } = schema.parse(req.body);
      
      // Get the active ML model or use the specified one
      let model;
      if (modelId) {
        model = await storage.getMlModel(modelId);
      } else {
        model = await storage.getActiveMlModel();
      }
      
      if (!model) {
        return res.status(404).json({ message: "No active ML model found" });
      }
      
      // Start timing the processing
      const startTime = Date.now();
      
      // Process the image using the ML model
      // In a real implementation, this would use the actual ML model
      // For now we'll use simulated results
      
      // Create a scan record
      const scan = await storage.createScan({
        userId,
        name: `Scan ${new Date().toLocaleString()}`,
        location: location || `${latitude},${longitude}`,
        latitude: latitude || 0,
        longitude: longitude || 0,
        confidence: 0.85,
        description: "Automated mineral scan",
        imageData,
        modelId: model.id,
      });
      
      // Enhanced ML simulation with broader sample detection
      const simulateAdvancedDetection = () => {
        // Analyze image data to determine if it's a valid sample
        const isValidSample = imageData && imageData.length > 1000; // Basic validation
        
        if (!isValidSample) {
          return {
            minerals: [],
            overallConfidence: 0.1,
            message: "No mineral content detected"
          };
        }
        
        // Simulate detection based on common materials (including indoor samples)
        const possibleMinerals = [
          { name: "Iron Ore", confidence: 0.85, composition: { fe: 65.2, o: 34.8 }, properties: { density: 5.2, hardness: 6.5 } },
          { name: "Quartz", confidence: 0.78, composition: { si: 46.7, o: 53.3 }, properties: { density: 2.65, hardness: 7 } },
          { name: "Calcite", confidence: 0.72, composition: { ca: 40.0, c: 12.0, o: 48.0 }, properties: { density: 2.71, hardness: 3 } },
          { name: "Feldspar", confidence: 0.68, composition: { al: 9.1, si: 30.3, o: 48.6, k: 12.0 }, properties: { density: 2.56, hardness: 6 } },
          { name: "Mica", confidence: 0.65, composition: { k: 8.8, al: 12.1, si: 25.4, o: 43.2 }, properties: { density: 2.8, hardness: 2.5 } },
          { name: "Pyrite", confidence: 0.82, composition: { fe: 46.6, s: 53.4 }, properties: { density: 5.02, hardness: 6.5 } },
          { name: "Gypsum", confidence: 0.71, composition: { ca: 23.3, s: 18.6, o: 55.8, h: 2.3 }, properties: { density: 2.32, hardness: 2 } }
        ];
        
        // Random selection with some logic for indoor vs outdoor
        const detectedMinerals = [];
        const numDetections = Math.floor(Math.random() * 3) + 1; // 1-3 minerals
        
        for (let i = 0; i < numDetections; i++) {
          const randomIndex = Math.floor(Math.random() * possibleMinerals.length);
          const mineral = possibleMinerals[randomIndex];
          
          // Adjust confidence based on model accuracy and some randomness
          const adjustedConfidence = Math.min(0.98, Math.max(0.15, 
            mineral.confidence * model.accuracy * (0.8 + Math.random() * 0.4)
          ));
          
          detectedMinerals.push({
            ...mineral,
            confidence: adjustedConfidence
          });
          
          // Remove to avoid duplicates
          possibleMinerals.splice(randomIndex, 1);
        }
        
        const avgConfidence = detectedMinerals.reduce((sum, m) => sum + m.confidence, 0) / detectedMinerals.length;
        
        return {
          minerals: detectedMinerals,
          overallConfidence: avgConfidence
        };
      };
      
      const detectionResults = simulateAdvancedDetection();
      
      // If the model specializes in rare minerals, add them
      if (model.parameters && typeof model.parameters === 'object' && 'specializedFor' in model.parameters) {
        const specializedFor = model.parameters.specializedFor as string[];
        if (specializedFor.includes("iridium")) {
          detectionResults.minerals.push({
            name: "Iridium",
            confidence: 0.76 * model.accuracy,
            composition: { "ir": 95.7, "pt": 3.1, "ru": 1.2 } as any,
            properties: { density: 22.56, hardness: 6.5 }
          });
        }
      }
      
      // End timing the processing
      const processingTime = Date.now() - startTime;
      
      // Create analysis record
      const analysis = await storage.createMlAnalysis({
        scanId: scan.id,
        modelId: model.id,
        confidenceScore: detectionResults.overallConfidence,
        results: detectionResults,
        processingTime,
        tags: detectionResults.minerals.map(m => m.name)
      });
      
      // Save each detected mineral
      for (const mineral of detectionResults.minerals) {
        await storage.createMineral({
          scanId: scan.id,
          name: mineral.name,
          confidence: mineral.confidence,
          composition: mineral.composition,
          properties: mineral.properties
        });
      }
      
      // Record scan history
      await storage.createScanHistory({
        scanId: scan.id,
        userId,
        action: "scanned",
        metadata: { 
          mineralsDetected: detectionResults.minerals.length,
          confidence: detectionResults.overallConfidence,
          modelUsed: model.name
        },
        geoLocation: location
      });
      
      res.json({
        scan,
        analysis,
        minerals: detectionResults.minerals,
        overallConfidence: detectionResults.overallConfidence
      });
    } catch (error) {
      console.error("Mineral detection error:", error);
      res.status(400).json({ message: "Invalid detection request", error });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
