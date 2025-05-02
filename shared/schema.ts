import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name"),
});

export const museums = pgTable("museums", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: integer("price").notNull(), // in cents
  rating: integer("rating"), // out of 5
  panellumUrl: text("panellum_url").notNull(),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  museumId: integer("museum_id").notNull().references(() => museums.id),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  expiryDate: timestamp("expiry_date").notNull(),
  price: integer("price").notNull(),
  paymentIntentId: text("payment_intent_id").notNull(),
});

export const bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  validityDays: integer("validity_days").notNull(),
});

export const bundleMuseums = pgTable("bundle_museums", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id").notNull().references(() => bundles.id),
  museumId: integer("museum_id").notNull().references(() => museums.id),
});

export const bundlePurchases = pgTable("bundle_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  bundleId: integer("bundle_id").notNull().references(() => bundles.id),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  expiryDate: timestamp("expiry_date").notNull(),
  price: integer("price").notNull(),
  paymentIntentId: text("payment_intent_id").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
});

export const insertMuseumSchema = createInsertSchema(museums).pick({
  name: true,
  description: true,
  imageUrl: true,
  duration: true,
  price: true,
  rating: true,
  panellumUrl: true,
});

export const insertPurchaseSchema = createInsertSchema(purchases).pick({
  userId: true,
  museumId: true,
  expiryDate: true,
  price: true,
  paymentIntentId: true,
});

export const insertBundleSchema = createInsertSchema(bundles).pick({
  name: true,
  description: true,
  price: true,
  validityDays: true,
});

export const insertBundleMuseumSchema = createInsertSchema(bundleMuseums).pick({
  bundleId: true,
  museumId: true,
});

export const insertBundlePurchaseSchema = createInsertSchema(bundlePurchases).pick({
  userId: true,
  bundleId: true,
  expiryDate: true,
  price: true,
  paymentIntentId: true,
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  purchases: many(purchases),
  bundlePurchases: many(bundlePurchases),
}));

export const museumsRelations = relations(museums, ({ many }) => ({
  purchases: many(purchases),
  bundleMuseums: many(bundleMuseums),
}));

export const bundlesRelations = relations(bundles, ({ many }) => ({
  bundleMuseums: many(bundleMuseums),
  bundlePurchases: many(bundlePurchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  museum: one(museums, {
    fields: [purchases.museumId],
    references: [museums.id],
  }),
}));

export const bundleMuseumsRelations = relations(bundleMuseums, ({ one }) => ({
  bundle: one(bundles, {
    fields: [bundleMuseums.bundleId],
    references: [bundles.id],
  }),
  museum: one(museums, {
    fields: [bundleMuseums.museumId],
    references: [museums.id],
  }),
}));

export const bundlePurchasesRelations = relations(bundlePurchases, ({ one }) => ({
  user: one(users, {
    fields: [bundlePurchases.userId],
    references: [users.id],
  }),
  bundle: one(bundles, {
    fields: [bundlePurchases.bundleId],
    references: [bundles.id],
  }),
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMuseum = z.infer<typeof insertMuseumSchema>;
export type Museum = typeof museums.$inferSelect;

export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchases.$inferSelect;

export type InsertBundle = z.infer<typeof insertBundleSchema>;
export type Bundle = typeof bundles.$inferSelect;

export type InsertBundleMuseum = z.infer<typeof insertBundleMuseumSchema>;
export type BundleMuseum = typeof bundleMuseums.$inferSelect;

export type InsertBundlePurchase = z.infer<typeof insertBundlePurchaseSchema>;
export type BundlePurchase = typeof bundlePurchases.$inferSelect;
