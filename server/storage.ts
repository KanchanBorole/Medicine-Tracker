import { medicines, donations, ngos, type Medicine, type Donation, type NGO, type InsertMedicine, type InsertDonation, type InsertNGO } from "@shared/schema";

export interface IStorage {
  // Medicine operations
  getMedicines(): Promise<Medicine[]>;
  getMedicine(id: number): Promise<Medicine | undefined>;
  createMedicine(medicine: InsertMedicine): Promise<Medicine>;
  updateMedicine(id: number, medicine: Partial<InsertMedicine>): Promise<Medicine | undefined>;
  deleteMedicine(id: number): Promise<boolean>;
  
  // Donation operations
  getDonations(): Promise<Donation[]>;
  getDonation(id: number): Promise<Donation | undefined>;
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation | undefined>;
  
  // NGO operations
  getNGOs(): Promise<NGO[]>;
  getNGO(id: number): Promise<NGO | undefined>;
  createNGO(ngo: InsertNGO): Promise<NGO>;
}

export class MemStorage implements IStorage {
  private medicines: Map<number, Medicine>;
  private donations: Map<number, Donation>;
  private ngos: Map<number, NGO>;
  private medicineIdCounter: number;
  private donationIdCounter: number;
  private ngoIdCounter: number;

  constructor() {
    this.medicines = new Map();
    this.donations = new Map();
    this.ngos = new Map();
    this.medicineIdCounter = 1;
    this.donationIdCounter = 1;
    this.ngoIdCounter = 1;

    // Initialize with some NGOs
    this.initializeNGOs();
  }

  private initializeNGOs() {
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

    sampleNGOs.forEach(ngo => {
      const id = this.ngoIdCounter++;
      this.ngos.set(id, { ...ngo, id });
    });
  }

  private calculateMedicineStatus(expiryDate: Date): string {
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return "expired";
    if (daysUntilExpiry <= 7) return "warning";
    return "good";
  }

  // Medicine operations
  async getMedicines(): Promise<Medicine[]> {
    return Array.from(this.medicines.values());
  }

  async getMedicine(id: number): Promise<Medicine | undefined> {
    return this.medicines.get(id);
  }

  async createMedicine(insertMedicine: InsertMedicine): Promise<Medicine> {
    const id = this.medicineIdCounter++;
    const expiryDate = new Date(insertMedicine.expiryDate);
    const status = this.calculateMedicineStatus(expiryDate);
    
    const medicine: Medicine = {
      ...insertMedicine,
      id,
      status,
      createdAt: new Date(),
      expiryDate,
    };
    
    this.medicines.set(id, medicine);
    return medicine;
  }

  async updateMedicine(id: number, updates: Partial<InsertMedicine>): Promise<Medicine | undefined> {
    const existing = this.medicines.get(id);
    if (!existing) return undefined;

    const expiryDate = updates.expiryDate ? new Date(updates.expiryDate) : existing.expiryDate;
    const status = this.calculateMedicineStatus(expiryDate);

    const updated: Medicine = {
      ...existing,
      ...updates,
      expiryDate,
      status,
    };

    this.medicines.set(id, updated);
    return updated;
  }

  async deleteMedicine(id: number): Promise<boolean> {
    return this.medicines.delete(id);
  }

  // Donation operations
  async getDonations(): Promise<Donation[]> {
    return Array.from(this.donations.values());
  }

  async getDonation(id: number): Promise<Donation | undefined> {
    return this.donations.get(id);
  }

  async createDonation(insertDonation: InsertDonation): Promise<Donation> {
    const id = this.donationIdCounter++;
    const donation: Donation = {
      ...insertDonation,
      id,
      status: "pending",
      createdAt: new Date(),
      pickupDate: new Date(insertDonation.pickupDate),
    };
    
    this.donations.set(id, donation);
    return donation;
  }

  async updateDonation(id: number, updates: Partial<InsertDonation>): Promise<Donation | undefined> {
    const existing = this.donations.get(id);
    if (!existing) return undefined;

    const updated: Donation = {
      ...existing,
      ...updates,
      pickupDate: updates.pickupDate ? new Date(updates.pickupDate) : existing.pickupDate,
    };

    this.donations.set(id, updated);
    return updated;
  }

  // NGO operations
  async getNGOs(): Promise<NGO[]> {
    return Array.from(this.ngos.values());
  }

  async getNGO(id: number): Promise<NGO | undefined> {
    return this.ngos.get(id);
  }

  async createNGO(insertNGO: InsertNGO): Promise<NGO> {
    const id = this.ngoIdCounter++;
    const ngo: NGO = {
      ...insertNGO,
      id,
    };
    
    this.ngos.set(id, ngo);
    return ngo;
  }
}

export const storage = new MemStorage();
