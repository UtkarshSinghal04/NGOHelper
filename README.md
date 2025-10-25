# NGO Helper

A comprehensive web application for NGO management, reporting, and analytics. This full-stack application provides tools for NGOs to submit reports, manage contacts, and track their impact through an intuitive dashboard.

## Features

### Frontend (React + JavaScript)
- **Modern UI**: Built with React 19, JavaScript, and Tailwind CSS
- **Authentication**: Secure login system with role-based access
- **Dashboard**: Analytics and reporting dashboard for admins
- **Report Submission**: Single report submission and bulk CSV upload
- **Contact Management**: NGO contact information management
- **Responsive Design**: Mobile-friendly interface

### Backend (Node.js + Express)
- **RESTful API**: Comprehensive API with JWT authentication
- **Database**: SQLite database with proper schema and indexing
- **File Upload**: CSV bulk upload with background processing
- **Security**: Rate limiting, CORS, and security headers
- **Async Processing**: Background job processing for large datasets

## Tech Stack

### Frontend
- React 19 with JavaScript
- Tailwind CSS for styling
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express.js
- SQLite database
- JWT authentication
- Multer for file uploads
- CSV parsing and processing

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd NGOHelper
```

### 2. Install Dependencies

#### Frontend Dependencies
```bash
npm install
```

#### Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Environment Setup

#### Backend Environment
```bash
cd backend
cp env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h
DB_PATH=./database/ngo_helper.db
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Start the Application

#### Option 1: Start Both Services (Recommended)
```bash
# Terminal 1 - Start Backend
cd backend
npm start

# Terminal 2 - Start Frontend
npm start
```

#### Option 2: Development Mode
```bash
# Terminal 1 - Backend with auto-reload
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: ${process.env.REACT_APP_API_URL}
- **Health Check**: ${process.env.REACT_APP_API_URL}/health

## Default Credentials

### Admin Access
- **Username**: admin
- **Password**: #utkarsh*123

## Project Structure

```
NGOHelper/
├── src/                          # Frontend React application
│   ├── components/              # Reusable React components
│   ├── contexts/                # React Context providers
│   ├── pages/                   # Page components
│   └── assets/                  # Static assets
├── backend/                     # Backend Node.js application
│   ├── src/                     # Backend source code
│   │   ├── controllers/         # Route controllers
│   │   ├── middleware/          # Custom middleware
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── config/              # Configuration files
│   ├── database/                # SQLite database files
│   └── package.json             # Backend dependencies
├── public/                      # Public static files
└── package.json                 # Frontend dependencies
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Reports
- `POST /api/report` - Submit single report
- `GET /api/report/dashboard?month=January&year=2024` - Get dashboard data (Admin only)

### Bulk Upload
- `POST /api/reports/upload` - Upload CSV file for bulk processing
- `GET /api/reports/job-status/{jobId}` - Get job processing status
- `GET /api/reports/jobs` - Get all jobs (Admin only)

### Health Check
- `GET /health` - API health status

## CSV Upload Format

For bulk report uploads, use the following CSV format:

```csv
NGO ID,Month,People Helped,Events Conducted,Funds Utilized
NGO001,January,150,5,25000
NGO002,January,200,8,30000
```

## API Documentation 

This project includes interactive API documentation built with Swagger.

To view the documentation:

#### 1. Navigate to the backend directory:
```bash
cd backend
```
#### 2. Run the Swagger command:
```bash
npm run swagger
```
Access the documentation in your browser at the URL provided in the terminal (e.g., http://localhost:3001/api-docs).

## Database Schema

### Users Table
- `id` (TEXT PRIMARY KEY)
- `username` (TEXT UNIQUE)
- `password` (TEXT - hashed)
- `role` (TEXT - 'admin' or 'user')
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Reports Table
- `id` (TEXT PRIMARY KEY)
- `ngo_id` (TEXT)
- `ngo_name` (TEXT)
- `month` (TEXT)
- `year` (INTEGER)
- `people_helped` (INTEGER)
- `events_conducted` (INTEGER)
- `funds_utilized` (REAL)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Jobs Table
- `id` (TEXT PRIMARY KEY)
- `status` (TEXT - 'pending', 'processing', 'completed', 'failed')
- `progress` (INTEGER)
- `total_rows` (INTEGER)
- `processed_rows` (INTEGER)
- `error_message` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

Website Link : https://ngo-helper-three.vercel.app/
Happy Coding!
