# VastraDrobe

## Enterprise Fashion E-Commerce Platform

VastraDrobe is a modern fashion e-commerce platform built using Next.js, TypeScript, MongoDB, and a dedicated Inventory Management System (IMS). The platform provides a seamless shopping experience while maintaining complete control over products, inventory, orders, warehouses, customers, and analytics.

---

# Table of Contents

1. Project Overview
2. Technology Stack
3. System Architecture
4. Folder Structure
5. Application Flow
6. Authentication Flow
7. Product Flow
8. Inventory Flow
9. Order Flow
10. Application Routes
11. API Architecture
12. IMS Architecture
13. Database Design
14. Global State Management
15. Middleware
16. Components
17. SEO Strategy
18. Performance Optimizations
19. Meta Pixel Integration
20. Deployment Guide
21. Environment Variables
22. Development Workflow
23. Future Roadmap

---

# Project Overview

## Objective

To build a scalable fashion commerce ecosystem that integrates:

* Product Management
* Inventory Tracking
* Warehouse Management
* Customer Accounts
* Order Processing
* Wishlist Management
* Search System
* Marketing Analytics

---

# Technology Stack

## Frontend

* Next.js App Router
* React
* TypeScript
* Tailwind CSS
* Context API
* Axios

## Backend

* Next.js API Routes
* JWT Authentication
* REST APIs

## Database

* MongoDB Atlas
* Mongoose ODM

## Hosting

* Vercel
* GoDaddy Domain

## Analytics

* Meta Pixel
* Facebook Conversion API

---

# System Architecture

Customer
↓
Frontend (Next.js)
↓
API Routes
↓
MongoDB Atlas
↓
Inventory Management System

---

# Folder Structure

```bash
VastraDrobe/
│
├── app/
│   ├── page.tsx
│   ├── layout.tsx
│   ├── search/
│   ├── cart/
│   ├── checkout/
│   ├── favorites/
│   ├── profile/
│   ├── account/
│   ├── [category]/
│   └── api/
│
├── components/
│   ├── Global/
│   ├── Home/
│   ├── Products/
│   ├── Checkout/
│   ├── Navbar/
│   └── Footer/
│
├── hooks/
│
├── context/
│
├── lib/
│
├── Types/
│
├── public/
│
├── middleware.ts
│
└── next.config.ts
```

---

# Application Flow

Home Page
↓
Category Selection
↓
Product Listing
↓
Product Detail Page
↓
Add To Cart
↓
Checkout
↓
Order Creation
↓
Payment
↓
Order Success

---

# Authentication Flow

Register
↓
Validate User
↓
Create Account
↓
Generate JWT
↓
Store Cookie
↓
Protected Access

Protected Routes:

* Cart
* Checkout
* Favorites
* Profile
* Orders

---

# Product Flow

IMS Product Creation
↓
MongoDB Storage
↓
Product API
↓
Frontend Fetch
↓
Category Pages
↓
Product Detail Page

---

# Inventory Flow

Warehouse
↓
Inventory Entry
↓
Stock Assignment
↓
Customer Purchase
↓
Stock Deduction
↓
Inventory Update

---

# Order Flow

Customer Places Order
↓
Order Validation
↓
Inventory Verification
↓
Payment Verification
↓
Order Creation
↓
Stock Reduction
↓
Shipment Processing

---

# Application Routes

## Public Routes

| Route             | Description      |
| ----------------- | ---------------- |
| /                 | Home Page        |
| /search           | Product Search   |
| /[category]       | Category Listing |
| /product/[slug]   | Product Details  |
| /account/login    | Login            |
| /account/register | Register         |
| /about-us         | About Us         |
| /contact-us       | Contact Us       |

---

## Customer Routes

| Route        | Description        |
| ------------ | ------------------ |
| /cart        | Shopping Cart      |
| /checkout    | Checkout           |
| /favorites   | Wishlist           |
| /profile     | User Profile       |
| /orders      | Order History      |
| /orders/[id] | Order Details      |
| /addresses   | Address Management |

---

# API Architecture

## Authentication

/api/auth/register

/api/auth/login

/api/auth/logout

/api/auth/me

### Tasks

* User Registration
* Login Validation
* JWT Generation
* Session Validation

---

## Products

/api/products

/api/products/[id]

/api/products/search

/api/products/latest

/api/products/category/[category]

### Tasks

* Product Listing
* Product Search
* Product Filtering
* Product Recommendations

---

## Cart

/api/cart

/api/cart/add

/api/cart/update

/api/cart/remove

### Tasks

* Add Product
* Update Quantity
* Remove Product
* Cart Synchronization

---

## Favorites

/api/favorites

/api/favorites/add

/api/favorites/remove

### Tasks

* Wishlist Management
* Favorites Synchronization

---

## Checkout

/api/checkout

/api/checkout/validate

