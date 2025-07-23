import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name"),
  role: text("role").default("user"),
});

export const usersRelations = relations(users, ({ many }) => ({
  scans: many(scans),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
});

export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  location: text("location").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  description: text("description"),
  confidence: real("confidence").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  imageData: text("image_data"), // base64 encoded image
  modelId: integer("model_id").references(() => mlModels.id),
});

export const scansRelations = relations(scans, ({ one, many }) => ({
  user: one(users, {
    fields: [scans.userId],
    references: [users.id],
  }),
  minerals: many(minerals),
  analyses: many(mlAnalyses),
  mlModel: one(mlModels, {
    fields: [scans.modelId],
    references: [mlModels.id],
  }),
}));

export const insertScanSchema = createInsertSchema(scans).pick({
  userId: true,
  name: true,
  location: true,
  latitude: true,
  longitude: true,
  description: true,
  confidence: true,
  imageData: true,
  modelId: true,
});

export const minerals = pgTable("minerals", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").notNull().references(() => scans.id),
  name: text("name").notNull(),
  confidence: real("confidence").notNull(),
  composition: jsonb("composition"),
  detectionDate: timestamp("detection_date").defaultNow().notNull(),
  properties: jsonb("properties"), // Additional properties of the mineral
});

export const mineralsRelations = relations(minerals, ({ one }) => ({
  scan: one(scans, {
    fields: [minerals.scanId],
    references: [scans.id],
  }),
}));

export const insertMineralSchema = createInsertSchema(minerals).pick({
  scanId: true,
  name: true,
  confidence: true,
  composition: true,
  properties: true,
});

export const mlModels = pgTable("ml_models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  version: text("version").notNull(),
  accuracy: real("accuracy").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  parameters: jsonb("parameters"), // Model parameters and configuration
  trainingDate: timestamp("training_date"),
});

export const mlModelsRelations = relations(mlModels, ({ many }) => ({
  scans: many(scans),
  analyses: many(mlAnalyses),
}));

export const insertMlModelSchema = createInsertSchema(mlModels).pick({
  name: true,
  version: true,
  accuracy: true,
  isActive: true,
  parameters: true,
  trainingDate: true,
});

// New table for ML analysis results
export const mlAnalyses = pgTable("ml_analyses", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").notNull().references(() => scans.id),
  modelId: integer("model_id").notNull().references(() => mlModels.id),
  confidenceScore: real("confidence_score").notNull(),
  analysisDate: timestamp("analysis_date").defaultNow().notNull(),
  results: jsonb("results").notNull(), // Detailed analysis results
  processingTime: real("processing_time"), // Time taken to analyze in milliseconds
  tags: text("tags").array(), // Tags/categories for the analysis
});

export const mlAnalysesRelations = relations(mlAnalyses, ({ one }) => ({
  scan: one(scans, {
    fields: [mlAnalyses.scanId],
    references: [scans.id],
  }),
  model: one(mlModels, {
    fields: [mlAnalyses.modelId],
    references: [mlModels.id],
  }),
}));

export const insertMlAnalysisSchema = createInsertSchema(mlAnalyses).pick({
  scanId: true,
  modelId: true,
  confidenceScore: true,
  results: true,
  processingTime: true,
  tags: true,
});

// Table to store scan history
export const scanHistory = pgTable("scan_history", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").notNull().references(() => scans.id),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // e.g., 'created', 'updated', 'analyzed'
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: jsonb("metadata"), // Additional metadata about the action
  geoLocation: text("geo_location"), // Location where the action was performed
});

export const scanHistoryRelations = relations(scanHistory, ({ one }) => ({
  scan: one(scans, {
    fields: [scanHistory.scanId],
    references: [scans.id],
  }),
  user: one(users, {
    fields: [scanHistory.userId],
    references: [users.id],
  }),
}));

export const insertScanHistorySchema = createInsertSchema(scanHistory).pick({
  scanId: true,
  userId: true,
  action: true,
  metadata: true,
  geoLocation: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;

export type InsertMineral = z.infer<typeof insertMineralSchema>;
export type Mineral = typeof minerals.$inferSelect;

export type InsertMlModel = z.infer<typeof insertMlModelSchema>;
export type MlModel = typeof mlModels.$inferSelect;

export type InsertMlAnalysis = z.infer<typeof insertMlAnalysisSchema>;
export type MlAnalysis = typeof mlAnalyses.$inferSelect;

export type InsertScanHistory = z.infer<typeof insertScanHistorySchema>;
export type ScanHistory = typeof scanHistory.$inferSelect;
