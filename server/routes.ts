import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMedicineSchema, insertDonationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Medicine routes
  app.get("/api/medicines", async (req, res) => {
    try {
      const medicines = await storage.getMedicines();
      res.json(medicines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medicines" });
    }
  });

  app.get("/api/medicines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const medicine = await storage.getMedicine(id);
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json(medicine);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medicine" });
    }
  });

  app.post("/api/medicines", async (req, res) => {
    try {
      const validatedData = insertMedicineSchema.parse(req.body);
      const medicine = await storage.createMedicine(validatedData);
      res.status(201).json(medicine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create medicine" });
    }
  });

  app.put("/api/medicines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMedicineSchema.partial().parse(req.body);
      const medicine = await storage.updateMedicine(id, validatedData);
      if (!medicine) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.json(medicine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update medicine" });
    }
  });

  app.delete("/api/medicines/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMedicine(id);
      if (!deleted) {
        return res.status(404).json({ message: "Medicine not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete medicine" });
    }
  });

  // Donation routes
  app.get("/api/donations", async (req, res) => {
    try {
      const donations = await storage.getDonations();
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(validatedData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create donation" });
    }
  });

  app.put("/api/donations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDonationSchema.partial().parse(req.body);
      const donation = await storage.updateDonation(id, validatedData);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update donation" });
    }
  });

  // NGO routes
  app.get("/api/ngos", async (req, res) => {
    try {
      const ngos = await storage.getNGOs();
      res.json(ngos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch NGOs" });
    }
  });

  // Statistics endpoint
  app.get("/api/statistics", async (req, res) => {
    try {
      const medicines = await storage.getMedicines();
      const donations = await storage.getDonations();
      
      const stats = {
        totalMedicines: medicines.length,
        expiringSoon: medicines.filter(m => m.status === "warning").length,
        expired: medicines.filter(m => m.status === "expired").length,
        donated: donations.filter(d => d.status === "completed").length,
        pendingPickups: donations.filter(d => d.status === "pending").length,
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
