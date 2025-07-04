# Taskflow To-Do Board - Backend API

A scalable REST API built with Node.js and Express, providing comprehensive task management functionality with MongoDB integration and authentication.

[![View Frontend Repo](https://img.shields.io/badge/View-Frontend_Repo-blue?style=for-the-badge)](https://github.com/Kimlong168/ANB-Taskflow-Client)

[![Watch Demo](https://img.shields.io/badge/▶️%20Watch%20Demo-YouTube-red?logo=youtube)](https://youtu.be/Mx0VF5Bk5Mg?si=1hh1r0oVZXzqFHKY)

## ✨ API Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based auth system
- **User Registration**: Account creation with validation
- **Password Security**: Bcrypt hashing with salt rounds
- **Token Refresh**: Automatic token renewal
- **Role-based Access**: Admin and user role management

### 📋 Task Management
- **Full CRUD Operations**: Create, Read, Update, Delete tasks
- **Move task**: move task from one to one column
  
### 🗂️ Column Ma
nagement
- **Dynamic Columns**: Create custom workflow stages
- **Column Ordering**: Reorder columns for optimal workflow
- **Column Customization**: Rename and configure columns

### 📋 Board Management
- **Full CRUD Operations**: Create, Read, Update, Delete boards

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL document database
- **Mongoose** - Elegant MongoDB ODM
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing library
- **Cors** - Cross-origin resource sharing

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18.0 or higher)
- [MongoDB](https://www.mongodb.com/) (v5.0 or higher) or MongoDB Atlas
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Kimlong168/ANB-Taskflow-Backend.git

cd ANB-Taskflow-Backend
```

### 2. Install Dependencies

```bash
npm install

```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
CLIENT_SIDE_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todo-board

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
BLACKLIST_CLEANUP_INTERVAL= 24 * 60 * 60 * 1000

# File upload
CLOUDINARY_CLOUD_NAME = xxxxx
CLOUDINARY_API_KEY = xxxxx
CLOUDINARY_API_SECRET = xxxxx

```

### 4. Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`


## 🚀 API Documentation

### Base URL
```
Development: http://localhost:3000/api
```

## 👨‍💻 Author

**Chann Kimlong**
- GitHub: [@Kimlong168](https://github.com/Kimlong168)
- Portfolio: [Portfolio Website](https://kimlongchann.dev)

---

**Project Completion**: Monday, June 23rd, 2024 (On Schedule)
