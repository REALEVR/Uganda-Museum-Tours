import { 
  users, type User, type InsertUser,
  museums, type Museum, type InsertMuseum,
  purchases, type Purchase, type InsertPurchase,
  bundles, type Bundle, type InsertBundle,
  bundleMuseums, type BundleMuseum, type InsertBundleMuseum,
  bundlePurchases, type BundlePurchase, type InsertBundlePurchase,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async createMuseum(museum: InsertMuseum): Promise<Museum> {
    const [newMuseum] = await db
      .insert(museums)
      .values(museum)
      .returning();
    return newMuseum;
  }
  
  async getMuseum(id: number): Promise<Museum | undefined> {
    const [museum] = await db.select().from(museums).where(eq(museums.id, id));
    return museum || undefined;
  }
  
  async getAllMuseums(): Promise<Museum[]> {
    return await db.select().from(museums);
  }
  
  async createPurchase(purchase: InsertPurchase): Promise<Purchase> {
    const [newPurchase] = await db
      .insert(purchases)
      .values(purchase)
      .returning();
    return newPurchase;
  }
  
  async getPurchasesByUser(userId: number): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.userId, userId));
  }
  
  async getPurchase(id: number): Promise<Purchase | undefined> {
    const [purchase] = await db.select().from(purchases).where(eq(purchases.id, id));
    return purchase || undefined;
  }
  
  async createBundle(bundle: InsertBundle): Promise<Bundle> {
    const [newBundle] = await db
      .insert(bundles)
      .values(bundle)
      .returning();
    return newBundle;
  }
  
  async getBundle(id: number): Promise<Bundle | undefined> {
    const [bundle] = await db.select().from(bundles).where(eq(bundles.id, id));
    return bundle || undefined;
  }
  
  async getAllBundles(): Promise<Bundle[]> {
    return await db.select().from(bundles);
  }
  
  async addMuseumToBundle(bundleMuseum: InsertBundleMuseum): Promise<BundleMuseum> {
    const [newBundleMuseum] = await db
      .insert(bundleMuseums)
      .values(bundleMuseum)
      .returning();
    return newBundleMuseum;
  }
  
  async getMuseumsByBundle(bundleId: number): Promise<Museum[]> {
    const bundleMuseumEntries = await db.select()
      .from(bundleMuseums)
      .where(eq(bundleMuseums.bundleId, bundleId));
    
    if (bundleMuseumEntries.length === 0) {
      return [];
    }
    
    const museumIds = bundleMuseumEntries.map(entry => entry.museumId);
    return await Promise.all(
      museumIds.map(async id => {
        const [museum] = await db.select().from(museums).where(eq(museums.id, id));
        return museum;
      })
    );
  }
  
  async createBundlePurchase(bundlePurchase: InsertBundlePurchase): Promise<BundlePurchase> {
    const [newBundlePurchase] = await db
      .insert(bundlePurchases)
      .values(bundlePurchase)
      .returning();
    return newBundlePurchase;
  }
  
  async getBundlePurchasesByUser(userId: number): Promise<BundlePurchase[]> {
    return await db.select()
      .from(bundlePurchases)
      .where(eq(bundlePurchases.userId, userId));
  }
  
  async hasUserAccessToMuseum(userId: number, museumId: number): Promise<boolean> {
    const now = new Date();
    
    // Check for direct museum purchases
    const directPurchases = await db.select()
      .from(purchases)
      .where(
        and(
          eq(purchases.userId, userId),
          eq(purchases.museumId, museumId),
          gte(purchases.expiryDate, now)
        )
      );
    
    if (directPurchases.length > 0) {
      return true;
    }
    
    // Check for bundle purchases
    const userBundlePurchases = await db.select()
      .from(bundlePurchases)
      .where(
        and(
          eq(bundlePurchases.userId, userId),
          gte(bundlePurchases.expiryDate, now)
        )
      );
    
    if (userBundlePurchases.length === 0) {
      return false;
    }
    
    // Check if any of these bundles contain the museum
    for (const bundlePurchase of userBundlePurchases) {
      const bundleContent = await db.select()
        .from(bundleMuseums)
        .where(
          and(
            eq(bundleMuseums.bundleId, bundlePurchase.bundleId),
            eq(bundleMuseums.museumId, museumId)
          )
        );
      
      if (bundleContent.length > 0) {
        return true;
      }
    }
    
    return false;
  }
  
  async getUserActiveMuseums(userId: number): Promise<Museum[]> {
    const now = new Date();
    const activeMuseumsSet = new Set<number>();
    
    // Check direct purchases
    const directPurchases = await db.select()
      .from(purchases)
      .where(
        and(
          eq(purchases.userId, userId),
          gte(purchases.expiryDate, now)
        )
      );
    
    for (const purchase of directPurchases) {
      activeMuseumsSet.add(purchase.museumId);
    }
    
    // Check bundle purchases
    const userBundlePurchases = await db.select()
      .from(bundlePurchases)
      .where(
        and(
          eq(bundlePurchases.userId, userId),
          gte(bundlePurchases.expiryDate, now)
        )
      );
    
    for (const bundlePurchase of userBundlePurchases) {
      const bundleMuseumEntries = await db.select()
        .from(bundleMuseums)
        .where(eq(bundleMuseums.bundleId, bundlePurchase.bundleId));
      
      for (const entry of bundleMuseumEntries) {
        activeMuseumsSet.add(entry.museumId);
      }
    }
    
    // Convert Set to Array for processing
    const activeMuseumsArray = Array.from(activeMuseumsSet);
    
    if (activeMuseumsArray.length === 0) {
      return [];
    }
    
    // Get all museums by IDs
    const museumsList: Museum[] = [];
    for (const museumId of activeMuseumsArray) {
      const [museum] = await db.select()
        .from(museums)
        .where(eq(museums.id, museumId));
      
      if (museum) {
        museumsList.push(museum);
      }
    }
    
    return museumsList;
  }
}