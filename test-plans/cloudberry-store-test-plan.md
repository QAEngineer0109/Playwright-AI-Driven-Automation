# Cloudberry Store Test Plan

## Application Overview

Comprehensive test plan for Cloudberry Store e-commerce platform built on OpenCart. Covers product browsing, search, cart management, account functionality, and complete user workflows.

## Test Scenarios

### 1. Home and Navigation

**Seed:** `tests/seed.spec.ts`

#### 1.1. Load Home Page

**File:** `tests/home.spec.ts`

**Steps:**
  1. -
    - expect: Page loads successfully
  2. -
    - expect: Logo visible
  3. -
    - expect: Navigation menu shows 8 product categories
  4. -
    - expect: Search box in header
  5. -
    - expect: Shopping cart counter shows 0 items

### 2. Product Browsing

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse Category

**File:** `tests/categories.spec.ts`

**Steps:**
  1. -
    - expect: Click Laptops & Notebooks
  2. -
    - expect: Category page loads
  3. -
    - expect: Products list displays
  4. -
    - expect: Sort and pagination options available

#### 2.2. View Product Details

**File:** `tests/product-details.spec.ts`

**Steps:**
  1. -
    - expect: Click on MacBook product
  2. -
    - expect: Product page loads
  3. -
    - expect: Images and thumbnails visible
  4. -
    - expect: Price and availability shown
  5. -
    - expect: Add to Cart button present

#### 2.3. Sort Products

**File:** `tests/sort-products.spec.ts`

**Steps:**
  1. -
    - expect: Navigate to category
  2. -
    - expect: Select Price Low > High
  3. -
    - expect: Products sort by price ascending

#### 2.4. Search Products

**File:** `tests/search.spec.ts`

**Steps:**
  1. -
    - expect: Enter MacBook in search
  2. -
    - expect: Click search
  3. -
    - expect: Results show MacBook products

### 3. Shopping Cart

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add to Cart

**File:** `tests/add-cart.spec.ts`

**Steps:**
  1. -
    - expect: Go to product
  2. -
    - expect: Set quantity
  3. -
    - expect: Click Add to Cart
  4. -
    - expect: Cart counter updates

#### 3.2. View Cart

**File:** `tests/view-cart.spec.ts`

**Steps:**
  1. -
    - expect: Navigate to cart
  2. -
    - expect: Items displayed
  3. -
    - expect: Totals calculated

#### 3.3. Remove from Cart

**File:** `tests/remove-cart.spec.ts`

**Steps:**
  1. -
    - expect: Add product to cart
  2. -
    - expect: Go to cart
  3. -
    - expect: Click remove
  4. -
    - expect: Product removed

### 4. User Account

**Seed:** `tests/seed.spec.ts`

#### 4.1. Account Page

**File:** `tests/account.spec.ts`

**Steps:**
  1. -
    - expect: Navigate to My Account
  2. -
    - expect: Login section visible
  3. -
    - expect: Register section visible
  4. -
    - expect: Sidebar with account links

#### 4.2. Wish List

**File:** `tests/wishlist.spec.ts`

**Steps:**
  1. -
    - expect: Add product to wishlist
  2. -
    - expect: Go to Wish List page
  3. -
    - expect: Product appears in wishlist

### 5. User Workflows

**Seed:** `tests/seed.spec.ts`

#### 5.1. Complete Shopping Flow

**File:** `tests/shopping-flow.spec.ts`

**Steps:**
  1. -
    - expect: Start at home
  2. -
    - expect: Browse laptops
  3. -
    - expect: Add MacBook to cart
  4. -
    - expect: Browse cameras
  5. -
    - expect: Add camera to cart
  6. -
    - expect: View cart
  7. -
    - expect: Verify quantities and totals
  8. -
    - expect: Both products in cart
