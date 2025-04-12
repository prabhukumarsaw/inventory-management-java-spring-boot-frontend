# 📦 Inventory Management System (Java + Spring Boot + PostGreSQL + Next.js 15)

A full-stack Inventory Management System built using **Java Spring Boot** (backend), **PostGreSQL**, and **Next.js 15** (frontend). Manage products, stock, and orders with a clean UI and scalable backend.

---

## 🧠 System Design Overview

### 🏗️ Architecture
- **Backend**: Java Spring Boot (Monolithic REST API)
- **Frontend**: Next.js 15 (App Router with React 18)
- **Database**: PostGreSQL
- **ORM**: Spring Data JPA (Hibernate)
- **API Communication**: RESTful (Axios / Fetch)

---

## 📊 Core Modules

### Backend (Spring Boot)
- **Product**: Add, update, delete, list
- **Inventory**: Add stock, view quantity available
- **Orders**: Create orders with nested order items
- **Order Items**: Associated with products and orders

### Frontend (Next.js 15)
- Dashboard with product list
- Add / Edit / Delete product and inventory
- Create orders with multiple items
- Invoice preview & print (coming soon)

---

## 🚀 Getting Started

### ✅ Prerequisites
- Java 17+
- Maven
- Node.js 18+
- MySQL 8+
- Postman (for API testing)

---

## ⚙️ Backend Setup (Spring Boot)

### 1. Clone Backend
```bash
git clone https://github.com/yourusername/inventory-management-system.git
cd inventory-management-system/backend