### Tasks

* Checkout Validation
* Inventory Verification
* Pricing Validation

---

## Orders

/api/orders

/api/orders/create

/api/orders/[id]

### Tasks

* Create Order
* Fetch Orders
* Track Orders

---

## Addresses

/api/addresses

/api/addresses/add

/api/addresses/update

/api/addresses/delete

### Tasks

* Address Management

---

# IMS Architecture

## Dashboard

Responsibilities:

* Business Analytics
* Revenue Monitoring
* Inventory Statistics
* Order Statistics

---

## Product Management

Responsibilities:

* Create Products
* Edit Products
* Delete Products
* Manage Variants
* Upload Images

APIs:

/api/ims/products

/api/ims/products/create

/api/ims/products/update/[id]

/api/ims/products/delete/[id]

---

## Inventory Management

Responsibilities:

* Track Inventory
* Stock Updates
* Low Stock Monitoring
* Stock Transfers

APIs:

/api/ims/inventory

/api/ims/inventory/update

/api/ims/inventory/movement

---

## Warehouse Management

Responsibilities:

* Create Warehouses
* Assign Inventory
* Manage Locations

APIs:

/api/ims/warehouses

/api/ims/warehouses/create

/api/ims/warehouses/update

---

## Order Management

Responsibilities:

* Process Orders
* Manage Returns
* Update Status

APIs:

/api/ims/orders

/api/ims/orders/update-status

---

## User Management

Responsibilities:

* Admin Accounts
* Roles & Permissions
* Access Control

APIs:

/api/ims/users

/api/ims/users/create

---

# Database Design

## Product

* productId
* name
* description
* category
* subCategory
* gender
* basePrice
* salePrice
* images
* variants
* stock
* createdAt

## User

* userId
* name
* email
* password
* addresses
* wishlist

## Order

* orderId
* userId
* products
* totalAmount
* status

## Inventory

* warehouseId
* productId
* variant
* stock

---

# Global State Management

App Context Stores:

* searchQuery
* selectedGender
* products
* cartItems
* cartCount
* user
* authLoading

---

# Middleware

Protected Routes:

/cart

/checkout

/profile

/favorites

/orders

Responsibilities:

* JWT Verification
* Authentication Validation
* Route Protection

---

# Major Components

## Home

* Slider
* CategoryBar
* ParentSubCategoryBar
* LatestArrivals
* HorizontalScroll
* PixelCard

## Product

* ProductCard
* ProductQuickView
* ProductPDPClient
* SimilarProducts

## Checkout

* CartPage
* CheckoutPage
* AddressSelector

## Account

* LoginForm
* RegisterForm
* ProfilePage

---

# SEO Strategy

Implemented Features:

* Dynamic Metadata
* Open Graph
* Sitemap
* Robots.txt
* Structured URLs
* Server Components

Example URLs:

/men

/women

/kids

/product/cotton-shirt

---

# Performance Optimizations

* Next/Image
* Lazy Loading
* Dynamic Imports
* Code Splitting
* API Optimization
* Server Components

---

# Meta Pixel Integration

Events:

PageView

ViewContent

AddToCart

InitiateCheckout

Purchase

Customer Journey:

Visit Product
↓
Add To Cart
↓
Checkout
↓
Purchase
↓
Meta Conversion Event

---

# Deployment Guide

Development:

npm install

npm run dev

Production:

npm run build

npm start

Deployment Platform:

* Vercel

Domain Provider:

* GoDaddy

---

# Environment Variables

MONGODB_URI=

JWT_SECRET=

NEXT_PUBLIC_BASE_URL=

NEXT_PUBLIC_IMS_BASE_URL=

NEXT_PUBLIC_META_PIXEL_ID=

FACEBOOK_ACCESS_TOKEN=

FACEBOOK_PIXEL_ID=

---

# Development Workflow

Design Product
↓
Create Product In IMS
↓
Store In MongoDB
↓
Expose Through API
↓
Frontend Consumption
↓
Customer Purchase
↓
Inventory Synchronization

---

# Future Roadmap

## Phase 1

* Order Tracking
* Reviews & Ratings
* Coupon System

## Phase 2

* Loyalty Program
* Personalized Recommendations
* Enhanced Search

## Phase 3

* Mobile Application
* Multi-Vendor Marketplace
* International Shipping

## Phase 4

* AI Recommendations
* Advanced Analytics
* Inventory Forecasting

---

# Brand Identity

Primary Color

#889551

Secondary Color

#e4e198

Background Color

#f4f2dd

---

# Developed By

Ritanshu Babuta

Associate Full Stack Developer

Ads247365 India Pvt. Ltd.

---

# Vision

VastraDrobe aims to become a scalable and intelligent fashion commerce ecosystem by combining modern e-commerce experiences with enterprise-grade inventory management and operational control.
