import { db } from "./db";
import { bundleMuseums, bundlePurchases, bundles, museums, purchases, users } from "@shared/schema";
import { seedDatabase } from "./seed-db";

async function resetDatabase() {
  try {
    console.log("Clearing existing database data...");
    
    // Delete records from all tables with proper order to respect foreign key constraints
    await db.delete(bundlePurchases);
    await db.delete(bundleMuseums);
    await db.delete(bundles);
    await db.delete(purchases);
    await db.delete(museums);
    await db.delete(users);
    
    console.log("Database cleared. Seeding with fresh data...");
    
    // Seed with fresh data
    await seedDatabase();
    
    console.log("Database reset complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();