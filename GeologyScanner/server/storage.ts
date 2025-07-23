import { 
  users, type User, type InsertUser,
  scans, type Scan, type InsertScan,
  minerals, type Mineral, type InsertMineral,
  mlModels, type MlModel, type InsertMlModel,
  mlAnalyses, type MlAnalysis, type InsertMlAnalysis,
  scanHistory, type ScanHistory, type InsertScanHistory
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Scans
  getScan(id: number): Promise<Scan | undefined>;
  createScan(scan: InsertScan): Promise<Scan>;
  getAllScans(): Promise<Scan[]>;
  getUserScans(userId: number): Promise<Scan[]>;
  getRecentScans(limit?: number): Promise<Scan[]>;
  
  // Minerals
  getMineral(id: number): Promise<Mineral | undefined>;
  createMineral(mineral: InsertMineral): Promise<Mineral>;
  getAllMinerals(): Promise<Mineral[]>;
  getScanMinerals(scanId: number): Promise<Mineral[]>;
  
  // ML Models
  getMlModel(id: number): Promise<MlModel | undefined>;
  createMlModel(model: InsertMlModel): Promise<MlModel>;
  getAllMlModels(): Promise<MlModel[]>;
  getActiveMlModel(): Promise<MlModel | undefined>;
  setMlModelActive(id: number): Promise<MlModel>;
  
  // ML Analysis
  createMlAnalysis(analysis: InsertMlAnalysis): Promise<MlAnalysis>;
  getScanAnalyses(scanId: number): Promise<MlAnalysis[]>;
  getAnalysis(id: number): Promise<MlAnalysis | undefined>;
  getAllAnalyses(): Promise<MlAnalysis[]>;
  
  // Scan History
  createScanHistory(history: InsertScanHistory): Promise<ScanHistory>;
  getScanHistory(scanId: number): Promise<ScanHistory[]>;
  getUserScanHistory(userId: number): Promise<ScanHistory[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  // Scan methods
  async getScan(id: number): Promise<Scan | undefined> {
    const [scan] = await db.select().from(scans).where(eq(scans.id, id));
    return scan;
  }

  async createScan(insertScan: InsertScan): Promise<Scan> {
    const [scan] = await db.insert(scans).values(insertScan).returning();
    return scan;
  }
  
  async getAllScans(): Promise<Scan[]> {
    return db.select().from(scans).orderBy(desc(scans.timestamp));
  }
  
  async getUserScans(userId: number): Promise<Scan[]> {
    return db.select().from(scans).where(eq(scans.userId, userId)).orderBy(desc(scans.timestamp));
  }
  
  async getRecentScans(limit: number = 10): Promise<Scan[]> {
    return db.select().from(scans).orderBy(desc(scans.timestamp)).limit(limit);
  }

  // Mineral methods
  async getMineral(id: number): Promise<Mineral | undefined> {
    const [mineral] = await db.select().from(minerals).where(eq(minerals.id, id));
    return mineral;
  }

  async createMineral(insertMineral: InsertMineral): Promise<Mineral> {
    const [mineral] = await db.insert(minerals).values(insertMineral).returning();
    return mineral;
  }
  
  async getAllMinerals(): Promise<Mineral[]> {
    return db.select().from(minerals);
  }
  
  async getScanMinerals(scanId: number): Promise<Mineral[]> {
    return db.select().from(minerals).where(eq(minerals.scanId, scanId));
  }

  // ML Model methods
  async getMlModel(id: number): Promise<MlModel | undefined> {
    const [model] = await db.select().from(mlModels).where(eq(mlModels.id, id));
    return model;
  }

  async createMlModel(insertMlModel: InsertMlModel): Promise<MlModel> {
    // If this model is set as active, set all others to inactive
    if (insertMlModel.isActive) {
      await db.update(mlModels).set({ isActive: false }).where(eq(mlModels.isActive, true));
    }
    
    const [model] = await db.insert(mlModels).values(insertMlModel).returning();
    return model;
  }
  
  async getAllMlModels(): Promise<MlModel[]> {
    return db.select().from(mlModels);
  }
  
  async getActiveMlModel(): Promise<MlModel | undefined> {
    const [model] = await db.select().from(mlModels).where(eq(mlModels.isActive, true));
    return model;
  }
  
  async setMlModelActive(id: number): Promise<MlModel> {
    // Set all models to inactive
    await db.update(mlModels).set({ isActive: false });
    
    // Set the specified model to active
    const [model] = await db.update(mlModels)
      .set({ isActive: true })
      .where(eq(mlModels.id, id))
      .returning();
    
    if (!model) {
      throw new Error(`ML Model with id ${id} not found`);
    }
    
    return model;
  }
  
  // ML Analysis methods
  async createMlAnalysis(insertAnalysis: InsertMlAnalysis): Promise<MlAnalysis> {
    const [analysis] = await db.insert(mlAnalyses).values(insertAnalysis).returning();
    return analysis;
  }
  
  async getScanAnalyses(scanId: number): Promise<MlAnalysis[]> {
    return db.select().from(mlAnalyses)
      .where(eq(mlAnalyses.scanId, scanId))
      .orderBy(desc(mlAnalyses.analysisDate));
  }
  
  async getAnalysis(id: number): Promise<MlAnalysis | undefined> {
    const [analysis] = await db.select().from(mlAnalyses).where(eq(mlAnalyses.id, id));
    return analysis;
  }
  
  async getAllAnalyses(): Promise<MlAnalysis[]> {
    return db.select().from(mlAnalyses).orderBy(desc(mlAnalyses.analysisDate));
  }
  
  // Scan History methods
  async createScanHistory(insertHistory: InsertScanHistory): Promise<ScanHistory> {
    const [history] = await db.insert(scanHistory).values(insertHistory).returning();
    return history;
  }
  
  async getScanHistory(scanId: number): Promise<ScanHistory[]> {
    return db.select().from(scanHistory)
      .where(eq(scanHistory.scanId, scanId))
      .orderBy(desc(scanHistory.timestamp));
  }
  
  async getUserScanHistory(userId: number): Promise<ScanHistory[]> {
    return db.select().from(scanHistory)
      .where(eq(scanHistory.userId, userId))
      .orderBy(desc(scanHistory.timestamp));
  }
}

// Initialize the database with seed data
async function seedDatabase() {
  try {
    const userCount = await db.select().from(users);
    
    if (!userCount || userCount.length === 0) {
      console.log("Seeding database with initial data...");
      
      // Create a default user
      await db.insert(users).values({
        username: "alex",
        password: "password123", // In a real app, this would be hashed
        fullName: "Alex Morgan",
        role: "geologist"
      });
      
      // Create a default ML model
      await db.insert(mlModels).values({
        name: "MineralNetV1",
        version: "1.0.0",
        accuracy: 0.927,
        isActive: true,
        updatedAt: new Date(),
        parameters: {
          layers: 24,
          optimizer: "adam",
          inputShape: [224, 224, 3]
        }
      });
      
      // Create sample ML models for different mineral types
      await db.insert(mlModels).values([
        {
          name: "RareMineralDetector",
          version: "0.9.5",
          accuracy: 0.883,
          isActive: false,
          updatedAt: new Date(),
          parameters: {
            layers: 32,
            optimizer: "sgd",
            inputShape: [299, 299, 3],
            specializedFor: ["iridium", "platinum", "palladium"]
          }
        },
        {
          name: "GeologicalMapper",
          version: "1.2.0",
          accuracy: 0.912,
          isActive: false,
          updatedAt: new Date(),
          parameters: {
            layers: 18,
            optimizer: "rmsprop",
            inputShape: [512, 512, 3],
            specializedFor: ["terrain", "formations", "structures"]
          }
        }
      ]);
      
      console.log("Database seeded successfully");
    } else {
      console.log("Database already contains data, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seedDatabase().catch(console.error);

export const storage = new DatabaseStorage();
