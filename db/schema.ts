import { sqliteTable, text, integer  } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).notNull(),
	image: text('image'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const session = sqliteTable("session", {
	id: text("id").primaryKey(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' })
});

export const account = sqliteTable("account", {
	id: text("id").primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export const verification = sqliteTable("verification", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
});

export const customLightingInstallation = sqliteTable("custom_lighting_installation", {
  id: text("id").primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  fileKey: text('file_key'), // Add this
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  uploadedBy: text('uploaded_by') // Add this
});

export const landscapeOutdoorLighting = sqliteTable("landscape_outdoor_lighting", {
  id: text("id").primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  fileKey: text('file_key'), // Add this
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  uploadedBy: text('uploaded_by') // Add this
});

export const poolSaunaElectrical = sqliteTable("pool_sauna_electrical", {
  id: text("id").primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  fileKey: text('file_key'), // Add this
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  uploadedBy: text('uploaded_by') // Add this
});

export const tvMountingWiring = sqliteTable("tv_mounting_wiring", {
  id: text("id").primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  fileKey: text('file_key'), // Add this
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  uploadedBy: text('uploaded_by') // Add this
});

export const electricalPanelsUpgrades = sqliteTable("electrical_panels_upgrades", {
  id: text("id").primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  fileKey: text('file_key'), // Add this
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  uploadedBy: text('uploaded_by') // Add this
});

export const accentSpecialtyLighting = sqliteTable("accent_specialty_lighting", {
  id: text("id").primaryKey(),
  title: text('title').notNull(),
  url: text('url').notNull(),
  fileKey: text('file_key'), // Add this
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  uploadedBy: text('uploaded_by') 
  });