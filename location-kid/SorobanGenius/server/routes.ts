import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gameSettingsSchema, gameSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create new game session
  app.post("/api/game/start", async (req, res) => {
    try {
      const settings = gameSettingsSchema.parse(req.body);
      const session = await storage.createGameSession(settings);
      res.json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid game settings" });
    }
  });

  // Get game session
  app.get("/api/game/:id", async (req, res) => {
    try {
      const session = await storage.getGameSession(req.params.id);
      if (!session) {
        return res.status(404).json({ error: "Game session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to get game session" });
    }
  });

  // Update game session
  app.put("/api/game/:id", async (req, res) => {
    try {
      // Convert date strings back to Date objects
      const sessionData = {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: req.body.endTime ? new Date(req.body.endTime) : null
      };
      
      const session = gameSessionSchema.parse(sessionData);
      const updatedSession = await storage.updateGameSession(session);
      res.json(updatedSession);
    } catch (error) {
      console.error('Session update error:', error);
      res.status(400).json({ 
        error: "Invalid session data", 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get game statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getGameStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get statistics" });
    }
  });

  // Update game statistics
  app.put("/api/stats", async (req, res) => {
    try {
      const stats = await storage.updateGameStats(req.body);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid statistics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
