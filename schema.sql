-- Database Migration
-- Generated at: 2025-09-08T01:34:05.225Z
-- Mode: Production
-- LOCAL_DEV_MODE: false

CREATE TABLE IF NOT EXISTS "Categories" (
  "id" UUID PRIMARY KEY NOT NULL,
  "name" VARCHAR(200) NOT NULL,
  "slug" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "image_url" TEXT,
  "display_order" INTEGER NOT NULL,
  "published" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS "Dresses" (
  "id" UUID PRIMARY KEY NOT NULL,
  "categoriesid" UUID NOT NULL,
  "name" VARCHAR(300) NOT NULL,
  "slug" VARCHAR(300) NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "compare_at_price" DECIMAL(10,2),
  "sku" VARCHAR(100) NOT NULL,
  "stock_quantity" INTEGER NOT NULL,
  "available_sizes" JSON NOT NULL,
  "available_colors" JSON NOT NULL,
  "material" VARCHAR(200),
  "care_instructions" TEXT,
  "featured" BOOLEAN NOT NULL,
  "published" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS "DressImages" (
  "id" UUID PRIMARY KEY NOT NULL,
  "dressesid" UUID NOT NULL,
  "image_url" TEXT NOT NULL,
  "alt_text" VARCHAR(255),
  "display_order" INTEGER NOT NULL,
  "is_primary" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS "Cart" (
  "id" UUID PRIMARY KEY NOT NULL,
  "dressesid" UUID NOT NULL,
  "size" VARCHAR(50) NOT NULL,
  "color" VARCHAR(100) NOT NULL,
  "quantity" INTEGER NOT NULL,
  "added_at" TIMESTAMP NOT NULL
);
CREATE TABLE IF NOT EXISTS "Addresses" (
  "id" UUID PRIMARY KEY NOT NULL,
  "type" VARCHAR(20) NOT NULL,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "company" VARCHAR(150),
  "address_line_1" VARCHAR(255) NOT NULL,
  "address_line_2" VARCHAR(255),
  "city" VARCHAR(100) NOT NULL,
  "state_province" VARCHAR(100) NOT NULL,
  "postal_code" VARCHAR(20) NOT NULL,
  "country" VARCHAR(100) NOT NULL,
  "phone" VARCHAR(20),
  "is_default" BOOLEAN NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "Users" ("userid")
);
CREATE TABLE IF NOT EXISTS "Orders" (
  "id" UUID PRIMARY KEY NOT NULL,
  "order_number" VARCHAR(50) NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "subtotal" DECIMAL(10,2) NOT NULL,
  "tax_amount" DECIMAL(10,2) NOT NULL,
  "shipping_amount" DECIMAL(10,2) NOT NULL,
  "total_amount" DECIMAL(10,2) NOT NULL,
  "currency" VARCHAR(3) NOT NULL,
  "payment_status" VARCHAR(50) NOT NULL,
  "payment_method" VARCHAR(50),
  "shipping_address" JSON NOT NULL,
  "billing_address" JSON NOT NULL,
  "notes" TEXT,
  "tracking_number" VARCHAR(100),
  "shipped_at" TIMESTAMP,
  "delivered_at" TIMESTAMP,
  "created_at" TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "Users" ("userid")
);
CREATE TABLE IF NOT EXISTS "OrderItems" (
  "id" UUID PRIMARY KEY NOT NULL,
  "ordersid" UUID NOT NULL,
  "dressesid" UUID NOT NULL,
  "quantity" INTEGER NOT NULL,
  "size" VARCHAR(50) NOT NULL,
  "color" VARCHAR(100) NOT NULL,
  "price_at_time" DECIMAL(10,2) NOT NULL,
  "line_total" DECIMAL(10,2) NOT NULL,
  "created_at" TIMESTAMP NOT NULL
);
