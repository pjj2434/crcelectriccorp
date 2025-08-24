import { sqliteTable, AnySQLiteColumn, foreignKey, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const account = sqliteTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: integer("access_token_expires_at"),
	refreshTokenExpiresAt: integer("refresh_token_expires_at"),
	scope: text(),
	password: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
});

export const session = sqliteTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: integer("expires_at").notNull(),
	token: text().notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" } ),
},
(table) => [
	uniqueIndex("session_token_unique").on(table.token),
]);

export const user = sqliteTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: integer("email_verified").notNull(),
	image: text(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
},
(table) => [
	uniqueIndex("user_email_unique").on(table.email),
]);

export const verification = sqliteTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: integer("expires_at").notNull(),
	createdAt: integer("created_at"),
	updatedAt: integer("updated_at"),
});

export const accentSpecialtyLighting = sqliteTable("accent_specialty_lighting", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	fileKey: text("file_key"),
	uploadedBy: text("uploaded_by"),
});

export const customLightingInstallation = sqliteTable("custom_lighting_installation", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	fileKey: text("file_key"),
	uploadedBy: text("uploaded_by"),
});

export const electricalPanelsUpgrades = sqliteTable("electrical_panels_upgrades", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	fileKey: text("file_key"),
	uploadedBy: text("uploaded_by"),
});

export const landscapeOutdoorLighting = sqliteTable("landscape_outdoor_lighting", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	fileKey: text("file_key"),
	uploadedBy: text("uploaded_by"),
});

export const poolSaunaElectrical = sqliteTable("pool_sauna_electrical", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	fileKey: text("file_key"),
	uploadedBy: text("uploaded_by"),
});

export const tvMountingWiring = sqliteTable("tv_mounting_wiring", {
	id: text().primaryKey().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	fileKey: text("file_key"),
	uploadedBy: text("uploaded_by"),
});

export const serviceImages = sqliteTable("service_images", {
	id: text().primaryKey().notNull(),
	service: text().notNull(),
	title: text().notNull(),
	url: text().notNull(),
	fileKey: text("file_key"),
	isActive: integer("is_active").default(true).notNull(),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull(),
	uploadedBy: text("uploaded_by"),
});

