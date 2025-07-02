# 🥑 Avocado E-shop Project

> Modern, scalable, and responsive avocado-themed e-commerce platform built with Next.js, TypeScript, Node.js, Express, PostgreSQL (Neon), and MUI.

## 📝 Table of Contents
- [About](#about)
- [Features](#features)
- [Technologies](#technologies)
- [Folder Structure](#folder-structure)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Guided By](#guided-by)

---

## 📖 About

Avocado is a full-stack e-commerce platform designed for a seamless shopping experience. It supports customer interactions, order management, real-time chat, and an intuitive admin panel for store management.

---

## ✨ Features

### Customer
- Product browsing and search
- Product categories
- Favorites list
- Shopping cart
- User profile and order history
- Real-time customer support chat

### Admin
- Dashboard with KPIs
- Product and category management
- Order management
- User management
- Real-time chat with users
- Sales and orders analytics (charts)

### Authentication & Security
- JWT-based secure authentication
- Role-based access control

### Design & UI
- Responsive design (mobile and desktop)
- Interactive UI elements with Framer Motion
- MUI (Material UI and Joy UI)

---

## 🛠 Technologies

### Frontend
- Next.js
- React
- TypeScript
- Material UI (MUI)
- Joy UI
- Axios
- Framer Motion
- Recharts
- Socket.IO client
- React Slick (Carousel)
- Leaflet & React Leaflet

### Backend
- Node.js
- Express.js
- PostgreSQL (Neon)
- JWT
- Socket.IO (real-time chat)

### Tools
- Visual Studio Code
- Git & GitHub

---

## 📁 Folder Structure

```bash
/backend
  ├── controllers
  ├── models
  ├── routes
  ├── middleware
  ├── types

/frontend
  ├── app
  │    ├── aboutUs
  │    ├── admin
  │    ├── cart
  │    ├── category
  │    ├── contactUs
  │    ├── delivery
  │    ├── FavoriteProducts
  │    ├── home
  │    ├── orders
  │    ├── productDetails
  │    ├── products
  │    ├── profile
  │    ├── reset-password
  │    └── search
  ├── components
  ├── globals.css
  ├── layout.tsx
  ├── head.tsx
  ├── favicon.ico
  └── page.tsx
```


## 📸 Screenshots

| Page                  | Screenshot                      |
|-----------------------|---------------------------------|
| Home Page             | ![Home](![alt text](image.png))                      |
| Profile Page          | ![Profile](![alt text](image-1.png))                   |
| Admin Dashboard       | ![Dashboard](![alt text](image-2.png))                 |
| Product           | ![Carousel](#)                  |
| Responsive Sidebar    | ![Sidebar](#)                   |
| Footer                | ![Footer](![alt text](image-3.png))                    |



---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en)
- [PostgreSQL (Neon)](https://neon.tech)
- [Git](https://git-scm.com)

### Installation

Clone the repository:

```bash
git https://github.com/MohmadZiad/MERAKI_Academy_Project_5_Ali.git
```

Install dependencies:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

Configure environment variables:
- `.env` file for backend (Database URL, JWT secret)

Run servers:

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

Open frontend at `http://localhost:3000`

---

## 🎯 Usage

- Customers can browse, favorite products, manage cart, and place orders.
- Admin users manage products, categories, orders, users, and analytics via the admin dashboard.
- Use real-time chat for customer support and admin communication.

---

## 🏫 Guided By

Developed under guidance from **[MERAKI Academy](https://www.meraki-academy.org)**

---

**Developed by Mohammad Ali ©️ 2025**
