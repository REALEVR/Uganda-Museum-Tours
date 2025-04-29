import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import session from "express-session";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertPurchaseSchema, 
  insertBundlePurchaseSchema
} from "@shared/schema";
import MemoryStore from "memorystore";

// Add user to request
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// Note: We're transitioning from Stripe to Flutterwave for payments
// Stripe is now optional
let stripe: Stripe | undefined;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2025-03-31.basil" as any });
  }
} catch (error) {
  console.log('Stripe integration disabled. Using Flutterwave instead.');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  const SessionStore = MemoryStore(session);
  
  app.use(session({
    secret: process.env.SESSION_SECRET || 'uganda-virtual-museums-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    next();
  };

  // Museum routes
  app.get('/api/museums', async (req, res) => {
    try {
      const museums = await storage.getAllMuseums();
      res.json(museums);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching museums: ${error.message}` });
    }
  });

  app.get('/api/museums/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid museum ID' });
      }
      
      const museum = await storage.getMuseum(id);
      if (!museum) {
        return res.status(404).json({ message: 'Museum not found' });
      }
      
      res.json(museum);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching museum: ${error.message}` });
    }
  });

  // Bundle routes
  app.get('/api/bundles', async (req, res) => {
    try {
      const bundles = await storage.getAllBundles();
      res.json(bundles);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching bundles: ${error.message}` });
    }
  });

  app.get('/api/bundles/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid bundle ID' });
      }
      
      const bundle = await storage.getBundle(id);
      if (!bundle) {
        return res.status(404).json({ message: 'Bundle not found' });
      }
      
      const museums = await storage.getMuseumsByBundle(id);
      
      res.json({ 
        ...bundle, 
        museums 
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching bundle: ${error.message}` });
    }
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({ message: 'Invalid user data', errors: validatedData.error.flatten() });
      }
      
      const { username, email, password, name } = validatedData.data;
      
      // Check if user already exists
      let existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      
      // Create new user
      const user = await storage.createUser({
        username,
        email,
        password, // In a real app, we would hash this
        name
      });
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
      
    } catch (error: any) {
      res.status(500).json({ message: `Registration failed: ${error.message}` });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) { // In a real app, we would compare hashes
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
      
    } catch (error: any) {
      res.status(500).json({ message: `Login failed: ${error.message}` });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/me', async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ message: 'User not found' });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
      
    } catch (error: any) {
      res.status(500).json({ message: `Authentication check failed: ${error.message}` });
    }
  });

  // User access routes
  app.get('/api/user/museums', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const museums = await storage.getUserActiveMuseums(userId);
      res.json(museums);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching user museums: ${error.message}` });
    }
  });

  app.get('/api/museums/:id/access', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const museumId = parseInt(req.params.id);
      
      if (isNaN(museumId)) {
        return res.status(400).json({ message: 'Invalid museum ID' });
      }
      
      const hasAccess = await storage.hasUserAccessToMuseum(userId, museumId);
      res.json({ hasAccess });
      
    } catch (error: any) {
      res.status(500).json({ message: `Error checking access: ${error.message}` });
    }
  });
  
  // Payment routes - using Stripe
  app.post('/api/payment/create-intent', requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: 'Stripe integration not configured' });
      }

      const { amount, type, itemId } = req.body;
      
      if (!amount || !type || !itemId) {
        return res.status(400).json({ message: 'Amount, type and itemId are required' });
      }
      
      if (type !== 'museum' && type !== 'bundle') {
        return res.status(400).json({ message: 'Type must be either "museum" or "bundle"' });
      }
      
      // Validate that the museum or bundle exists and the price matches
      let price: number = 0;
      if (type === 'museum') {
        const museum = await storage.getMuseum(itemId);
        if (!museum) {
          return res.status(404).json({ message: 'Museum not found' });
        }
        price = museum.price;
      } else { // type === 'bundle'
        const bundle = await storage.getBundle(itemId);
        if (!bundle) {
          return res.status(404).json({ message: 'Bundle not found' });
        }
        price = bundle.price;
      }
      
      // Verify that the amount matches the price
      if (price !== amount) {
        return res.status(400).json({ message: 'Amount does not match the item price' });
      }
      
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        metadata: { 
          userId: req.session.userId!.toString(), 
          type, 
          itemId: itemId.toString() 
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
      
    } catch (error: any) {
      res.status(500).json({ message: `Error creating payment intent: ${error.message}` });
    }
  });
  
  // Payment confirmation webhook
  app.post('/api/payment/confirm', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(500).json({ message: 'Stripe integration not configured' });
      }
      
      const { paymentIntentId } = req.body;
      
      if (!paymentIntentId) {
        return res.status(400).json({ message: 'Payment intent ID is required' });
      }
      
      // Retrieve payment intent to verify payment and metadata
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: `Payment not successful: ${paymentIntent.status}` });
      }
      
      const { userId, type, itemId } = paymentIntent.metadata;
      
      if (!userId || !type || !itemId) {
        return res.status(400).json({ message: 'Invalid payment metadata' });
      }
      
      const userIdNum = parseInt(userId);
      const itemIdNum = parseInt(itemId);
      
      if (isNaN(userIdNum) || isNaN(itemIdNum)) {
        return res.status(400).json({ message: 'Invalid user ID or item ID in metadata' });
      }
      
      // Process the purchase based on type
      if (type === 'museum') {
        const museum = await storage.getMuseum(itemIdNum);
        if (!museum) {
          return res.status(404).json({ message: 'Museum not found' });
        }
        
        // Calculate expiry date (30 days)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        
        // Create purchase record
        const purchase = await storage.createPurchase({
          userId: userIdNum,
          museumId: itemIdNum,
          expiryDate,
          price: museum.price,
          paymentIntentId
        });
        
        res.json({ success: true, purchase });
        
      } else if (type === 'bundle') {
        const bundle = await storage.getBundle(itemIdNum);
        if (!bundle) {
          return res.status(404).json({ message: 'Bundle not found' });
        }
        
        // Calculate expiry date based on bundle validity
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + bundle.validityDays);
        
        // Create bundle purchase record
        const bundlePurchase = await storage.createBundlePurchase({
          userId: userIdNum,
          bundleId: itemIdNum,
          expiryDate,
          price: bundle.price,
          paymentIntentId
        });
        
        res.json({ success: true, bundlePurchase });
        
      } else {
        res.status(400).json({ message: 'Invalid purchase type' });
      }
      
    } catch (error: any) {
      res.status(500).json({ message: `Error confirming payment: ${error.message}` });
    }
  });
  
  // Analytics endpoints
  app.get('/api/analytics/overview', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Get user data
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Get all museums
      const allMuseums = await storage.getAllMuseums();
      
      // Get user's purchases
      const userPurchases = await storage.getPurchasesByUser(userId);
      
      // Get user's bundle purchases
      const userBundlePurchases = await storage.getBundlePurchasesByUser(userId);
      
      // Calculate total spent
      const totalSpent = userPurchases.reduce((sum, purchase) => sum + purchase.price, 0) +
                        userBundlePurchases.reduce((sum, purchase) => sum + purchase.price, 0);
      
      // Calculate number of active purchases
      const now = new Date();
      const activePurchases = userPurchases.filter(purchase => purchase.expiryDate > now).length +
                             userBundlePurchases.filter(purchase => purchase.expiryDate > now).length;
      
      // Get user's accessible museums
      const accessibleMuseums = await storage.getUserActiveMuseums(userId);
      
      // Return analytics data
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name
        },
        stats: {
          totalSpent,
          totalPurchases: userPurchases.length + userBundlePurchases.length,
          activePurchases,
          accessibleMuseums: accessibleMuseums.length,
          totalMuseums: allMuseums.length
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching analytics overview: ${error.message}` });
    }
  });
  
  app.get('/api/analytics/purchases', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Get user's purchases
      const userPurchases = await storage.getPurchasesByUser(userId);
      
      // Get user's bundle purchases
      const userBundlePurchases = await storage.getBundlePurchasesByUser(userId);
      
      // Enrich purchase data with museum details
      const enrichedPurchases = await Promise.all(userPurchases.map(async (purchase) => {
        const museum = await storage.getMuseum(purchase.museumId);
        return {
          ...purchase,
          type: 'museum',
          itemName: museum?.name || 'Unknown Museum',
          isActive: purchase.expiryDate > new Date()
        };
      }));
      
      // Enrich bundle purchase data with bundle details
      const enrichedBundlePurchases = await Promise.all(userBundlePurchases.map(async (purchase) => {
        const bundle = await storage.getBundle(purchase.bundleId);
        return {
          ...purchase,
          type: 'bundle',
          itemName: bundle?.name || 'Unknown Bundle',
          isActive: purchase.expiryDate > new Date()
        };
      }));
      
      // Combine and sort by purchase date (newest first)
      const allPurchases = [...enrichedPurchases, ...enrichedBundlePurchases]
        .sort((a, b) => b.purchaseDate.getTime() - a.purchaseDate.getTime());
      
      res.json(allPurchases);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching purchase analytics: ${error.message}` });
    }
  });
  
  app.get('/api/analytics/museums', async (req, res) => {
    try {
      // Get all museums
      const museums = await storage.getAllMuseums();
      
      // Get purchase counts for each museum (simplified analytics)
      const museumStats = museums.map(museum => {
        return {
          id: museum.id,
          name: museum.name,
          rating: museum.rating,
          price: museum.price,
          // In a real app, we would query for actual popularity metrics
          // This is a placeholder for demonstration
          popularity: Math.floor(Math.random() * 100)
        };
      });
      
      res.json(museumStats);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching museum analytics: ${error.message}` });
    }
  });
  
  app.get('/api/analytics/user-activity', requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      
      // Get user's purchases to analyze activity
      const userPurchases = await storage.getPurchasesByUser(userId);
      
      // In a real app, we would track actual user activity and museum visits
      // For this demo, we'll create synthetic activity based on purchases
      const activityData = userPurchases.map(purchase => {
        const visitDate = new Date(purchase.purchaseDate);
        visitDate.setDate(visitDate.getDate() + Math.floor(Math.random() * 7)); // Random visit within a week
        
        return {
          museumId: purchase.museumId,
          visitDate: visitDate.toISOString(),
          duration: Math.floor(Math.random() * 60) + 15, // Random duration between 15-75 minutes
        };
      });
      
      res.json(activityData);
    } catch (error: any) {
      res.status(500).json({ message: `Error fetching user activity: ${error.message}` });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
