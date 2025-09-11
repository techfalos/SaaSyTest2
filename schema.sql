-- Database Migration
-- Generated at: 2025-09-11T00:00:05.988Z
-- Mode: Production
-- LOCAL_DEV_MODE: false

CREATE TABLE IF NOT EXISTS "Categories" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "display_order" INTEGER NOT NULL,
  "visible" BOOLEAN NOT NULL
);
CREATE TABLE IF NOT EXISTS "MenuItems" (
  "id" UUID PRIMARY KEY NOT NULL,
  "categoriesid" UUID NOT NULL,
  "name" VARCHAR(150) NOT NULL,
  "description" TEXT NOT NULL,
  "price" DECIMAL(10,2) NOT NULL,
  "image_url" TEXT,
  "ingredients" TEXT,
  "spice_level" VARCHAR(20),
  "calories" INTEGER,
  "available" BOOLEAN NOT NULL,
  "featured" BOOLEAN NOT NULL,
  "preparation_time" INTEGER
);
CREATE TABLE IF NOT EXISTS "ShoppingCart" (
  "id" UUID PRIMARY KEY NOT NULL,
  "menuitemsid" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "special_instructions" TEXT,
  "added_at" TIMESTAMP NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "Users" ("userid")
);
CREATE TABLE IF NOT EXISTS "Orders" (
  "id" UUID PRIMARY KEY NOT NULL,
  "order_number" VARCHAR(50) NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "order_total" DECIMAL(10,2) NOT NULL,
  "tax_amount" DECIMAL(10,2) NOT NULL,
  "pickup_time" TIMESTAMP NOT NULL,
  "pickup_location" VARCHAR(200) NOT NULL,
  "customer_name" VARCHAR(100) NOT NULL,
  "customer_phone" VARCHAR(20) NOT NULL,
  "customer_email" VARCHAR(255),
  "special_instructions" TEXT,
  "payment_status" VARCHAR(50) NOT NULL,
  "payment_method" VARCHAR(50),
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "Users" ("userid")
);
CREATE TABLE IF NOT EXISTS "OrderItems" (
  "id" UUID PRIMARY KEY NOT NULL,
  "ordersid" UUID NOT NULL,
  "menuitemsid" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" DECIMAL(10,2) NOT NULL,
  "total_price" DECIMAL(10,2) NOT NULL,
  "special_instructions" TEXT
);
CREATE TABLE IF NOT EXISTS "Locations" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" VARCHAR(150) NOT NULL,
  "address" TEXT NOT NULL,
  "latitude" DECIMAL(10,8),
  "longitude" DECIMAL(11,8),
  "day_of_week" VARCHAR(20) NOT NULL,
  "start_time" TIME NOT NULL,
  "end_time" TIME NOT NULL,
  "is_current" BOOLEAN NOT NULL,
  "active" BOOLEAN NOT NULL,
  "notes" TEXT
);
CREATE TABLE IF NOT EXISTS "CateringPackages" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" VARCHAR(150) NOT NULL,
  "description" TEXT NOT NULL,
  "price_per_person" DECIMAL(10,2) NOT NULL,
  "minimum_people" INTEGER NOT NULL,
  "maximum_people" INTEGER,
  "included_items" TEXT NOT NULL,
  "setup_fee" DECIMAL(10,2),
  "advance_notice_hours" INTEGER NOT NULL,
  "image_url" TEXT,
  "available" BOOLEAN NOT NULL
);
