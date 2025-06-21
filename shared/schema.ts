import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const medicines = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // tablet, capsule, syrup, injection, cream
  quantity: integer("quantity").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  batchNumber: text("batch_number"),
  barcode: text("barcode"),
  notes: text("notes"),
  status: text("status").notNull().default("good"), // good, warning, expired
  createdAt: timestamp("created_at").defaultNow(),
});

export const donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  ngoName: text("ngo_name").notNull(),
  pickupDate: timestamp("pickup_date").notNull(),
  pickupTime: text("pickup_time").notNull(),
  address: text("address").notNull(),
  contactNumber: text("contact_number").notNull(),
  specialInstructions: text("special_instructions"),
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  medicineIds: text("medicine_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ngos = pgTable("ngos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  address: text("address").notNull(),
  active: boolean("active").default(true),
});

export const insertMedicineSchema = createInsertSchema(medicines).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertNgoSchema = createInsertSchema(ngos).omit({
  id: true,
});

export type Medicine = typeof medicines.$inferSelect;
export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type NGO = typeof ngos.$inferSelect;
export type InsertNGO = z.infer<typeof insertNgoSchema>;
