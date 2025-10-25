# NGO Helper Backend API

A comprehensive backend API for the NGO Helper application built with Node.js, Express.js, and SQLite.

## Features

- **Authentication System**: JWT-based authentication with admin/user roles
- **Report Management**: Single report submission and bulk CSV upload
- **Async Processing**: Background job processing for CSV uploads
- **Dashboard Analytics**: Monthly data aggregation and reporting
- **Database**: SQLite database with proper schema and indexing

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

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Edit `.env` file with your configuration.

3. **Start the server:**
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
   ```

## Environment Variables

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

## Default Admin Credentials

- **Username:** admin
- **Password:** admin123

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

## CSV Upload Format

The CSV file should have the following columns:
- NGO ID
- Month
- People Helped
- Events Conducted
- Funds Utilized

Example:
```csv
NGO ID,Month,People Helped,Events Conducted,Funds Utilized
NGO001,January,150,5,25000
NGO002,January,200,8,30000
```

## API Usage Examples

### Login
```bash
curl -X POST ${process.env.REACT_APP_API_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Submit Report
```bash
curl -X POST ${process.env.REACT_APP_API_URL}/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "ngoId":"NGO001",
    "month":"January",
    "peopleHelped":150,
    "eventsConducted":5,
    "fundsUtilized":25000
  }'
```

### Upload CSV
```bash
curl -X POST ${process.env.REACT_APP_API_URL}/api/reports/upload \
  -F "csvFile=@reports.csv"
```

### Get Dashboard Data
```bash
curl -X GET "${process.env.REACT_APP_API_URL}/api/report/dashboard?month=January&year=2024" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development

- **Node.js**: Pure JavaScript backend with modern ES6+ features
- **Database**: SQLite with proper indexing for performance
- **Security**: Helmet.js for security headers, rate limiting, CORS
- **Validation**: Express-validator for request validation
- **Error Handling**: Comprehensive error handling and logging

## License

MIT
