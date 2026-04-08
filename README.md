# SecureBuzz - MongoDB Integration Guide

## Project Overview
SecureBuzz is a women safety & entertainment website with full MongoDB database integration. All user data (complaints, stories, SOS alerts) are now stored securely in MongoDB instead of browser localStorage.

## Files Created/Modified

### New Files:
1. **server.js** - Node.js/Express backend server
2. **package.json** - Node.js dependencies
3. **api.js** - Frontend API helper functions
4. **README.md** - This file

### Modified Files:
1. **index.html** - Updated to use MongoDB API calls

## Prerequisites
- Node.js (v14+) installed
- MongoDB installed and running locally
- npm (comes with Node.js)

## Setup Instructions

### Step 1: Install Dependencies
Open PowerShell/Command Prompt in the SecureBuzzWeb directory and run:

```powershell
npm install
```

This will install:
- express (web framework)
- mongoose (MongoDB connection)
- cors (cross-origin requests)
- body-parser (request parsing)
- nodemon (development tool - optional)

### Step 2: Start MongoDB
Make sure MongoDB server is running on your system:

```powershell
# If MongoDB is installed with Windows Service, it should auto-start
# Or manually start mongod.exe from your MongoDB installation directory

# To verify MongoDB is running, open another terminal and run:
mongosh
# You should see the MongoDB shell prompt
```

### Step 3: Start the Express Server
In the SecureBuzzWeb directory:

```powershell
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

### Step 4: Open the Website
In your browser, navigate to:
```
http://localhost:5000
```

The website will now use MongoDB for all data storage!

## API Endpoints

### Complaints API
- **GET** `/api/complaints` - Get all complaints
- **POST** `/api/complaints` - Add new complaint (body: `{message: string}`)
- **DELETE** `/api/complaints/:id` - Delete complaint by ID

### Stories API
- **GET** `/api/stories` - Get all stories
- **POST** `/api/stories` - Add new story (body: `{name: string}`)
- **DELETE** `/api/stories/:id` - Delete story by ID

### SOS Alerts API
- **GET** `/api/sos-alerts` - Get all SOS alerts
- **POST** `/api/sos-alerts` - Create SOS alert (body: `{phoneNumber: string, email: string, location: string}`)
- **POST** `/api/send-sos-email` - Send emergency email (body: `{userEmail: string, userPhone: string, userName: string}`)

## Database Structure

### MongoDB Database: `securebuzz`

Collections created:
1. **complaints** - Stores user complaints
   - `message` (String)
   - `time` (Date)
   - `_id` (MongoDB ObjectID)

2. **stories** - Stores uploaded story information
   - `name` (String - filename)
   - `time` (Date)
   - `_id` (MongoDB ObjectID)

3. **sosalerts** - Stores emergency SOS alerts
   - `phoneNumber` (String)
   - `email` (String)
   - `location` (String)
   - `time` (Date)
   - `_id` (MongoDB ObjectID)

## Features

✅ **Persistent Storage** - All data saved to MongoDB
✅ **RESTful API** - Clean API endpoints
✅ **CORS Enabled** - Frontend can communicate with backend
✅ **Delete Functionality** - Remove complaints and stories
✅ **Timestamps** - Automatic timestamps for all records
✅ **Error Handling** - Proper error responses
✅ **Emergency SOS Email** - Send real emails during emergencies (Gmail integration)

## How It Works

### Frontend (index.html)
- Uses async/await fetch API to communicate with backend
- Calls functions from `api.js`
- Displays data dynamically from database

### Backend (server.js)
- Express server listens on port 5000
- Mongoose connects to MongoDB
- Handles CRUD operations
- Returns JSON responses

### API Helper (api.js)
- Provides wrapper functions for fetch calls
- Communicates with API endpoints
- Error handling

## Troubleshooting

### "MongoDB connection error"
- Ensure MongoDB is running: Check Services or run `mongosh`
- Check connection string in server.js matches your MongoDB setup

### "Cannot GET /"
- Make sure server.js is running (`npm start`)
- Ensure port 5000 is not in use

### "CORS errors"
- CORS is enabled in server.js
- Ensure you're accessing `localhost:5000`, not `127.0.0.1:5000`

### Data not persisting
- Verify MongoDB connection is established (check terminal output)
- Check browser console for API errors (F12 > Console tab)

## Development Mode

For automatic server restart on file changes:

```powershell
npm install --save-dev nodemon
npm run dev
```

## 🚨 Emergency Email Setup

The SOS emergency feature can send **real emails** to notify authorities when a user triggers an alert.

### Quick Setup:
1. See **[SOS_EMAIL_SETUP.md](SOS_EMAIL_SETUP.md)** for detailed instructions
2. Get a Gmail App Password (requires 2FA)
3. Add credentials to `.env` file
4. Restart server

### Without Email Setup:
- SOS alerts still save to database
- Siren sound still plays
- But emails won't be sent (warning shown)

See [SOS_EMAIL_SETUP.md](SOS_EMAIL_SETUP.md) for complete Gmail configuration guide.

## Notes
- All timestamps are automatically set to server time
- MongoDB stores data with automatic `_id` field
- Frontend caches API calls - refresh page to see latest data
- Delete operations require confirmation

## Next Steps (Optional Enhancements)
- Add user authentication
- Implement MongoDB Atlas for cloud hosting
- Add file upload functionality (store actual files)
- Implement real location tracking for SOS
- Add admin dashboard
- Email notifications integration

---

**Created:** March 2026  
**Version:** 1.0 with MongoDB Integration
