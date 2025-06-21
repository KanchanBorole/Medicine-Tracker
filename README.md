# MediTrack - Medicine Expiry & Donation Tracker

A comprehensive MERN stack application for tracking medicine expiry dates and facilitating donations to NGOs. Features barcode scanning, expiry notifications, and pickup scheduling.

## Features

- 📱 **Barcode Scanning**: Scan medicine barcodes for quick entry
- 📅 **Expiry Tracking**: Monitor medicine expiry dates with automatic alerts
- 🔔 **Smart Notifications**: Get notified 7, 3, and 1 days before expiry
- ❤️ **Donation Management**: Schedule pickup with local NGOs
- 📊 **Dashboard Analytics**: View comprehensive statistics and insights
- 👥 **Admin Panel**: Manage donation requests and NGO partnerships
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop
- 🎨 **Medical Theme**: Clean, healthcare-focused UI design

## Tech Stack

### Frontend
- **React** (JavaScript, no TypeScript)
- **Pure CSS** (no Tailwind or frameworks)
- **Wouter** (lightweight routing)
- **TanStack Query** (data fetching)
- **QuaggaJS** (barcode scanning - to be implemented)

### Backend
- **Express.js** (Node.js server)
- **In-Memory Storage** (for demonstration)
- **RESTful API** (CRUD operations)
- **CORS** (cross-origin resource sharing)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd meditrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server (both frontend and backend)
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript checks

## Usage Guide

### Adding Medicines

1. **Scan Barcode**: Use the scanner to automatically detect medicine barcodes
2. **Manual Entry**: Add medicines manually with all required details
3. **Bulk Import**: (Future feature) Import from CSV/Excel files

### Managing Expiry Dates

- **Dashboard Alerts**: View medicines expiring soon on the dashboard
- **Status Indicators**: Visual color-coding (green/yellow/red) for expiry status
- **Automatic Calculations**: Days until expiry calculated automatically

### Donation Process

1. **Schedule Pickup**: Choose NGO, date, and time for donation pickup
2. **Admin Review**: NGO admins review and approve/decline requests
3. **Confirmation**: Receive confirmation and tracking updates
4. **Completion**: Mark donations as completed after pickup

### Admin Features

- **Pickup Management**: Review and manage donation requests
- **NGO Partnerships**: Manage partner NGO information
- **Analytics**: View comprehensive donation and medicine statistics

## API Endpoints

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation request
- `PUT /api/donations/:id` - Update donation status

### NGOs
- `GET /api/ngos` - Get all NGOs

### Statistics
- `GET /api/statistics` - Get dashboard statistics

## Database Schema

### Medicines
```javascript
{
  id: number,
  name: string,
  type: string, // tablet, capsule, syrup, etc.
  quantity: number,
  expiryDate: Date,
  batchNumber: string,
  barcode: string,
  notes: string,
  status: string, // good, warning, expired
  createdAt: Date
}
