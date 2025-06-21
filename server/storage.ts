import { medicines, donations, ngos, users, type Medicine, type Donation, type NGO, type InsertMedicine, type InsertDonation, type InsertNGO, type User, type UpsertUser, type RegisterData } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: RegisterData): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  validateUserPassword(username: string, password: string): Promise<User | null>;
  
  // Medicine operations
  getMedicines(userId?: string): Promise<Medicine[]>;
  getMedicine(id: number): Promise<Medicine | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: number, medicine: Partial<InsertMedicine>): Promise<Medicine | undefined>;
  deleteMedicine(id: number): Promise<boolean>;
  
  // Donation operations
  getDonations(userId?: string): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation | undefined>;
  
  // NGO operations
  getNGOs(): Promise<NGO[]>;
  getNGO(id: number): Promise<NGO | undefined>;
  createNGO(ngo: InsertNGO): Promise<NGO>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with sample NGOs if the table is empty
    this.initializeNGOs();
    this.initializeAdminUser();
  }

  private async initializeNGOs() {
    try {
      const existingNGOs = await db.select().from(ngos);
      
      if (existingNGOs.length === 0) {
        const sampleNGOs: InsertNGO[] = [
          {
            name: "Hope Foundation",
            contactEmail: "contact@hopefoundation.org",
            contactPhone: "+1-555-0101",
            address: "123 Hope Street, Medical District",
            active: true,
          },
          {
            name: "Care NGO",
            contactEmail: "info@carengo.org",
            contactPhone: "+1-555-0102",
            address: "456 Care Avenue, Health Zone",
            active: true,
          },
          {
            name: "Healing Hands",
            contactEmail: "help@healinghands.org",
            contactPhone: "+1-555-0103",
            address: "789 Healing Boulevard, Wellness Center",
            active: true,
          },
          {
            name: "Wellness Trust",
            contactEmail: "support@wellnesstrust.org",
            contactPhone: "+1-555-0104",
            address: "321 Wellness Road, Community Health",
            active: true,
          },
        ];

        await db.insert(ngos).values(sampleNGOs);
      }
    } catch (error) {
      console.error("Error initializing NGOs:", error);
    }
  }

  private async initializeAdminUser() {
    try {
      const existingAdmin = await db.select().from(users).where(eq(users.role, "admin"));
      
      if (existingAdmin.length === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const adminUser: UpsertUser = {
          id: nanoid(),
          username: "admin",
          email: "admin@medtracker.com",
          password: hashedPassword,
          firstName: "System",
          lastName: "Administrator",
          role: "admin",
          active: true,
        };

        await db.insert(users).values(adminUser);
        console.log("Initialized admin user (username: admin, password: admin123)");
      }
    } catch (error) {
      console.error("Error initializing admin user:", error);
    }
  }

  // User authentication methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: RegisterData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: UpsertUser = {
      id: nanoid(),
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || "user",
      active: true,
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return user;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const [upsertedUser] = await db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...user,
          updatedAt: new Date(),
        },
      })
      .returning();
    return upsertedUser;
  }

  async validateUserPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  private calculateMedicineStatus(expiryDate: Date): string {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 7) return "warning";
    return "good";
  }

  // Medicine operations
  async getMedicines(userId?: string): Promise<Medicine[]> {
    return await db.select().from(medicines);
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    const [medicine] = await db.select().from(medicines).where(eq(medicines.id, id));
    return medicine || undefined;
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const expiryDate = new Date(insertMedicine.expiryDate);
    const status = this.calculateMedicineStatus(expiryDate);
    
    const medicineData = {
      ...insertMedicine,
      status,
      expiryDate,
      batchNumber: insertMedicine.batchNumber || null,
      barcode: insertMedicine.barcode || null,
      notes: insertMedicine.notes || null,
    };
    
    const [medicine] = await db
      .insert(medicines)
      .values(medicineData)
      .returning();
    return medicine;
  }

  async updateMedicine(id: number, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const existing = await this.getMedicine(id);
    if (!existing) return undefined;

    const expiryDate = updates.expiryDate ? new Date(updates.expiryDate) : existing.expiryDate;
    const status = this.calculateMedicineStatus(expiryDate);

    const updateData = {
      ...updates,
      status,
      expiryDate,
      batchNumber: updates.batchNumber || null,
      barcode: updates.barcode || null,
      notes: updates.notes || null,
    };

    const [updated] = await db
      .update(medicines)
      .set(updateData)
      .where(eq(medicines.id, id))
      .returning();
    
    return updated || undefined;
  }

  async deleteMedicine(id: number): Promise<boolean> {
    const result = await db.delete(medicines).where(eq(medicines.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Donation operations
  async getDonations(userId?: string): Promise<Donation[]> {
    return await db.select().from(donations);
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation || undefined;
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const donationData = {
      ...insertDonation,
      status: "pending" as const,
      pickupDate: new Date(insertDonation.pickupDate),
      specialInstructions: insertDonation.specialInstructions || null,
      medicineIds: insertDonation.medicineIds || null,
    };
    
    const [donation] = await db
      .insert(donations)
      .values(donationData)
      .returning();
    return donation;
  }

  async updateDonation(id: number, updates: Partial<InsertDonation>): Promise<Donation | undefined> {
    const existing = await this.getDonation(id);
    if (!existing) return undefined;

    const updateData = {
      ...updates,
      pickupDate: updates.pickupDate ? new Date(updates.pickupDate) : existing.pickupDate,
      specialInstructions: updates.specialInstructions || null,
      medicineIds: updates.medicineIds || null,
    };

    const [updated] = await db
      .update(donations)
      .set(updateData)
      .where(eq(donations.id, id))
      .returning();
    
    return updated || undefined;
  }

  // NGO operations
  async getNGOs(): Promise<NGO[]> {
    return await db.select().from(ngos);
  }

  async getNGO(id: number): Promise<NGO | undefined> {
    const [ngo] = await db.select().from(ngos).where(eq(ngos.id, id));
    return ngo || undefined;
  }

  async createNGO(insertNGO: InsertNGO): Promise<NGO> {
    const ngoData = {
      ...insertNGO,
      active: insertNGO.active ?? true,
    };
    
    const [ngo] = await db
      .insert(ngos)
      .values(ngoData)
      .returning();
    return ngo;
  }
}

export const storage = new DatabaseStorage();
