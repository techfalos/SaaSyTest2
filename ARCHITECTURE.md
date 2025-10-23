# Architecture Documentation

This document provides an overview of the application architecture, including database schema, API endpoints, and view components.

Generated on: 2025-10-23T23:26:58.935Z

## Table of Contents

1. [Database Schema](#database-schema)
2. [API Endpoints](#api-endpoints)
3. [Views and Components](#views-and-components)
4. [Data Flow](#data-flow)

## Database Schema

### Tables

#### Categories

- **ID**: categories-001
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| name | VARCHAR | 100 | true | - | true | - |
| description | TEXT | - | false | - | true | - |
| image_url | TEXT | - | false | - | false | Image |
| display_order | INTEGER | - | false | - | false | - |
| visible | BOOLEAN | - | true | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: everyone
- Update: admin
- Delete: admin

#### ContactMessages

- **ID**: contactmessages-001
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| name | VARCHAR | 100 | true | - | true | - |
| email | VARCHAR | 100 | true | - | true | - |
| phone | VARCHAR | 20 | false | - | false | - |
| subject | VARCHAR | 200 | true | - | true | - |
| message | TEXT | - | true | - | true | - |
| submitted_date | TIMESTAMP | - | true | - | false | - |
| responded | BOOLEAN | - | false | - | false | - |
| response_notes | TEXT | - | false | - | false | - |

**Authentication Requirements:**
- Add: everyone
- Get: admin
- Update: admin
- Delete: admin

#### OrderItems

- **ID**: orderitems-001
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| ordersid | UUID | - | true | foreign | false | - |
| productsid | UUID | - | true | foreign | false | - |
| product_name | VARCHAR | 200 | true | - | true | - |
| quantity | INTEGER | - | true | - | false | - |
| unit_price | DECIMAL | 10,2 | true | - | false | - |
| total_price | DECIMAL | 10,2 | true | - | false | - |
| size | VARCHAR | 50 | false | - | false | - |
| color | VARCHAR | 50 | false | - | false | - |

**Authentication Requirements:**
- Add: registereduser
- Get: registereduser
- Update: admin
- Delete: admin

#### Orders

- **ID**: orders-001
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| order_number | VARCHAR | 50 | true | - | true | - |
| order_date | TIMESTAMP | - | true | - | false | - |
| status | VARCHAR | 50 | true | - | true | - |
| subtotal | DECIMAL | 10,2 | true | - | false | - |
| tax | DECIMAL | 10,2 | true | - | false | - |
| shipping_cost | DECIMAL | 10,2 | true | - | false | - |
| total | DECIMAL | 10,2 | true | - | false | - |
| payment_method | VARCHAR | 50 | false | - | false | - |
| payment_status | VARCHAR | 50 | true | - | true | - |
| transaction_id | VARCHAR | 100 | false | - | true | - |
| shipping_name | VARCHAR | 100 | true | - | true | - |
| shipping_address_line1 | VARCHAR | 200 | true | - | false | - |
| shipping_address_line2 | VARCHAR | 200 | false | - | false | - |
| shipping_city | VARCHAR | 100 | true | - | false | - |
| shipping_state | VARCHAR | 100 | true | - | false | - |
| shipping_postal_code | VARCHAR | 20 | true | - | false | - |
| shipping_country | VARCHAR | 100 | true | - | false | - |
| tracking_number | VARCHAR | 100 | false | - | true | - |
| notes | TEXT | - | false | - | false | - |

**Authentication Requirements:**
- Add: registereduser
- Get: registereduser
- Update: admin
- Delete: admin

#### ProductImages

- **ID**: productimages-001
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| productsid | UUID | - | true | foreign | false | - |
| image_url | TEXT | - | true | - | false | Image |
| display_order | INTEGER | - | false | - | false | - |
| is_primary | BOOLEAN | - | false | - | false | - |
| caption | TEXT | - | false | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: everyone
- Update: admin
- Delete: admin

#### Products

- **ID**: products-001
- **User-specific data**: false
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| categoriesid | UUID | - | true | foreign | false | - |
| name | VARCHAR | 200 | true | - | true | - |
| description | TEXT | - | true | - | true | - |
| price | DECIMAL | 10,2 | true | - | false | - |
| sku | VARCHAR | 50 | false | - | true | - |
| stock_quantity | INTEGER | - | true | - | false | - |
| size | VARCHAR | 50 | false | - | true | - |
| color | VARCHAR | 50 | false | - | true | - |
| material | VARCHAR | 100 | false | - | true | - |
| era_period | VARCHAR | 100 | false | - | true | - |
| care_instructions | TEXT | - | false | - | false | - |
| available | BOOLEAN | - | true | - | false | - |
| featured | BOOLEAN | - | false | - | false | - |

**Authentication Requirements:**
- Add: admin
- Get: everyone
- Update: admin
- Delete: admin

#### ShippingAddresses

- **ID**: shippingaddresses-001
- **User-specific data**: true
- **State**: persistent
- **CRUD operations**: true

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| address_name | VARCHAR | 50 | false | - | false | - |
| recipient_name | VARCHAR | 100 | true | - | true | - |
| address_line1 | VARCHAR | 200 | true | - | false | - |
| address_line2 | VARCHAR | 200 | false | - | false | - |
| city | VARCHAR | 100 | true | - | false | - |
| state | VARCHAR | 100 | true | - | false | - |
| postal_code | VARCHAR | 20 | true | - | false | - |
| country | VARCHAR | 100 | true | - | false | - |
| phone | VARCHAR | 20 | false | - | false | - |
| is_default | BOOLEAN | - | false | - | false | - |

**Authentication Requirements:**
- Add: registereduser
- Get: registereduser
- Update: registereduser
- Delete: registereduser

#### ShoppingCart

- **ID**: shoppingcart-001
- **User-specific data**: false
- **State**: ephemeral
- **CRUD operations**: false

**Fields:**

| Field Name | Data Type | Size | Required | Key | Searchable | Notes |
|------------|-----------|------|----------|-----|------------|-------|
| id | UUID | - | true | primary | false | - |
| productsid | UUID | - | true | foreign | false | - |
| quantity | INTEGER | - | true | - | false | - |
| size | VARCHAR | 50 | false | - | false | - |
| color | VARCHAR | 50 | false | - | false | - |

**Authentication Requirements:**
- Add: everyone
- Get: everyone
- Update: everyone
- Delete: everyone

### Relationships

#### Products Relationships

- **Products.categoriesid** → **Categories.id** (many-to-one)

#### ProductImages Relationships

- **ProductImages.productsid** → **Products.id** (many-to-one)

#### OrderItems Relationships

- **OrderItems.ordersid** → **Orders.id** (many-to-one)
- **OrderItems.productsid** → **Products.id** (many-to-one)

## API Endpoints

### GET /api/CategoriesList

- **ID**: categorieslist
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (categorieslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| search | string | No | - | - |
| visible | boolean | No | - | - |
| sortBy | string | No | - | - |
| sortOrder | string | No | - | - |

**Output Format (categorieslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<categorylistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (categorylistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | Yes | - | - |

**Implementation Notes:**
Retrieve a paginated list of product categories with search and filtering capabilities. Support filtering by visibility status, searching by name or description, and sorting by display order or name. Return category details including id, name, description, image_url, display_order, and visible status. Include pagination metadata with total count, current page, limit, and total pages. This API powers the collection browser and featured collections displays on the homepage and collections page.

### GET /api/CategoriesGet

- **ID**: categoriesget
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (categoriesgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (categoriesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | Yes | - | - |

**Implementation Notes:**
Retrieve detailed information for a single category by its UUID. Return all category fields including id, name, description, image_url, display_order, and visible status. Used when displaying a specific collection's details or navigating to a collection page. Return 404 if category not found.

### POST /api/CategoriesCreate

- **ID**: categoriescreate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (categoriesinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| name | string | Yes | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | No | - | - |

**Output Format (categoriesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | Yes | - | - |

**Implementation Notes:**
Create a new product category with name, description, image_url, display_order, and visible status. Validate that name is provided and unique. Generate UUID for new category. Set default visible to true if not specified. Return the newly created category with all fields including generated id. Only admins can create categories.

### PUT /api/CategoriesUpdate

- **ID**: categoriesupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (categoriesupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | No | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | No | - | - |

**Output Format (categoriesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | Yes | - | - |

**Implementation Notes:**
Update an existing category by UUID. Allow updating name, description, image_url, display_order, and visible status. Validate that category exists before updating. Ensure name uniqueness if changed. Return the updated category with all fields. Only admins can update categories.

### DELETE /api/CategoriesDelete

- **ID**: categoriesdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (categoriesdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Delete a category by UUID. Validate that category exists before deletion. Check if category has associated products and prevent deletion if products exist (return error message). Return success confirmation after deletion. Only admins can delete categories.

### GET /api/ProductsList

- **ID**: productslist
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (productslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| categoriesid | string | No | - | - |
| search | string | No | - | - |
| available | boolean | No | - | - |
| featured | boolean | No | - | - |
| minPrice | number | No | - | - |
| maxPrice | number | No | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| sortBy | string | No | - | - |
| sortOrder | string | No | - | - |

**Output Format (productslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<productlistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (productlistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |
| primary_image_url | string | No | - | - |

**Implementation Notes:**
Retrieve a paginated list of products with comprehensive search and filtering capabilities. Support filtering by category (categoriesid), availability status, featured flag, price range (min/max), size, color, material, and era_period. Support text search across name and description. Include sorting by price, name, or creation date. Return product details including id, categoriesid, name, description, price, sku, stock_quantity, size, color, material, era_period, available, featured, and the primary product image URL from ProductImages. Include pagination metadata. This API powers the product listing page and shop views.

### GET /api/ProductsGet

- **ID**: productsget
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (productsgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (productdetailoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| category_name | string | No | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| care_instructions | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |
| images | array<productimage> | No | - | - |

**images Item Structure (productimage):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| image_url | string | Yes | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Implementation Notes:**
Retrieve detailed information for a single product by UUID. Return all product fields including id, categoriesid, name, description, price, sku, stock_quantity, size, color, material, era_period, care_instructions, available, and featured status. Include related category information and all associated product images from ProductImages table ordered by display_order. This API powers the product detail page showing comprehensive product information.

### POST /api/ProductsCreate

- **ID**: productscreate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (productsinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| care_instructions | string | No | - | - |
| available | boolean | No | - | - |
| featured | boolean | No | - | - |

**Output Format (productsoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| care_instructions | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |

**Implementation Notes:**
Create a new product with all required fields: categoriesid, name, description, price, stock_quantity, and available status. Optional fields include sku, size, color, material, era_period, care_instructions, and featured flag. Validate that categoriesid references an existing category. Generate UUID for new product. Set default available to true and featured to false if not specified. Return newly created product with all fields. Only admins can create products.

### PUT /api/ProductsUpdate

- **ID**: productsupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (productsupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | No | - | - |
| name | string | No | - | - |
| description | string | No | - | - |
| price | number | No | - | - |
| sku | string | No | - | - |
| stock_quantity | number | No | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| care_instructions | string | No | - | - |
| available | boolean | No | - | - |
| featured | boolean | No | - | - |

**Output Format (productsoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| care_instructions | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |

**Implementation Notes:**
Update an existing product by UUID. Allow updating any product field except id. Validate that product exists and categoriesid references valid category if changed. Handle stock quantity updates for inventory management. Return updated product with all fields. Only admins can update products.

### DELETE /api/ProductsDelete

- **ID**: productsdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (productsdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Delete a product by UUID. Validate product exists before deletion. Check for associated order items and prevent deletion if product has been ordered (return error). Also delete associated ProductImages records. Return success confirmation. Only admins can delete products.

### GET /api/ProductImagesList

- **ID**: productimageslist
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (productimageslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| productsid | string | Yes | - | - |
| is_primary | boolean | No | - | - |

**Output Format (productimageslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<productimagesoutput> | Yes | - | - |

**data Item Structure (productimagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| image_url | string | Yes | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Implementation Notes:**
Retrieve all images for a specific product ordered by display_order. Support filtering by productsid (required) and is_primary flag. Return image details including id, productsid, image_url, display_order, is_primary, and caption. Used for product image galleries and carousels on product detail pages.

### GET /api/ProductImagesGet

- **ID**: productimagesget
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (productimagesgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (productimagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| image_url | string | Yes | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Implementation Notes:**
Retrieve a single product image by UUID. Return all image fields including id, productsid, image_url, display_order, is_primary, and caption. Used when managing individual images in admin interface.

### POST /api/ProductImagesCreate

- **ID**: productimagescreate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (productimagesinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| productsid | string | Yes | - | - |
| image_url | string | Yes | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Output Format (productimagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| image_url | string | Yes | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Implementation Notes:**
Add a new image to a product. Require productsid and image_url. Optional fields include display_order, is_primary, and caption. Validate productsid references existing product. If is_primary is true, set all other images for this product to is_primary false. Generate UUID for new image. Return created image with all fields. Only admins can add product images.

### PUT /api/ProductImagesUpdate

- **ID**: productimagesupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (productimagesupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Output Format (productimagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| image_url | string | Yes | - | - |
| display_order | number | No | - | - |
| is_primary | boolean | No | - | - |
| caption | string | No | - | - |

**Implementation Notes:**
Update a product image by UUID. Allow updating image_url, display_order, is_primary, and caption. If is_primary changed to true, set other images for same product to false. Validate image exists. Return updated image. Only admins can update images.

### DELETE /api/ProductImagesDelete

- **ID**: productimagesdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (productimagesdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Delete a product image by UUID. Validate image exists before deletion. If deleting primary image, automatically set another image for the product as primary if available. Return success confirmation. Only admins can delete images.

### GET /api/OrdersList

- **ID**: orderslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (orderslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| status | string | No | - | - |
| payment_status | string | No | - | - |
| startDate | string | No | - | - |
| endDate | string | No | - | - |
| search | string | No | - | - |
| sortBy | string | No | - | - |
| sortOrder | string | No | - | - |

**Output Format (orderslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<orderlistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (orderlistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| order_number | string | Yes | - | - |
| order_date | string | Yes | - | - |
| status | string | Yes | - | - |
| total | number | Yes | - | - |
| payment_status | string | Yes | - | - |
| shipping_name | string | Yes | - | - |
| item_count | number | Yes | - | - |

**Implementation Notes:**
Retrieve paginated list of orders. For registered users, return only their own orders. For admins, return all orders with optional filtering by status, date range, payment_status, and user. Support searching by order_number, customer name, or email. Include sorting by order_date (newest first default), total, or status. Return order summary including id, order_number, order_date, status, total, payment_status, shipping_name, and item count. Include pagination metadata. Powers order history and admin order management pages.

### GET /api/OrdersGet

- **ID**: ordersget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (ordersgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (orderdetailoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| order_number | string | Yes | - | - |
| order_date | string | Yes | - | - |
| status | string | Yes | - | - |
| subtotal | number | Yes | - | - |
| tax | number | Yes | - | - |
| shipping_cost | number | Yes | - | - |
| total | number | Yes | - | - |
| payment_method | string | No | - | - |
| payment_status | string | Yes | - | - |
| transaction_id | string | No | - | - |
| shipping_name | string | Yes | - | - |
| shipping_address_line1 | string | Yes | - | - |
| shipping_address_line2 | string | No | - | - |
| shipping_city | string | Yes | - | - |
| shipping_state | string | Yes | - | - |
| shipping_postal_code | string | Yes | - | - |
| shipping_country | string | Yes | - | - |
| tracking_number | string | No | - | - |
| notes | string | No | - | - |
| items | array<orderitemdetail> | Yes | - | - |

**items Item Structure (orderitemdetail):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| product_image_url | string | No | - | - |

**Implementation Notes:**
Retrieve complete order details by UUID. For registered users, verify order belongs to them. For admins, allow viewing any order. Return all order fields including id, order_number, order_date, status, subtotal, tax, shipping_cost, total, payment_method, payment_status, transaction_id, complete shipping address, tracking_number, and notes. Include array of order items with product details from OrderItems. Powers order detail and confirmation pages.

### POST /api/OrdersCreate

- **ID**: orderscreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (ordersinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| items | array<orderiteminput> | Yes | - | - |
| shipping_name | string | Yes | - | - |
| shipping_address_line1 | string | Yes | - | - |
| shipping_address_line2 | string | No | - | - |
| shipping_city | string | Yes | - | - |
| shipping_state | string | Yes | - | - |
| shipping_postal_code | string | Yes | - | - |
| shipping_country | string | Yes | - | - |
| subtotal | number | Yes | - | - |
| tax | number | Yes | - | - |
| shipping_cost | number | Yes | - | - |
| total | number | Yes | - | - |
| payment_method | string | No | - | - |
| notes | string | No | - | - |

**items Item Structure (orderiteminput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| productsid | string | Yes | - | - |
| quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Output Format (orderdetailoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| order_number | string | Yes | - | - |
| order_date | string | Yes | - | - |
| status | string | Yes | - | - |
| subtotal | number | Yes | - | - |
| tax | number | Yes | - | - |
| shipping_cost | number | Yes | - | - |
| total | number | Yes | - | - |
| payment_method | string | No | - | - |
| payment_status | string | Yes | - | - |
| transaction_id | string | No | - | - |
| shipping_name | string | Yes | - | - |
| shipping_address_line1 | string | Yes | - | - |
| shipping_address_line2 | string | No | - | - |
| shipping_city | string | Yes | - | - |
| shipping_state | string | Yes | - | - |
| shipping_postal_code | string | Yes | - | - |
| shipping_country | string | Yes | - | - |
| tracking_number | string | No | - | - |
| notes | string | No | - | - |
| items | array<orderitemdetail> | Yes | - | - |

**items Item Structure (orderitemdetail):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| product_image_url | string | No | - | - |

**Implementation Notes:**
Create a new order during checkout process. Require order items array with product IDs and quantities, shipping address details, subtotal, tax, shipping_cost, and total. Generate unique order_number with format ORD-YYYYMMDD-XXXX. Set initial status to 'pending' and payment_status to 'unpaid'. Create associated OrderItems records. Associate order with authenticated user. Validate product availability and stock before creating order. Return created order with all details including generated order_number. Registered users only.

### PUT /api/OrdersUpdate

- **ID**: ordersupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (ordersupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| status | string | No | - | - |
| payment_status | string | No | - | - |
| tracking_number | string | No | - | - |
| notes | string | No | - | - |

**Output Format (orderdetailoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| order_number | string | Yes | - | - |
| order_date | string | Yes | - | - |
| status | string | Yes | - | - |
| subtotal | number | Yes | - | - |
| tax | number | Yes | - | - |
| shipping_cost | number | Yes | - | - |
| total | number | Yes | - | - |
| payment_method | string | No | - | - |
| payment_status | string | Yes | - | - |
| transaction_id | string | No | - | - |
| shipping_name | string | Yes | - | - |
| shipping_address_line1 | string | Yes | - | - |
| shipping_address_line2 | string | No | - | - |
| shipping_city | string | Yes | - | - |
| shipping_state | string | Yes | - | - |
| shipping_postal_code | string | Yes | - | - |
| shipping_country | string | Yes | - | - |
| tracking_number | string | No | - | - |
| notes | string | No | - | - |
| items | array<orderitemdetail> | Yes | - | - |

**items Item Structure (orderitemdetail):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| product_image_url | string | No | - | - |

**Implementation Notes:**
Update order details by UUID. Allow admins to update status, payment_status, tracking_number, and notes. Allow limited updates for order processing workflow transitions (pending->processing->shipped->delivered). Validate status transitions are logical. Send notification emails on status changes (e.g., shipping confirmation). Return updated order with all fields. Only admins can update orders.

### DELETE /api/OrdersDelete

- **ID**: ordersdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (ordersdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Delete an order by UUID. Only allow deletion of orders in 'pending' or 'cancelled' status to prevent deleting fulfilled orders. Also delete associated OrderItems records. Return success confirmation. Only admins can delete orders.

### GET /api/OrderItemsList

- **ID**: orderitemslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (orderitemslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| ordersid | string | Yes | - | - |

**Output Format (orderitemslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<orderitemsoutput> | Yes | - | - |

**data Item Structure (orderitemsoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| ordersid | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Implementation Notes:**
Retrieve all items for a specific order. Require ordersid filter. Return item details including id, ordersid, productsid, product_name, quantity, unit_price, total_price, size, and color. Used to display order contents in order detail views. For registered users, verify order belongs to them.

### GET /api/OrderItemsGet

- **ID**: orderitemsget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (orderitemsgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (orderitemsoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| ordersid | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Implementation Notes:**
Retrieve a single order item by UUID. Return all order item fields. Used in admin interface for order item management. Verify access permissions based on order ownership.

### POST /api/OrderItemsCreate

- **ID**: orderitemscreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (orderitemsinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| ordersid | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Output Format (orderitemsoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| ordersid | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Implementation Notes:**
Add an item to an existing order. Require ordersid, productsid, product_name, quantity, unit_price, and total_price. Optional size and color. Validate order exists and is modifiable (pending status). Validate product exists and is available. Update order totals accordingly. Generate UUID. Return created item. Registered users can add to their own pending orders.

### PUT /api/OrderItemsUpdate

- **ID**: orderitemsupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (orderitemsupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| quantity | number | No | - | - |
| unit_price | number | No | - | - |
| total_price | number | No | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Output Format (orderitemsoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| ordersid | string | Yes | - | - |
| productsid | string | Yes | - | - |
| product_name | string | Yes | - | - |
| quantity | number | Yes | - | - |
| unit_price | number | Yes | - | - |
| total_price | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |

**Implementation Notes:**
Update an order item by UUID. Allow updating quantity, unit_price, total_price, size, and color. Only allow updates for orders in 'pending' status. Recalculate order totals after update. Validate item and order exist. Return updated item. Admin only for order modifications.

### DELETE /api/OrderItemsDelete

- **ID**: orderitemsdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (orderitemsdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Remove an item from an order by UUID. Only allow deletion from orders in 'pending' status. Recalculate order totals after deletion. If last item removed, consider cancelling or deleting order. Return success confirmation. Admin only.

### GET /api/ContactMessagesList

- **ID**: contactmessageslist
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactmessageslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| page | number | No | - | - |
| limit | number | No | - | - |
| responded | boolean | No | - | - |
| startDate | string | No | - | - |
| endDate | string | No | - | - |
| search | string | No | - | - |
| sortBy | string | No | - | - |
| sortOrder | string | No | - | - |

**Output Format (contactmessageslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<contactmessagelistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (contactmessagelistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| email | string | Yes | - | - |
| subject | string | Yes | - | - |
| submitted_date | string | Yes | - | - |
| responded | boolean | No | - | - |

**Implementation Notes:**
Retrieve paginated list of contact form submissions. Support filtering by responded status and date range. Support searching by name, email, or subject. Include sorting by submitted_date (newest first default). Return message summary including id, name, email, subject, submitted_date, and responded status. Include pagination metadata. Only admins can view contact messages.

### GET /api/ContactMessagesGet

- **ID**: contactmessagesget
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactmessagesgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (contactmessagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| subject | string | Yes | - | - |
| message | string | Yes | - | - |
| submitted_date | string | Yes | - | - |
| responded | boolean | No | - | - |
| response_notes | string | No | - | - |

**Implementation Notes:**
Retrieve complete contact message details by UUID. Return all fields including id, name, email, phone, subject, message, submitted_date, responded status, and response_notes. Used in admin interface to view and respond to customer inquiries. Admin only.

### POST /api/ContactMessagesCreate

- **ID**: contactmessagescreate
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (contactmessagesinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| subject | string | Yes | - | - |
| message | string | Yes | - | - |

**Output Format (contactmessagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| subject | string | Yes | - | - |
| message | string | Yes | - | - |
| submitted_date | string | Yes | - | - |
| responded | boolean | No | - | - |
| response_notes | string | No | - | - |

**Implementation Notes:**
Submit a new contact form message. Require name, email, subject, and message. Phone is optional. Set submitted_date to current timestamp. Set responded to false by default. Generate UUID. Send notification email to admin about new message. Return created message confirmation. Anyone can submit contact messages.

### PUT /api/ContactMessagesUpdate

- **ID**: contactmessagesupdate
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactmessagesupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| responded | boolean | No | - | - |
| response_notes | string | No | - | - |

**Output Format (contactmessagesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| email | string | Yes | - | - |
| phone | string | No | - | - |
| subject | string | Yes | - | - |
| message | string | Yes | - | - |
| submitted_date | string | Yes | - | - |
| responded | boolean | No | - | - |
| response_notes | string | No | - | - |

**Implementation Notes:**
Update a contact message by UUID. Allow admins to update responded status and response_notes fields to track customer service interactions. Return updated message. Admin only.

### DELETE /api/ContactMessagesDelete

- **ID**: contactmessagesdelete
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (contactmessagesdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Delete a contact message by UUID. Allow admins to remove spam or resolved messages. Return success confirmation. Admin only.

### GET /api/ShippingAddressesList

- **ID**: shippingaddresseslist
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (shippingaddresseslistinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| is_default | boolean | No | - | - |

**Output Format (shippingaddresseslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<shippingaddressesoutput> | Yes | - | - |

**data Item Structure (shippingaddressesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| address_name | string | No | - | - |
| recipient_name | string | Yes | - | - |
| address_line1 | string | Yes | - | - |
| address_line2 | string | No | - | - |
| city | string | Yes | - | - |
| state | string | Yes | - | - |
| postal_code | string | Yes | - | - |
| country | string | Yes | - | - |
| phone | string | No | - | - |
| is_default | boolean | No | - | - |

**Implementation Notes:**
Retrieve all saved shipping addresses for the authenticated user. Support filtering by is_default flag. Return address details including id, address_name, recipient_name, complete address fields, phone, and is_default status. Used in checkout process to select shipping address and in user account management. Registered users see only their own addresses.

### GET /api/ShippingAddressesGet

- **ID**: shippingaddressesget
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (shippingaddressesgetinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (shippingaddressesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| address_name | string | No | - | - |
| recipient_name | string | Yes | - | - |
| address_line1 | string | Yes | - | - |
| address_line2 | string | No | - | - |
| city | string | Yes | - | - |
| state | string | Yes | - | - |
| postal_code | string | Yes | - | - |
| country | string | Yes | - | - |
| phone | string | No | - | - |
| is_default | boolean | No | - | - |

**Implementation Notes:**
Retrieve a single shipping address by UUID. Verify address belongs to authenticated user. Return all address fields. Used when editing saved addresses or selecting address during checkout.

### POST /api/ShippingAddressesCreate

- **ID**: shippingaddressescreate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (shippingaddressesinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| address_name | string | No | - | - |
| recipient_name | string | Yes | - | - |
| address_line1 | string | Yes | - | - |
| address_line2 | string | No | - | - |
| city | string | Yes | - | - |
| state | string | Yes | - | - |
| postal_code | string | Yes | - | - |
| country | string | Yes | - | - |
| phone | string | No | - | - |
| is_default | boolean | No | - | - |

**Output Format (shippingaddressesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| address_name | string | No | - | - |
| recipient_name | string | Yes | - | - |
| address_line1 | string | Yes | - | - |
| address_line2 | string | No | - | - |
| city | string | Yes | - | - |
| state | string | Yes | - | - |
| postal_code | string | Yes | - | - |
| country | string | Yes | - | - |
| phone | string | No | - | - |
| is_default | boolean | No | - | - |

**Implementation Notes:**
Save a new shipping address for authenticated user. Require recipient_name, address_line1, city, state, postal_code, and country. Optional fields include address_name, address_line2, phone, and is_default. If is_default is true, set all other user addresses to is_default false. Associate address with authenticated user. Generate UUID. Return created address. Registered users only.

### PUT /api/ShippingAddressesUpdate

- **ID**: shippingaddressesupdate
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (shippingaddressesupdateinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| address_name | string | No | - | - |
| recipient_name | string | No | - | - |
| address_line1 | string | No | - | - |
| address_line2 | string | No | - | - |
| city | string | No | - | - |
| state | string | No | - | - |
| postal_code | string | No | - | - |
| country | string | No | - | - |
| phone | string | No | - | - |
| is_default | boolean | No | - | - |

**Output Format (shippingaddressesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| address_name | string | No | - | - |
| recipient_name | string | Yes | - | - |
| address_line1 | string | Yes | - | - |
| address_line2 | string | No | - | - |
| city | string | Yes | - | - |
| state | string | Yes | - | - |
| postal_code | string | Yes | - | - |
| country | string | Yes | - | - |
| phone | string | No | - | - |
| is_default | boolean | No | - | - |

**Implementation Notes:**
Update a saved shipping address by UUID. Verify address belongs to authenticated user. Allow updating any address field. If is_default changed to true, set user's other addresses to false. Return updated address. Users can update their own addresses.

### DELETE /api/ShippingAddressesDelete

- **ID**: shippingaddressesdelete
- **Authentication Required**: registereduser
- **User Tier**: None

**Input Parameters (shippingaddressesdeleteinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |

**Output Format (deleteoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| success | boolean | Yes | - | - |
| message | string | Yes | - | - |

**Implementation Notes:**
Delete a shipping address by UUID. Verify address belongs to authenticated user. If deleting default address and user has other addresses, set another address as default. Return success confirmation. Users can delete their own addresses.

### GET /api/FeaturedProductsGet

- **ID**: featuredproducts
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters:** None

**Output Format (productslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<productlistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (productlistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |
| primary_image_url | string | No | - | - |

**Implementation Notes:**
Retrieve a list of featured products for homepage display. Filter products where featured=true and available=true. Limit to 6-8 products. Return product summary including id, name, price, and primary image URL. Sort by newest or random for variety. This powers the featured collections carousel on the homepage.

### GET /api/ProductsByCategoryGet

- **ID**: productsbycategory
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (productsbycategoryinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| categoryid | string | Yes | - | - |
| page | number | No | - | - |
| limit | number | No | - | - |
| available | boolean | No | - | - |
| minPrice | number | No | - | - |
| maxPrice | number | No | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| sortBy | string | No | - | - |
| sortOrder | string | No | - | - |

**Output Format (productsbycategoryoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| category | object (categoriesoutput) | Yes | - | - |
| products | object (productslistoutput) | Yes | - | - |

**category Structure (categoriesoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | No | - | - |
| image_url | string | No | - | - |
| display_order | number | No | - | - |
| visible | boolean | Yes | - | - |

**products Structure (productslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<productlistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (productlistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |
| primary_image_url | string | No | - | - |

**Implementation Notes:**
Retrieve all products for a specific category with filtering and sorting. Require categoryid parameter. Filter by availability, price range, size, color, material, and era_period. Support sorting by price, name, or newest. Return products with primary image URLs. Include category information in response. Powers the product listing page when browsing a specific collection.

### GET /api/ProductsSearch

- **ID**: searchproducts
- **Authentication Required**: everyone
- **User Tier**: None

**Input Parameters (productsearchinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| query | string | Yes | - | - |
| page | number | No | - | - |
| limit | number | No | - | - |
| categoriesid | string | No | - | - |
| minPrice | number | No | - | - |
| maxPrice | number | No | - | - |
| available | boolean | No | - | - |

**Output Format (productslistoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| data | array<productlistitem> | Yes | - | - |
| total | number | Yes | - | - |
| page | number | Yes | - | - |
| limit | number | Yes | - | - |
| totalPages | number | Yes | - | - |

**data Item Structure (productlistitem):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| id | string | Yes | - | - |
| categoriesid | string | Yes | - | - |
| name | string | Yes | - | - |
| description | string | Yes | - | - |
| price | number | Yes | - | - |
| sku | string | No | - | - |
| stock_quantity | number | Yes | - | - |
| size | string | No | - | - |
| color | string | No | - | - |
| material | string | No | - | - |
| era_period | string | No | - | - |
| available | boolean | Yes | - | - |
| featured | boolean | No | - | - |
| primary_image_url | string | No | - | - |

**Implementation Notes:**
Global product search across name, description, material, and era_period fields. Support filtering by category, price range, and availability. Return ranked results with product summary and primary images. Include search result count. Powers site-wide product search functionality.

### GET /api/OrderSummaryGet

- **ID**: ordersummary
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters (ordersummaryinput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| startDate | string | No | - | - |
| endDate | string | No | - | - |

**Output Format (ordersummaryoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| total_orders | number | Yes | - | - |
| total_revenue | number | Yes | - | - |
| pending_orders | number | Yes | - | - |
| processing_orders | number | Yes | - | - |
| shipped_orders | number | Yes | - | - |
| delivered_orders | number | Yes | - | - |
| cancelled_orders | number | Yes | - | - |
| recent_orders_count | number | Yes | - | - |
| revenue_by_status | object | Yes | - | - |

**Implementation Notes:**
Get order statistics and summary for admin dashboard. Return total orders count, revenue totals by status, recent orders count, pending orders requiring attention, and orders by status breakdown. Include date range filtering for reporting. Admin only for business intelligence.

### GET /api/InventoryStatusGet

- **ID**: inventorystatus
- **Authentication Required**: admin
- **User Tier**: None

**Input Parameters:** None

**Output Format (inventorystatusoutput):**

| Property | Type | Required | Description | Constraints |
|----------|------|----------|-------------|-------------|
| total_products | number | Yes | - | - |
| low_stock_count | number | Yes | - | - |
| out_of_stock_count | number | Yes | - | - |
| available_products | number | Yes | - | - |
| unavailable_products | number | Yes | - | - |
| products_by_category | array<object> | Yes | - | - |

**Implementation Notes:**
Get inventory status summary for admin dashboard. Return total products count, low stock items (quantity < 10), out of stock items (quantity = 0), and products by category breakdown. Help admins monitor inventory health. Admin only.

## Views and Components

### Logos

#### Logo

- **ID**: c365d763-bdcd-432d-8679-6b4fb1f080cb
- **Type**: logo

**Description:**
/logo.png

### Menus

#### Header Menu

- **ID**: c03c07d2-d7d6-4355-97d5-be29e7b9438c
- **Type**: menu

**Description:**
6e7e54f0-3549-4784-aa00-ce7dddf2d079

#### Header (Logged In)

- **ID**: 81159f18-4e60-4f9d-803a-bf15b998d8e6
- **Type**: menu

**Description:**
a81d162b-c53d-4bdd-8625-c86ae9fafcd6

#### Header (Admin)

- **ID**: f9683e41-4258-4965-9afe-66a28ddb41bb
- **Type**: menu

**Description:**
0d53ed27-0291-4534-bd80-b4a4114117f2

#### Footer Menu

- **ID**: 67bdb9e4-a4e1-4469-9767-d590a19192f9
- **Type**: menu

**Description:**
a27bec24-cd76-4f17-bfe7-59a6ebcac222

### Login Buttons

#### Header Login

- **ID**: 7263189a-e423-4d61-8958-c45906f3cf76
- **Type**: loginbutton

### Containers

#### Header

- **ID**: fef2beb5-0a79-4837-a9ff-4a0dbee43948
- **Type**: container

**Description:**
[{"viewId":"c365d763-bdcd-432d-8679-6b4fb1f080cb","colpos":2,"colposmd":10,"colpossm":8},{"viewId":"c03c07d2-d7d6-4355-97d5-be29e7b9438c","colpos":7,"colposmd":1,"colpossm":2},{"viewId":"41d78db3-bd93-4cf6-8389-d5275b38914c","colpos":1,"colposmd":0,"colpossm":0},{"viewId":"7263189a-e423-4d61-8958-c45906f3cf76","colpos":2,"colposmd":1,"colpossm":2}]

#### Header (Logged In)

- **ID**: 5dd809f9-806b-4ce6-b13d-0d84e2e61d24
- **Type**: container

**Description:**
[{"viewId":"c365d763-bdcd-432d-8679-6b4fb1f080cb","colpos":2,"colposmd":10,"colpossm":8},{"viewId":"81159f18-4e60-4f9d-803a-bf15b998d8e6","colpos":7,"colposmd":1,"colpossm":2},{"viewId":"f20581b7-fddb-415e-b316-119aca84a747","colpos":1,"colposmd":0,"colpossm":0},{"viewId":"7263189a-e423-4d61-8958-c45906f3cf76","colpos":2,"colposmd":1,"colpossm":2}]

#### Header (Admin)

- **ID**: 2514b7f2-1592-464b-a34b-da5fdc79891b
- **Type**: container

**Description:**
[{"viewId":"c365d763-bdcd-432d-8679-6b4fb1f080cb","colpos":2,"colposmd":10,"colpossm":8},{"viewId":"f9683e41-4258-4965-9afe-66a28ddb41bb","colpos":7,"colposmd":1,"colpossm":2},{"viewId":"fafd7912-7222-4be5-b5d0-9fc986b9d101","colpos":1,"colposmd":0,"colpossm":0},{"viewId":"7263189a-e423-4d61-8958-c45906f3cf76","colpos":2,"colposmd":1,"colpossm":2}]

### Icon Bars

#### Header Icon Bar

- **ID**: 41d78db3-bd93-4cf6-8389-d5275b38914c
- **Type**: iconbar

**Description:**
[{"icon":"shopping-cart","text":"Cart","pageId":"shopping-cart"},{"icon":"mail","text":"Contact","pageId":"contact"}]

#### Header Icon Bar (Logged In)

- **ID**: f20581b7-fddb-415e-b316-119aca84a747
- **Type**: iconbar

**Description:**
[{"icon":"shopping-cart","text":"Cart","pageId":"shopping-cart"},{"icon":"mail","text":"Contact","pageId":"contact"}]

#### Header Icon Bar (Admin)

- **ID**: fafd7912-7222-4be5-b5d0-9fc986b9d101
- **Type**: iconbar

**Description:**
[{"icon":"shopping-cart","text":"Cart","pageId":"shopping-cart"},{"icon":"mail","text":"Contact","pageId":"contact"}]

### socialbar

#### Social Media Bar

- **ID**: 36d1f244-6664-4d7c-b713-d37c374d5f14
- **Type**: socialbar

**Description:**
{"bluesky":"","x":"","facebook":"","youtube":"","instagram":"","discord":"","tiktok":""}

### Text Sections

#### Copyright

- **ID**: 12253623-a33f-4c49-9506-b8ca4782779b
- **Type**: text

**Description:**
© 2025 Victorian Era. All rights reserved.

#### About Our Collection

- **ID**: welcome-text
- **Type**: text

**Description:**
<section style="width: 100%;">
    <div style="margin: 48px 0; padding: 40px; width: 100%; background-color: #fefbff;">
        <h1 style="font-size: 2.5rem; margin-bottom: 32px;">Victorian Era: Authentic Period Dress Craftsmanship</h1>
        
        <article style="margin-bottom: 48px;">
            <h2 style="font-size: 1.8rem; margin-bottom: 24px;">The Artistry of Victorian Fashion</h2>
            <p style="font-size: 18px; line-height: 1.8; margin-bottom: 24px;">At <strong>Victorian Era</strong>, we specialize in meticulously recreating the sartorial elegance of 19th-century British fashion. Our commitment to historical authenticity means each garment is a precise reflection of the era's intricate design principles, from the structured bodices of day dresses to the elaborate evening gowns that defined social hierarchy.</p>
        </article>

        <div style="padding: 32px; background-color: #f4f4f4; border-radius: 8px; margin-bottom: 48px;">
            <h2 style="font-size: 1.8rem; margin-bottom: 24px;">Craftsmanship Beyond Comparison</h2>
            <p style="font-size: 18px; line-height: 1.8;">Our skilled artisans employ traditional techniques passed down through generations, ensuring every stitch, seam, and embellishment meets the exacting standards of Victorian haute couture. We source period-authentic fabrics like fine silk, delicate muslin, and rich velvet, recreating the luxurious textures that made <strong>Victorian Era</strong> fashion truly extraordinary.</p>
        </div>
    </div>
</section>

#### Our Story

- **ID**: about-story
- **Type**: text

**Description:**
<section style="width: 100%;">
    <div style="width: 100%; margin: 48px 0; padding: 40px;">
        <h1 style="font-size: 2.5rem; margin-bottom: 32px;">Victorian Era: Preserving Historical Fashion</h1>
        
        <div style="background-color: #fefbff; padding: 40px; border-radius: 12px; margin-bottom: 48px;">
            <h2 style="font-size: 1.8rem; margin-bottom: 24px;">Our Authentic Commitment</h2>
            <p style="font-size: 18px; line-height: 1.8; margin-bottom: 24px;">Victorian Era represents the pinnacle of historical costume reproduction, meticulously crafting garments that honor the intricate details of 19th-century British fashion. Our dedicated team of researchers and artisans spend countless hours studying original textile archives, museum collections, and historical documents to ensure unparalleled authenticity in every stitch and seam.</p>
        </div>

        <div style="background-color: #fefbff; padding: 40px; border-radius: 12px; margin-bottom: 48px;">
            <h2 style="font-size: 1.8rem; margin-bottom: 24px;">Craftsmanship Beyond Compare</h2>
            <p style="font-size: 18px; line-height: 1.8; margin-bottom: 24px;">At Victorian Era, we source only the finest materials: hand-woven cotton from traditional British mills, silk from renowned European producers, and intricate lace crafted using 19th-century techniques. Our master tailors and seamstresses employ traditional construction methods, including hand-stitching, boning, and elaborate embellishment techniques that were standard during Queen Victoria's reign.</p>
        </div>

        <div style="background-color: #fefbff; padding: 40px; border-radius: 12px;">
            <h2 style="font-size: 1.8rem; margin-bottom: 24px;">Bringing History to Life</h2>
            <p style="font-size: 18px; line-height: 1.8;">More than a clothing store, Victorian Era is a portal to the past. We understand that each garment tells a story—from morning walking dresses to elaborate evening gowns. Our collection allows historians, performers, and fashion enthusiasts to experience the elegance and complexity of Victorian-era clothing with unprecedented accuracy and reverence.</p>
        </div>
    </div>
</section>

#### Our Expertise

- **ID**: about-expertise
- **Type**: text

**Description:**
<section style="width: 100%;">
    <div style="margin-top: 32px; margin-bottom: 48px; padding: 48px;">
        <h1>The Artistry of Victorian Era Fashion Expertise</h1>
        <p style="font-size: 18px; line-height: 1.6;">At <strong>Victorian Era</strong>, our passion for historical fashion transcends mere costume reproduction. We are dedicated scholars and artisans who specialize in meticulously reconstructing the intricate sartorial landscape of the British Victorian period, spanning from 1837 to 1901. Our team's expertise encompasses the nuanced evolution of fashion across distinct sub-periods, including the early Romantic era, the mid-century industrial transformation, and the elaborate late Victorian aesthetic.</p>
    </div>

    <div style="background-color: #fefbff; padding: 40px; margin-bottom: 48px; border-radius: 12px;">
        <h2>Precision in Historical Authenticity</h2>
        <p style="font-size: 16px; line-height: 1.7;">Our deep understanding extends beyond visual recreation. We comprehend the complex social stratification reflected in Victorian dress, where every stitch, fabric choice, and design element signified one's social standing. From the refined silk gowns of aristocratic ladies to the practical cotton dresses of working-class women, <strong>Victorian Era</strong> ensures absolute historical accuracy in construction techniques, material selection, and stylistic nuances.</p>
    </div>

    <div style="padding: 40px; margin-bottom: 48px;">
        <h2>Craftsmanship and Research</h2>
        <p style="font-size: 16px; line-height: 1.7;">Each garment we produce is the result of extensive archival research, consultation with textile historians, and a commitment to traditional manufacturing methods. We employ artisans skilled in period-specific techniques like hand-stitching, corsetry construction, and intricate embellishment work. Our dedication ensures that every piece from <strong>Victorian Era</strong> is not just a costume, but a living historical artifact.</p>
    </div>
</section>

#### Sizing Guide

- **ID**: sizing-info
- **Type**: text

**Description:**
<section style="width: 100%;">
    <div style="padding: 48px; width: 100%;">
        <h1 style="font-size: 2.5rem; margin-bottom: 32px;">Victorian Era Sizing Guide</h1>
        
        <div style="background-color: #fefbff; padding: 40px; border-radius: 12px; margin-bottom: 48px;">
            <h2 style="margin-bottom: 24px;">Understanding Victorian Period Dress Measurements</h2>
            <p style="line-height: 1.8; margin-bottom: 24px;">At Victorian Era, we recognize that historical clothing sizing differs dramatically from contemporary measurements. Our meticulous approach ensures an authentic and precise fit for every garment.</p>
        </div>

        <div style="background-color: #f4f4f4; padding: 40px; border-radius: 12px; margin-bottom: 48px;">
            <h2 style="margin-bottom: 24px;">Measurement Techniques</h2>
            <ul style="padding-left: 32px;">
                <li style="padding: 16px 0; line-height: 1.6;">Bust: Measure around fullest part of chest, keeping tape horizontal</li>
                <li style="padding: 16px 0; line-height: 1.6;">Waist: Measure at narrowest point, typically just above natural waistline</li>
                <li style="padding: 16px 0; line-height: 1.6;">Hips: Measure at widest part of lower body</li>
                <li style="padding: 16px 0; line-height: 1.6;">Dress Length: Measure from shoulder to desired hemline</li>
            </ul>
        </div>

        <div style="background-color: #9333ea; color: white; padding: 40px; border-radius: 12px; margin-bottom: 48px;">
            <h2 style="margin-bottom: 24px;">Victorian Era Size Conversion Chart</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: rgba(0,0,0,0.2);">
                        <th style="padding: 16px; text-align: left;">Victorian Size</th>
                        <th style="padding: 16px; text-align: left;">Modern US Size</th>
                        <th style="padding: 16px; text-align: left;">Bust (inches)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 16px;">2</td>
                        <td style="padding: 16px;">00-0</td>
                        <td style="padding: 16px;">32-33</td>
                    </tr>
                    <tr style="background-color: rgba(255,255,255,0.1);">
                        <td style="padding: 16px;">4</td>
                        <td style="padding: 16px;">2-4</td>
                        <td style="padding: 16px;">34-36</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px;">6</td>
                        <td style="padding: 16px;">6-8</td>
                        <td style="padding: 16px;">38-40</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background-color: #fefbff; padding: 40px; border-radius: 12px;">
            <h2 style="margin-bottom: 24px;">Custom Sizing</h2>
            <p style="line-height: 1.8;">Victorian Era offers bespoke sizing for clients requiring precise historical accuracy. Our artisan tailors can create custom-fitted garments matching exact Victorian-era proportions.</p>
        </div>
    </div>
</section>

#### Shipping Information

- **ID**: shipping-policy
- **Type**: text

**Description:**
<section style="width: 100%;">
    <div style="width: 100%; margin: 48px 0; padding: 40px;">
        <h1>Shipping & Returns Policy | Victorian Era</h1>
        <p style="font-size: 18px; line-height: 1.6; margin-bottom: 32px;">At Victorian Era, we understand the delicate nature of our meticulously crafted historical garments and are committed to ensuring their safe delivery and your complete satisfaction.</p>

        <div style="background-color: #f4f4f4; padding: 40px; border-radius: 8px; margin-bottom: 48px;">
            <h2>Shipping Options</h2>
            <table style="width: 100%; border-collapse: separate; border-spacing: 0 16px;">
                <thead>
                    <tr style="background-color: #9333ea; color: white;">
                        <th style="padding: 16px; text-align: left;">Shipping Type</th>
                        <th style="padding: 16px; text-align: left;">Estimated Delivery</th>
                        <th style="padding: 16px; text-align: left;">Cost</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 16px;">Domestic Standard</td>
                        <td style="padding: 16px;">5-7 Business Days</td>
                        <td style="padding: 16px;">$8.50</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px;">Domestic Express</td>
                        <td style="padding: 16px;">2-3 Business Days</td>
                        <td style="padding: 16px;">$15.00</td>
                    </tr>
                    <tr>
                        <td style="padding: 16px;">International Standard</td>
                        <td style="padding: 16px;">10-14 Business Days</td>
                        <td style="padding: 16px;">$25.00</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div style="background-color: #e6e6e6; padding: 40px; border-radius: 8px; margin-bottom: 48px;">
            <h2>Made-to-Order Processing</h2>
            <ul style="list-style-type: disc; padding-left: 32px;">
                <li style="padding: 16px 0;">Custom Victorian Era garments require <strong>4-6 weeks</strong> for precise crafting</li>
                <li style="padding: 16px 0;">Each piece is hand-tailored to exact measurements</li>
                <li style="padding: 16px 0;">Tracking information provided upon completion</li>
            </ul>
        </div>

        <div style="background-color: #f0f0f0; padding: 40px; border-radius: 8px; margin-bottom: 48px;">
            <h2>Returns & Exchanges</h2>
            <dl>
                <dt style="font-weight: bold; margin-bottom: 16px;">Return Window</dt>
                <dd style="margin-bottom: 24px;">14 days from delivery date</dd>

                <dt style="font-weight: bold; margin-bottom: 16px;">Conditions</dt>
                <dd style="margin-bottom: 24px;">
                    <ul style="list-style-type: circle; padding-left: 32px;">
                        <li style="padding: 16px 0;">Garments must be unworn and in original condition</li>
                        <li style="padding: 16px 0;">Original packaging and tags must be intact</li>
                        <li style="padding: 16px 0;">Custom orders are non-returnable</li>
                    </ul>
                </dd>
            </dl>
        </div>
    </div>
</section>

#### Garment Care

- **ID**: care-guide
- **Type**: text

**Description:**
<section style="width: 100%;">
    <div style="width: 100%; margin: 48px 0; padding: 40px;">
        <h1 style="font-size: 2.5rem; margin-bottom: 32px;">Victorian Era Garment Care Guide</h1>
        
        <div style="background-color: #f4f1fc; padding: 48px; border-radius: 12px; margin-bottom: 48px;">
            <h2 style="margin-bottom: 24px;">Preservation of Historical Costumes</h2>
            <p style="line-height: 1.8; font-size: 18px;">At Victorian Era, we understand the delicate nature of historical garments and offer comprehensive care instructions to help preserve these exquisite pieces of textile heritage.</p>
        </div>

        <div style="width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 48px;">
            <div style="background-color: #e6d9f5; padding: 40px; border-radius: 8px;">
                <h3 style="margin-bottom: 24px;">Fabric Cleaning Techniques</h3>
                <ul style="padding-left: 24px;">
                    <li style="padding: 16px 0; line-height: 1.6;">Silk: Dry clean only, never machine wash</li>
                    <li style="padding: 16px 0; line-height: 1.6;">Wool: Gentle hand wash with specialized detergent</li>
                    <li style="padding: 16px 0; line-height: 1.6;">Cotton: Mild temperature, low agitation washing</li>
                </ul>
            </div>

            <div style="background-color: #e6d9f5; padding: 40px; border-radius: 8px;">
                <h3 style="margin-bottom: 24px;">Storage Recommendations</h3>
                <ol style="padding-left: 24px;">
                    <li style="padding: 16px 0; line-height: 1.6;">Use acid-free tissue paper</li>
                    <li style="padding: 16px 0; line-height: 1.6;">Store in climate-controlled environments</li>
                    <li style="padding: 16px 0; line-height: 1.6;">Avoid direct sunlight and humidity</li>
                </ol>
            </div>
        </div>

        <div style="background-color: #f4f1fc; padding: 48px; border-radius: 12px; margin-bottom: 48px;">
            <h2>Delicate Embellishment Care</h2>
            <p style="line-height: 1.8; font-size: 18px;">Victorian Era costumes often feature intricate trims and decorative elements requiring specialized handling. Use soft brushes and avoid direct contact with metal cleaning implements.</p>
        </div>
    </div>
</section>

#### Terms of Service

- **ID**: 19eb1636-7ff6-4a01-bd66-acf0bcd56154
- **Type**: text

**Description:**
Sitepaige is not a licensed attorney and cannot write legal terms and conditions. Put your terms and conditions here.

#### Privacy Policy

- **ID**: 28d6009d-cd52-4844-87ba-c32ffbfbbc3c
- **Type**: text

**Description:**
Sitepaige is not a licensed attorney and cannot write privacy policies. Put your privacy policy here.

### Integration Sections

#### Analytics

- **ID**: b14deb22-9c7a-4ac5-8747-ba2aac2ca9d8
- **Type**: integration

**Description:**
// REQUIRED_SECRETS: NEXT_PUBLIC_GA_MEASUREMENT_ID

/**
 * Google Analytics 4 Integration for Victorian Era
 * Browser-compatible analytics tracking with enhanced event tracking
 */

(function() {
  'use strict';

  // Get the Google Analytics Measurement ID
  const measurementId = window.getKey('NEXT_PUBLIC_GA_MEASUREMENT_ID');
  
  if (!measurementId) {
    console.error('[GA4] Google Analytics Measurement ID not configured. Please set NEXT_PUBLIC_GA_MEASUREMENT_ID in your environment.');
    return;
  }

  // Validate measurement ID format (should be G-XXXXXXXXXX)
  if (!measurementId.match(/^G-[A-Z0-9]+$/)) {
    console.error('[GA4] Invalid Google Analytics Measurement ID format. Expected format: G-XXXXXXXXXX');
    return;
  }

  // Prevent duplicate initialization
  if (window.gtag && window.gaInitialized) {
    console.warn('[GA4] Google Analytics already initialized');
    return;
  }

  console.log('[GA4] Initializing Google Analytics 4 with ID:', measurementId);

  // Load the Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  script.onerror = function() {
    console.error('[GA4] Failed to load Google Analytics script');
  };
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  // Set initialization timestamp
  gtag('js', new Date());

  // Configure Google Analytics with enhanced settings
  gtag('config', measurementId, {
    'send_page_view': true,
    'anonymize_ip': true, // Privacy-friendly IP anonymization
    'allow_google_signals': true, // Enable cross-device tracking
    'allow_ad_personalization_signals': false // Privacy-first approach
  });

  // Mark as initialized
  window.gaInitialized = true;

  // Enhanced page view tracking for SPA navigation
  let lastPath = window.location.pathname;
  
  function trackPageView() {
    const currentPath = window.location.pathname;
    if (currentPath !== lastPath) {
      lastPath = currentPath;
      gtag('event', 'page_view', {
        page_path: currentPath,
        page_title: document.title,
        page_location: window.location.href
      });
      console.log('[GA4] Page view tracked:', currentPath);
    }
  }

  // Listen for navigation changes (for SPA routing)
  window.addEventListener('popstate', trackPageView);
  
  // Also track pushState and replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(this, arguments);
    trackPageView();
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    trackPageView();
  };

  // Track outbound link clicks
  document.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    // Check if it's an outbound link
    const isOutbound = href.startsWith('http') && !href.includes(window.location.hostname);
    
    if (isOutbound) {
      gtag('event', 'click', {
        'event_category': 'outbound',
        'event_label': href,
        'transport_type': 'beacon'
      });
      console.log('[GA4] Outbound link tracked:', href);
    }
  });

  // Track file downloads (PDF, ZIP, DOC, etc.)
  document.addEventListener('click', function(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    if (!href) return;
    
    const downloadExtensions = /\.(pdf|zip|doc|docx|xls|xlsx|ppt|pptx|txt|csv|jpg|jpeg|png|gif|mp3|mp4|avi|mov)$/i;
    
    if (downloadExtensions.test(href)) {
      const fileName = href.split('/').pop();
      gtag('event', 'file_download', {
        'event_category': 'download',
        'event_label': fileName,
        'file_extension': fileName.split('.').pop()
      });
      console.log('[GA4] File download tracked:', fileName);
    }
  });

  // Track scroll depth
  let scrollDepths = [25, 50, 75, 100];
  let trackedDepths = new Set();
  
  function trackScrollDepth() {
    const scrollPercentage = Math.round(
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );
    
    scrollDepths.forEach(function(depth) {
      if (scrollPercentage >= depth && !trackedDepths.has(depth)) {
        trackedDepths.add(depth);
        gtag('event', 'scroll', {
          'event_category': 'engagement',
          'event_label': depth + '%',
          'value': depth
        });
        console.log('[GA4] Scroll depth tracked:', depth + '%');
      }
    });
  }
  
  let scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(trackScrollDepth, 150);
  });

  // Track form submissions
  document.addEventListener('submit', function(event) {
    const form = event.target;
    const formId = form.id || form.name || 'unnamed_form';
    
    gtag('event', 'form_submit', {
      'event_category': 'form',
      'event_label': formId
    });
    console.log('[GA4] Form submission tracked:', formId);
  });

  // Track engagement time
  let engagementStartTime = Date.now();
  let isEngaged = true;
  
  function trackEngagementTime() {
    if (!isEngaged) return;
    
    const engagementTime = Math.round((Date.now() - engagementStartTime) / 1000);
    
    if (engagementTime > 0 && engagementTime % 30 === 0) { // Every 30 seconds
      gtag('event', 'user_engagement', {
        'engagement_time_msec': engagementTime * 1000
      });
    }
  }
  
  setInterval(trackEngagementTime, 30000); // Check every 30 seconds
  
  // Pause engagement tracking when page is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      isEngaged = false;
    } else {
      isEngaged = true;
      engagementStartTime = Date.now();
    }
  });

  // Track 404 errors (if page title or body contains "404")
  if (document.title.includes('404') || document.body.textContent.includes('404')) {
    gtag('event', 'exception', {
      'description': 'Page not found: ' + window.location.pathname,
      'fatal': false
    });
    console.log('[GA4] 404 error tracked:', window.location.pathname);
  }

  // Expose a helper function for custom event tracking
  window.trackEvent = function(eventName, eventParams) {
    if (!window.gtag) {
      console.error('[GA4] Google Analytics not initialized');
      return;
    }
    
    gtag('event', eventName, eventParams || {});
    console.log('[GA4] Custom event tracked:', eventName, eventParams);
  };

  // Track JavaScript errors
  window.addEventListener('error', function(event) {
    gtag('event', 'exception', {
      'description': event.message,
      'fatal': false,
      'error_location': event.filename + ':' + event.lineno
    });
    console.log('[GA4] JavaScript error tracked:', event.message);
  });

  // Track unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    gtag('event', 'exception', {
      'description': 'Unhandled Promise Rejection: ' + event.reason,
      'fatal': false
    });
    console.log('[GA4] Promise rejection tracked:', event.reason);
  });

  console.log('[GA4] Google Analytics 4 integration completed successfully');
  console.log('[GA4] Available custom tracking: window.trackEvent(eventName, eventParams)');
  console.log('[GA4] Automatic tracking enabled for: page views, outbound links, downloads, scroll depth, forms, engagement time, and errors');

})();

### Logged In Menus

#### DashboardMenuView

- **ID**: 17808484-6d04-47d7-a2e6-ca8ca081034a
- **Type**: loggedinmenu

### User Admin

#### UserAdminView

- **ID**: 2754d7c6-e165-4c03-88f0-ff8470db7cfe
- **Type**: useradmin

### Admin Menus

#### AdminMenuView

- **ID**: e611ef95-2db7-454d-9b26-10e19f87833c
- **Type**: adminmenu

### Code Sections

#### Featured Collections

- **ID**: featured-collections
- **Type**: component
- **Consumes APIs**:
  - GET /api/CategoriesList (Auth Required)
  - GET /api/FeaturedProductsGet (Auth Required)

#### Collection Categories

- **ID**: collection-browser
- **Type**: component
- **Consumes APIs**:
  - GET /api/CategoriesList (Auth Required)

#### Product Listing

- **ID**: product-grid
- **Type**: component
- **Consumes APIs**:
  - GET /api/ProductsList (Auth Required)
  - GET /api/ProductsByCategoryGet (Auth Required)
  - GET /api/ProductsSearch (Auth Required)

#### Product Details

- **ID**: product-showcase
- **Type**: component
- **Consumes APIs**:
  - GET /api/ProductsGet (Auth Required)
  - GET /api/ProductImagesList (Auth Required)

#### Shopping Cart

- **ID**: cart-contents
- **Type**: component

#### Checkout Form

- **ID**: checkout-process
- **Type**: component
- **Consumes APIs**:
  - POST /api/OrdersCreate (Auth Required)
  - GET /api/ShippingAddressesList (Auth Required)

#### Processing Payment

- **ID**: payment-processing
- **Type**: component

#### Order Confirmation

- **ID**: confirmation-details
- **Type**: component
- **Consumes APIs**:
  - GET /api/OrdersGet (Auth Required)

#### Order History

- **ID**: order-list
- **Type**: component
- **Consumes APIs**:
  - GET /api/OrdersList (Auth Required)

#### Order Details

- **ID**: order-detail-view
- **Type**: component
- **Consumes APIs**:
  - GET /api/OrdersGet (Auth Required)
  - GET /api/OrderItemsList (Auth Required)

#### Inventory Manager

- **ID**: inventory-management
- **Type**: component
- **Consumes APIs**:
  - GET /api/ProductsList (Auth Required)
  - POST /api/ProductsCreate (Auth Required)
  - PUT /api/ProductsUpdate (Auth Required)
  - DELETE /api/ProductsDelete (Auth Required)
  - GET /api/ProductImagesList (Auth Required)
  - POST /api/ProductImagesCreate (Auth Required)
  - PUT /api/ProductImagesUpdate (Auth Required)
  - DELETE /api/ProductImagesDelete (Auth Required)
  - GET /api/CategoriesList (Auth Required)
  - GET /api/InventoryStatusGet (Auth Required)

#### Order Manager

- **ID**: order-management
- **Type**: component
- **Consumes APIs**:
  - GET /api/OrdersList (Auth Required)
  - GET /api/OrdersGet (Auth Required)
  - PUT /api/OrdersUpdate (Auth Required)
  - GET /api/OrderItemsList (Auth Required)
  - GET /api/OrderSummaryGet (Auth Required)

#### Customer Manager

- **ID**: customer-management
- **Type**: component
- **Consumes APIs**:
  - GET /api/OrdersList (Auth Required)
  - GET /api/ContactMessagesList (Auth Required)
  - GET /api/ContactMessagesGet (Auth Required)
  - PUT /api/ContactMessagesUpdate (Auth Required)

### Image Sections

#### Historical Workshop

- **ID**: about-image
- **Type**: image

**Description:**
/images/d610a8fb-e8d1-4904-a405-b2e8e6d55f33.jpg

### form

#### Contact Form

- **ID**: contact-form
- **Type**: form
- **Consumes APIs**:
  - POST /api/ContactMessagesCreate (Auth Required)

**Description:**
{"submissionEmail":"contact@example.com","useCaptcha":true,"fields":[{"id":"name","name":"name","label":"Your Name","type":"text","required":true,"placeholder":"Lady Catherine Smith"},{"id":"email","name":"email","label":"Email Address","type":"text","required":true,"placeholder":"catherine@example.com"},{"id":"subject","name":"subject","label":"Subject","type":"dropdown","required":true,"options":["General Inquiry","Custom Order","Sizing Question","Shipping Information","Returns & Exchanges","Other"]},{"id":"message","name":"message","label":"Message","type":"textarea","required":true,"placeholder":"Please share your questions or custom requirements..."}]}

### slideshow

#### Hero Slideshow

- **ID**: 959855f2-f08d-4505-a535-89b0b35de20d
- **Type**: slideshow

**Description:**
["da695a59-ae9b-450e-8d82-185028d749be","4898ba9b-505b-41bc-be1a-36320732b2b7","87905880-e325-46ea-9c6b-27c186b128fa"]

### Login Components

#### LoginView

- **ID**: 4a6d4878-c576-4308-9984-d91d44681a08
- **Type**: login

## Data Flow

### API to View Mapping

- **GET /api/CategoriesList** is used by:
  - Featured Collections
  - Collection Categories
  - Inventory Manager

- **GET /api/ProductsList** is used by:
  - Product Listing
  - Inventory Manager

- **GET /api/ProductsGet** is used by:
  - Product Details

- **POST /api/ProductsCreate** is used by:
  - Inventory Manager

- **PUT /api/ProductsUpdate** is used by:
  - Inventory Manager

- **DELETE /api/ProductsDelete** is used by:
  - Inventory Manager

- **GET /api/ProductImagesList** is used by:
  - Product Details
  - Inventory Manager

- **POST /api/ProductImagesCreate** is used by:
  - Inventory Manager

- **PUT /api/ProductImagesUpdate** is used by:
  - Inventory Manager

- **DELETE /api/ProductImagesDelete** is used by:
  - Inventory Manager

- **GET /api/OrdersList** is used by:
  - Order History
  - Order Manager
  - Customer Manager

- **GET /api/OrdersGet** is used by:
  - Order Confirmation
  - Order Details
  - Order Manager

- **POST /api/OrdersCreate** is used by:
  - Checkout Form

- **PUT /api/OrdersUpdate** is used by:
  - Order Manager

- **GET /api/OrderItemsList** is used by:
  - Order Details
  - Order Manager

- **GET /api/ContactMessagesList** is used by:
  - Customer Manager

- **GET /api/ContactMessagesGet** is used by:
  - Customer Manager

- **POST /api/ContactMessagesCreate** is used by:
  - Contact Form

- **PUT /api/ContactMessagesUpdate** is used by:
  - Customer Manager

- **GET /api/ShippingAddressesList** is used by:
  - Checkout Form

- **GET /api/FeaturedProductsGet** is used by:
  - Featured Collections

- **GET /api/ProductsByCategoryGet** is used by:
  - Product Listing

- **GET /api/ProductsSearch** is used by:
  - Product Listing

- **GET /api/OrderSummaryGet** is used by:
  - Order Manager

- **GET /api/InventoryStatusGet** is used by:
  - Inventory Manager

### Unused APIs

- GET /api/CategoriesGet
- POST /api/CategoriesCreate
- PUT /api/CategoriesUpdate
- DELETE /api/CategoriesDelete
- GET /api/ProductImagesGet
- DELETE /api/OrdersDelete
- GET /api/OrderItemsGet
- POST /api/OrderItemsCreate
- PUT /api/OrderItemsUpdate
- DELETE /api/OrderItemsDelete
- DELETE /api/ContactMessagesDelete
- GET /api/ShippingAddressesGet
- POST /api/ShippingAddressesCreate
- PUT /api/ShippingAddressesUpdate
- DELETE /api/ShippingAddressesDelete

### Pages

| Page Name | Access Level | User Tier | Description |
|-----------|--------------|-----------|-------------|
| Dashboard | registereduser | all | User dashboard page |
| Admin Dashboard | admin | all | Admin dashboard page |
| Home (Home) | everyone | all | Welcome page showcasing Victorian era fashion collections |
| Collections | everyone | all | Browse Victorian dress collections by type |
| Shop | everyone | all | Browse products from selected collection |
| Item Detail | everyone | all | Detailed view of a specific Victorian dress |
| Cart | everyone | all | Review items before checkout |
| Checkout | everyone | all | Complete purchase with shipping and payment |
| Payment | everyone | all | Payment processor callback handler |
| Confirmed | everyone | all | Order confirmation and details |
| Orders | registereduser | all | View past orders and status |
| Order Info | registereduser | all | Detailed view of specific order |
| About | everyone | all | Learn about our Victorian dress expertise |
| Contact | everyone | all | Get in touch with questions |
| Sizing | everyone | all | Victorian dress sizing information |
| Shipping | everyone | all | Shipping and returns information |
| Care Guide | everyone | all | How to care for Victorian garments |
| Inventory | admin | all | Manage product catalog and stock |
| Order Mgmt | admin | all | Manage customer orders and fulfillment |
| Customers | admin | all | Manage customer accounts and data |
| Terms of Service | everyone | all | Legal terms and conditions for using the application |
| Privacy Policy | everyone | all | Details about how user data is collected and handled |
| Login | everyone | all | User login page |
