import { db } from "./db";
import { 
  users, 
  museums, 
  bundles, 
  bundleMuseums, 
  type InsertUser,
  type InsertMuseum,
  type InsertBundle,
  type InsertBundleMuseum
} from "@shared/schema";

/**
 * Seeds the database with initial data
 */
export async function seedDatabase() {
  // Check if we already have data - if yes, don't re-seed
  const existingMuseums = await db.select().from(museums);
  
  if (existingMuseums.length > 0) {
    console.log("Database already has data, skipping seed");
    return;
  }
  
  console.log("Seeding database with initial data...");
  
  try {
    // Create sample admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "$2b$10$JO7V8Ybo42.K2DHdiXtqueOjyVsFBVtxT4z3GvO7T16TZlGjNxd6y", // Hashed "password123"
      email: "admin@ugandamuseums.com",
      name: "Admin User"
    };
    
    const [createdUser] = await db.insert(users).values(adminUser).returning();
    console.log(`Created user: ${createdUser.username}`);

    // Create museums with authentic Ugandan cultural images
    const ugandaNationalMuseum: InsertMuseum = {
      name: "Uganda National Museum",
      description: "The oldest museum in East Africa, featuring exhibits on Uganda's cultural and archaeological heritage. Established in 1908, it houses traditional artifacts from various Ugandan ethnic groups.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Uganda_Museum.jpg/1200px-Uganda_Museum.jpg",
      duration: 120,
      price: 1500,
      rating: 4,
      panellumUrl: "https://ugandawildlife.org/wp-content/uploads/2022/06/hs-2.jpg"
    };
    
    const kabakasPalace: InsertMuseum = {
      name: "Kabaka's Palace & Idi Amin Torture Chambers",
      description: "Historical site showcasing the residence of the Buganda king and the infamous torture chambers from Idi Amin's regime. A powerful reminder of Uganda's complex political history.",
      imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0a/37/87/53/img-20160128-152920-largejpg.jpg?w=1200&h=-1&s=1",
      duration: 90,
      price: 2000,
      rating: 4,
      panellumUrl: "https://theeagleonline.com.ng/wp-content/uploads/2015/07/buganda-palace-1.jpg"
    };
    
    const ndereCulturalCentre: InsertMuseum = {
      name: "Ndere Cultural Centre",
      description: "A living museum where visitors can experience traditional Ugandan music, dance, and cuisine. Enjoy authentic performances and immerse yourself in Uganda's vibrant cultural expressions.",
      imageUrl: "https://ugandatourismcenter.com/wp-content/uploads/2021/09/Ndere-Cultural-Center-UTC.jpg",
      duration: 180,
      price: 2500,
      rating: 5,
      panellumUrl: "https://www.africanmeccasafaris.com/wp-content/uploads/2021/05/Uganda-Travel-Ndere-Cultural-Center-Kampala-Africa-Tours6.jpg"
    };
    
    const kasubi: InsertMuseum = {
      name: "Kasubi Tombs",
      description: "UNESCO World Heritage site serving as the burial ground for Buganda kings, featuring unique architectural traditions. The main tomb building is a masterpiece of traditional Ganda architecture.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0a/Kasubi_Tombs_Kampala_Uganda.jpg",
      duration: 60,
      price: 1800,
      rating: 4,
      panellumUrl: "https://whc.unesco.org/uploads/thumbs/site_1022_0004-750-750-20151104162346.jpg"
    };
    
    const igongo: InsertMuseum = {
      name: "Igongo Cultural Centre",
      description: "Museum showcasing the heritage of western Uganda, particularly the Ankole kingdom history. Displays include traditional homestead reconstructions and artifacts from the region.",
      imageUrl: "https://www.museumfuturesforum.org/wp-content/uploads/2023/04/Igongo-Cultural-Musuem-Uganda-1.png",
      duration: 120,
      price: 1700,
      rating: 4,
      panellumUrl: "https://pbs.twimg.com/media/CgVo6HoWwAA7PRl.jpg"
    };
    
    const ssemagulu: InsertMuseum = {
      name: "Ssemagulu Museum",
      description: "Pioneering cultural museum dedicated to preserving traditional Buganda crafts, tools, and practices. The museum houses an impressive collection of royal regalia and everyday items.",
      imageUrl: "https://i0.wp.com/realevr.global/wp-content/uploads/2022/07/Compressed_GIF-2022-07-18-14.03.04.gif?resize=818%2C460&ssl=1",
      duration: 90,
      price: 1500,
      rating: 4,
      panellumUrl: "https://realevr.com/SSEMAGULU%20MUSEUM/"
    };
    
    const technologyMuseum: InsertMuseum = {
      name: "Museum of Technology",
      description: "Contemporary museum highlighting Uganda's technological innovations and progress through interactive exhibits. The museum charts Uganda's journey from traditional technologies to modern innovations.",
      imageUrl: "https://techpoint.africa/wp-content/uploads/2019/05/Uganda.jpg",
      duration: 120,
      price: 2200,
      rating: 5,
      panellumUrl: "https://realevr.com/MUSEUM%20OF%20TECHNOLOGY/"
    };
    
    // Insert all museums
    const [museum1] = await db.insert(museums).values(ugandaNationalMuseum).returning();
    const [museum2] = await db.insert(museums).values(kabakasPalace).returning();
    const [museum3] = await db.insert(museums).values(ndereCulturalCentre).returning();
    const [museum4] = await db.insert(museums).values(kasubi).returning();
    const [museum5] = await db.insert(museums).values(igongo).returning();
    const [museum6] = await db.insert(museums).values(ssemagulu).returning();
    const [museum7] = await db.insert(museums).values(technologyMuseum).returning();
    
    console.log(`Created ${7} museums`);
    
    // Create bundles
    const museumBundle: InsertBundle = {
      name: "Historical Museums Pass",
      description: "Access to the Uganda National Museum and Kabaka's Palace for 30 days.",
      price: 3000,
      validityDays: 30,
    };
    
    const allAccessPass: InsertBundle = {
      name: "All Access Museums Pass",
      description: "Unlimited access to all museums including Ssemagulu Museum and Museum of Technology for 60 days.",
      price: 8000,
      validityDays: 60,
    };
    
    const [bundle1] = await db.insert(bundles).values(museumBundle).returning();
    const [bundle2] = await db.insert(bundles).values(allAccessPass).returning();
    
    console.log(`Created ${2} bundles`);
    
    // Add museums to bundles
    const bundleMuseumsData: InsertBundleMuseum[] = [
      { bundleId: bundle1.id, museumId: museum1.id },
      { bundleId: bundle1.id, museumId: museum2.id },
      { bundleId: bundle2.id, museumId: museum1.id },
      { bundleId: bundle2.id, museumId: museum2.id },
      { bundleId: bundle2.id, museumId: museum3.id },
      { bundleId: bundle2.id, museumId: museum4.id },
      { bundleId: bundle2.id, museumId: museum5.id },
      { bundleId: bundle2.id, museumId: museum6.id },
      { bundleId: bundle2.id, museumId: museum7.id }
    ];
    
    await db.insert(bundleMuseums).values(bundleMuseumsData);
    
    console.log(`Added museums to bundles`);
    console.log("Database seeding complete!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}