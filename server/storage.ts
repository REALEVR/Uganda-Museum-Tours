import { 
  users, type User, type InsertUser,
  museums, type Museum, type InsertMuseum,
  purchases, type Purchase, type InsertPurchase,
  bundles, type Bundle, type InsertBundle,
  bundleMuseums, type BundleMuseum, type InsertBundleMuseum,
  bundlePurchases, type BundlePurchase, type InsertBundlePurchase,
} from "@shared/schema";

// Storage interface with all CRUD methods needed for the application
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Museum methods
  createMuseum(museum: InsertMuseum): Promise<Museum>;
  getMuseum(id: number): Promise<Museum | undefined>;
  getAllMuseums(): Promise<Museum[]>;
  
  // Purchase methods
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchasesByUser(userId: number): Promise<Purchase[]>;
  getPurchase(id: number): Promise<Purchase | undefined>;
  
  // Bundle methods
  createBundle(bundle: InsertBundle): Promise<Bundle>;
  getBundle(id: number): Promise<Bundle | undefined>;
  getAllBundles(): Promise<Bundle[]>;
  
  // BundleMuseum methods
  addMuseumToBundle(bundleMuseum: InsertBundleMuseum): Promise<BundleMuseum>;
  getMuseumsByBundle(bundleId: number): Promise<Museum[]>;
  
  // BundlePurchase methods
  createBundlePurchase(bundlePurchase: InsertBundlePurchase): Promise<BundlePurchase>;
  getBundlePurchasesByUser(userId: number): Promise<BundlePurchase[]>;
  
  // User access checks
  hasUserAccessToMuseum(userId: number, museumId: number): Promise<boolean>;
  getUserActiveMuseums(userId: number): Promise<Museum[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private museums: Map<number, Museum>;
  private purchases: Map<number, Purchase>;
  private bundles: Map<number, Bundle>;
  private bundleMuseums: Map<number, BundleMuseum>;
  private bundlePurchases: Map<number, BundlePurchase>;
  
  private userId: number;
  private museumId: number;
  private purchaseId: number;
  private bundleId: number;
  private bundleMuseumId: number;
  private bundlePurchaseId: number;

  constructor() {
    this.users = new Map();
    this.museums = new Map();
    this.purchases = new Map();
    this.bundles = new Map();
    this.bundleMuseums = new Map();
    this.bundlePurchases = new Map();
    
    this.userId = 1;
    this.museumId = 1;
    this.purchaseId = 1;
    this.bundleId = 1;
    this.bundleMuseumId = 1;
    this.bundlePurchaseId = 1;
    
    // Initialize sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { 
      ...insertUser, 
      id,
      name: insertUser.name || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Museum methods
  async createMuseum(museum: InsertMuseum): Promise<Museum> {
    const id = this.museumId++;
    const newMuseum: Museum = { 
      ...museum, 
      id,
      rating: museum.rating || null
    };
    this.museums.set(id, newMuseum);
    return newMuseum;
  }
  
  async getMuseum(id: number): Promise<Museum | undefined> {
    return this.museums.get(id);
  }
  
  async getAllMuseums(): Promise<Museum[]> {
    return Array.from(this.museums.values());
  }
  
  // Purchase methods
  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const id = this.purchaseId++;
    const newPurchase: Purchase = { 
      ...purchase, 
      id, 
      purchaseDate: new Date() 
    };
    this.purchases.set(id, newPurchase);
    return newPurchase;
  }
  
  async getPurchasesByUser(userId: number): Promise<Purchase[]> {
    return Array.from(this.purchases.values()).filter(
      (purchase) => purchase.userId === userId
    );
  }
  
  async getPurchase(id: number): Promise<Purchase | undefined> {
    return this.purchases.get(id);
  }
  
  // Bundle methods
  async createBundle(bundle: InsertBundle): Promise<Bundle> {
    const id = this.bundleId++;
    const newBundle: Bundle = { ...bundle, id };
    this.bundles.set(id, newBundle);
    return newBundle;
  }
  
  async getBundle(id: number): Promise<Bundle | undefined> {
    return this.bundles.get(id);
  }
  
  async getAllBundles(): Promise<Bundle[]> {
    return Array.from(this.bundles.values());
  }
  
  // BundleMuseum methods
  async addMuseumToBundle(bundleMuseum: InsertBundleMuseum): Promise<BundleMuseum> {
    const id = this.bundleMuseumId++;
    const newBundleMuseum: BundleMuseum = { ...bundleMuseum, id };
    this.bundleMuseums.set(id, newBundleMuseum);
    return newBundleMuseum;
  }
  
  async getMuseumsByBundle(bundleId: number): Promise<Museum[]> {
    const bundleMuseumEntries = Array.from(this.bundleMuseums.values()).filter(
      (bundleMuseum) => bundleMuseum.bundleId === bundleId
    );
    
    const museums: Museum[] = [];
    for (const entry of bundleMuseumEntries) {
      const museum = this.museums.get(entry.museumId);
      if (museum) {
        museums.push(museum);
      }
    }
    
    return museums;
  }
  
  // BundlePurchase methods
  async createBundlePurchase(bundlePurchase: InsertBundlePurchase): Promise<BundlePurchase> {
    const id = this.bundlePurchaseId++;
    const newBundlePurchase: BundlePurchase = { 
      ...bundlePurchase, 
      id, 
      purchaseDate: new Date() 
    };
    this.bundlePurchases.set(id, newBundlePurchase);
    return newBundlePurchase;
  }
  
  async getBundlePurchasesByUser(userId: number): Promise<BundlePurchase[]> {
    return Array.from(this.bundlePurchases.values()).filter(
      (bundlePurchase) => bundlePurchase.userId === userId
    );
  }
  
  // User access checks
  async hasUserAccessToMuseum(userId: number, museumId: number): Promise<boolean> {
    // Check individual purchases
    const userPurchases = await this.getPurchasesByUser(userId);
    const hasDirectAccess = userPurchases.some(purchase => 
      purchase.museumId === museumId && purchase.expiryDate > new Date()
    );
    
    if (hasDirectAccess) return true;
    
    // Check bundle purchases
    const userBundlePurchases = await this.getBundlePurchasesByUser(userId);
    for (const bundlePurchase of userBundlePurchases) {
      if (bundlePurchase.expiryDate < new Date()) continue;
      
      const bundleMuseums = await this.getMuseumsByBundle(bundlePurchase.bundleId);
      if (bundleMuseums.some(museum => museum.id === museumId)) {
        return true;
      }
    }
    
    return false;
  }
  
  async getUserActiveMuseums(userId: number): Promise<Museum[]> {
    const activeMuseumIds: number[] = [];
    const now = new Date();
    
    // Add museums from individual purchases
    const userPurchases = await this.getPurchasesByUser(userId);
    userPurchases.forEach(purchase => {
      if (purchase.expiryDate > now) {
        if (!activeMuseumIds.includes(purchase.museumId)) {
          activeMuseumIds.push(purchase.museumId);
        }
      }
    });
    
    // Add museums from bundle purchases
    const userBundlePurchases = await this.getBundlePurchasesByUser(userId);
    for (const bundlePurchase of userBundlePurchases) {
      if (bundlePurchase.expiryDate > now) {
        const bundleMuseums = await this.getMuseumsByBundle(bundlePurchase.bundleId);
        bundleMuseums.forEach(museum => {
          if (!activeMuseumIds.includes(museum.id)) {
            activeMuseumIds.push(museum.id);
          }
        });
      }
    }
    
    // Get all the museum objects
    const museums: Museum[] = [];
    for (const museumId of activeMuseumIds) {
      const museum = await this.getMuseum(museumId);
      if (museum) museums.push(museum);
    }
    
    return museums;
  }
  
  // Initialize sample data
  private initSampleData() {
    // Sample Museums
    const ugandaNationalMuseum: InsertMuseum = {
      name: "Uganda National Museum",
      description: "Experience Uganda's oldest and largest museum with artifacts dating back to prehistoric times.",
      imageUrl: "https://images.unsplash.com/photo-1565375706248-2fd61607b490?q=80&w=1470&auto=format&fit=crop",
      duration: 45,
      price: 599, // $5.99
      rating: 48, // 4.8/5
      panellumUrl: "https://pannellum.org/images/alma.jpg" // Placeholder for demo
    };
    
    const kabakasPalace: InsertMuseum = {
      name: "Kabaka's Palace",
      description: "Tour the historical palace of the Buganda Kingdom with its rich royal heritage.",
      imageUrl: "https://images.unsplash.com/photo-1523711576778-f18e511afc13?q=80&w=1374&auto=format&fit=crop",
      duration: 60,
      price: 699, // $6.99
      rating: 47, // 4.7/5
      panellumUrl: "https://pannellum.org/images/cerro-toco-0.jpg" // Placeholder for demo
    };
    
    const ndereCulturalCentre: InsertMuseum = {
      name: "Ndere Cultural Centre",
      description: "Explore Uganda's diverse cultural performances and traditional artifacts.",
      imageUrl: "https://images.unsplash.com/photo-1600093112536-b8b662244a82?q=80&w=1470&auto=format&fit=crop",
      duration: 35,
      price: 499, // $4.99
      rating: 49, // 4.9/5
      panellumUrl: "https://pannellum.org/images/from-tree.jpg" // Placeholder for demo
    };
    
    const kasubi: InsertMuseum = {
      name: "Kasubi Tombs",
      description: "Visit the burial site of Buganda kings, a UNESCO World Heritage site.",
      imageUrl: "https://images.unsplash.com/photo-1580056927597-5af0adafb6c7?q=80&w=1470&auto=format&fit=crop",
      duration: 50,
      price: 599, // $5.99
      rating: 46, // 4.6/5
      panellumUrl: "https://pannellum.org/images/jfk.jpg" // Placeholder for demo
    };
    
    const igongo: InsertMuseum = {
      name: "Igongo Cultural Centre",
      description: "Discover the cultural heritage of Western Uganda and Ankole kingdom.",
      imageUrl: "https://images.unsplash.com/photo-1580892047686-fc44d75e3478?q=80&w=1470&auto=format&fit=crop",
      duration: 40,
      price: 549, // $5.49
      rating: 45, // 4.5/5
      panellumUrl: "https://pannellum.org/images/jail-cell-hallway.jpg" // Placeholder for demo
    };
    
    const ssemagulu: InsertMuseum = {
      name: "Ssemagulu Museum",
      description: "Explore the pioneering Ssemagulu Museum showcasing rich Ugandan cultural artifacts and history.",
      imageUrl: "https://images.unsplash.com/photo-1605349420221-2b8583c96d11?q=80&w=1470&auto=format&fit=crop",
      duration: 55,
      price: 649, // $6.49
      rating: 47, // 4.7/5
      panellumUrl: "https://realevr.com/SSEMAGULU%20MUSEUM/" // Direct link to RealEVR tour
    };
    
    const technologyMuseum: InsertMuseum = {
      name: "Museum of Technology",
      description: "Discover Uganda's technological journey through interactive exhibits and historical innovations.",
      imageUrl: "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=1470&auto=format&fit=crop",
      duration: 60,
      price: 699, // $6.99
      rating: 48, // 4.8/5
      panellumUrl: "https://realevr.com/MUSEUM%20OF%20TECHNOLOGY/" // Direct link to RealEVR tour
    };
    
    // Create the museums
    this.createMuseum(ugandaNationalMuseum);
    this.createMuseum(kabakasPalace);
    this.createMuseum(ndereCulturalCentre);
    this.createMuseum(kasubi);
    this.createMuseum(igongo);
    this.createMuseum(ssemagulu);
    this.createMuseum(technologyMuseum);
    
    // Create bundles
    const museumBundle: InsertBundle = {
      name: "Museum Bundle",
      description: "Access to any 3 museum tours",
      price: 1299, // $12.99
      validityDays: 60
    };
    
    const allAccessPass: InsertBundle = {
      name: "All Access Pass",
      description: "Unlimited access to all museums",
      price: 2499, // $24.99
      validityDays: 90
    };
    
    this.createBundle(museumBundle).then(bundle => {
      // Add first 3 museums to the museum bundle
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 1 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 2 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 3 });
    });
    
    this.createBundle(allAccessPass).then(bundle => {
      // Add all museums to the all access pass
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 1 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 2 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 3 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 4 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 5 });
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 6 }); // Ssemagulu Museum
      this.addMuseumToBundle({ bundleId: bundle.id, museumId: 7 }); // Museum of Technology
    });
  }
}

// We'll use the MemStorage class to initialize the database with sample data
// And then export the DatabaseStorage for actual use
import { DatabaseStorage } from "./database-storage";
export const storage = new DatabaseStorage();
