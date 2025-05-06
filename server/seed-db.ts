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
      description: "The oldest museum in East Africa, established in 1908, housing a rich collection of archaeological findings, ethnographic artifacts, and cultural relics. The museum preserves Uganda's diverse heritage with exhibits on traditional agricultural tools, hunting equipment, and ceremonial objects from over 50 ethnic groups across the country. Musical instruments, royal regalia, and traditional attire reveal the complex social structures that have defined Ugandan societies for centuries.",
      imageUrl: "https://images.unsplash.com/photo-1555662800-d6429edbad12?q=80&w=1600&auto=format&fit=crop",
      duration: 120,
      price: 1500,
      rating: 42,
      panellumUrl: "https://ugandawildlife.org/wp-content/uploads/2022/06/hs-2.jpg"
    };
    
    const kabakasPalace: InsertMuseum = {
      name: "Kabaka's Palace & Idi Amin Torture Chambers",
      description: "A complex historical site with dual significance: the majestic traditional palace of the Buganda kings (Kabakas) alongside underground chambers that bear witness to the darker periods of Uganda's past under Idi Amin's regime. The palace architecture showcases traditional Ganda design with conical thatched roofs and intricate woodwork, while the preserved chambers provide a sobering reminder of political oppression, creating a powerful historical narrative of both cultural pride and national resilience.",
      imageUrl: "https://images.unsplash.com/photo-1623866571829-67d5b5c3ebd2?q=80&w=1600&auto=format&fit=crop",
      duration: 90,
      price: 2000,
      rating: 38,
      panellumUrl: "https://theeagleonline.com.ng/wp-content/uploads/2015/07/buganda-palace-1.jpg"
    };
    
    const ndereCulturalCentre: InsertMuseum = {
      name: "Ndere Cultural Centre",
      description: "A living museum celebrating Uganda's performing arts through colorful dance, music, and storytelling traditions. Weekly performances feature over 20 ethnic groups' unique expressions, from the energetic jumping dances of the Batoro to the intricate royal dances of the Baganda. Visitors can explore traditional instruments like the enanga (harp), endingidi (tube fiddle), and various drums that form the backbone of Ugandan ceremonial music. The Centre preserves oral traditions and cultural knowledge through interactive demonstrations of craft-making, cooking methods, and spiritual practices.",
      imageUrl: "https://images.unsplash.com/photo-1574756762862-3ffa7f61c5e5?q=80&w=1600&auto=format&fit=crop",
      duration: 180,
      price: 2500,
      rating: 48,
      panellumUrl: "https://www.africanmeccasafaris.com/wp-content/uploads/2021/05/Uganda-Travel-Ndere-Cultural-Center-Kampala-Africa-Tours6.jpg"
    };
    
    const kasubi: InsertMuseum = {
      name: "Kasubi Tombs",
      description: "A UNESCO World Heritage site housing the sacred burial grounds of four Buganda kings (Kabakas) within a circular thatched structure called Muzibu-Azaala-Mpanga. This architectural masterpiece represents the spiritual and political heart of the Buganda Kingdom, built entirely with natural materials and traditional techniques without using a single nail. The interior features sacred chambers divided by bark cloth screens and woven reed partitions, with royal regalia and symbolic artifacts marking each king's reign. Though damaged by fire in 2010, the ongoing restoration follows ancient knowledge passed through generations of traditional craftspeople.",
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop",
      duration: 60,
      price: 1800,
      rating: 40,
      panellumUrl: "https://whc.unesco.org/uploads/thumbs/site_1022_0004-750-750-20151104162346.jpg"
    };
    
    const igongo: InsertMuseum = {
      name: "Igongo Cultural Centre",
      description: "A comprehensive museum preserving the heritage of western Uganda, particularly the Ankole and neighboring kingdoms. The centre features meticulously reconstructed traditional homesteads and cattle kraals that demonstrate the region's pastoral lifestyle and architectural techniques. Its extensive collection includes ancient tools for farming and animal husbandry, ceremonial objects for important rites of passage, and royal emblems from the Ankole monarchy. Interactive exhibits explain traditional knowledge systems about medicine, weather prediction, and sustainable land management that have sustained communities for centuries in harmony with the region's grassland ecosystems.",
      imageUrl: "https://images.unsplash.com/photo-1531321053571-054653dd8a21?q=80&w=1600&auto=format&fit=crop",
      duration: 120,
      price: 1700,
      rating: 41,
      panellumUrl: "https://pbs.twimg.com/media/CgVo6HoWwAA7PRl.jpg"
    };
    
    const ssemagulu: InsertMuseum = {
      name: "Ssemagulu Museum",
      description: "A pioneering cultural museum dedicated to the preservation and celebration of Buganda's rich cultural heritage. Its comprehensive collection features royal regalia including ceremonial spears, shields, and intricate beadwork from the Buganda court, alongside everyday items like traditional bark cloth (a UNESCO-recognized cultural treasure), handcrafted musical instruments, and agricultural implements. Visitors can explore reconstructed traditional Ganda homes showing architectural techniques and spatial arrangements that reflect social hierarchies and family structures. The museum's oral history archives contain recorded interviews with elders sharing forgotten stories, proverbs, and songs that document the cultural wisdom passed through generations.",
      imageUrl: "https://images.unsplash.com/photo-1608889476561-6242cfdbf622?q=80&w=1600&auto=format&fit=crop",
      duration: 90,
      price: 1500,
      rating: 45,
      panellumUrl: "https://realevr.com/SSEMAGULU%20MUSEUM/"
    };
    
    const technologyMuseum: InsertMuseum = {
      name: "Museum of Technology",
      description: "A forward-looking institution charting Uganda's technological evolution from indigenous innovations to modern digital solutions. Interactive exhibits demonstrate traditional technologies like iron smelting, architectural innovations in traditional building methods, and agricultural tools adapted to local conditions over centuries. The museum traces Uganda's telecommunication journey from traditional talking drums to modern digital networks, showcasing locally developed apps and tech solutions addressing uniquely Ugandan challenges. Special exhibits highlight pioneering Ugandan women in science and technology, renewable energy innovations, and technology's role in cultural preservation, creating a narrative of continuity between traditional knowledge systems and contemporary technological advancement.",
      imageUrl: "https://images.unsplash.com/photo-1581092446343-379129d150db?q=80&w=1600&auto=format&fit=crop",
      duration: 120,
      price: 2200,
      rating: 47,
      panellumUrl: "https://realevr.com/MUSEUM%20OF%20TECHNOLOGY/"
    };
    
    // Insert all museums - starting with our featured museums
    const [museum1] = await db.insert(museums).values(ssemagulu).returning();
    const [museum2] = await db.insert(museums).values(technologyMuseum).returning();
    const [museum3] = await db.insert(museums).values(ugandaNationalMuseum).returning();
    const [museum4] = await db.insert(museums).values(kabakasPalace).returning();
    const [museum5] = await db.insert(museums).values(ndereCulturalCentre).returning();
    const [museum6] = await db.insert(museums).values(kasubi).returning();
    const [museum7] = await db.insert(museums).values(igongo).returning();
    
    console.log(`Created ${7} museums`);
    
    // Create bundles
    const museumBundle: InsertBundle = {
      name: "Pioneering Museums Pass",
      description: "Access to the Ssemagulu Museum and Museum of Technology for 30 days.",
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