# Quick Start Guide - SecureBuzz with MongoDB

## ⚡ 5-Minute Setup

### 1. Prerequisites Check
```powershell
# Check if Node.js is installed
node --version
npm --version

# Check if MongoDB is running (in another terminal)
mongosh --version
```

If any are missing, install them first:
- **Node.js**: https://nodejs.org/
- **MongoDB**: https://www.mongodb.com/try/download/community

### 2. Install Dependencies (30 seconds)
```powershell
cd d:\SecureBuzzWeb
npm install
```

### 3. Start MongoDB (if not already running)
```powershell
# Windows Services should auto-start it, or:
mongod
```

### 4. Start the Server
```powershell
npm start
```

You should see:
```
╔════════════════════════════════════════╗
║         🔐 SecureBuzz Running         ║
╠════════════════════════════════════════╣
║ 🚀 Server: http://localhost:5000       ║
║ 🗄️  Database: Connected                ║
║ 📊 Collections: 3                      ║
╚════════════════════════════════════════╝
```

### 5. Open Your Browser
```
http://localhost:5000
```

✅ **Done! Your application is now running with MongoDB!**

---

## 🧪 Testing the Application

### Add a Complaint
1. Click **Complaint** tab
2. Type your message
3. Click **Submit Complaint**
4. Message is saved to MongoDB

### Upload a Story
1. Click **Stories** tab
2. Select any file
3. Click **Upload Story**
4. File name is saved to MongoDB

### Send SOS Alert
1. Click **SOS** tab
2. (Optional) Enter phone number and email
3. Click **SEND SOS ALERT**
4. Alert is logged to MongoDB

---

## 🛠️ Alternative: Use the Batch File (Windows)

```powershell
cd d:\SecureBuzzWeb
.\start.bat
```

This will automatically:
- Check for npm
- Verify MongoDB
- Install dependencies
- Start the server

---

## 📊 Verify MongoDB Connection

Open a new PowerShell and run:
```powershell
mongosh
> use securebuzz
> db.complaints.find()
> db.stories.find()
> db.sosalerts.find()
```

You should see your data!

---

## 🔧 Development Mode

For automatic server restart on code changes:
```powershell
npm run dev
```

(Requires `nodemon` - installed as dev dependency)

---

## ❌ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot connect to MongoDB" | Start MongoDB: `mongod` in another terminal |
| "Port 5000 already in use" | Change PORT in server.js or kill process on :5000 |
| "Cannot GET /" | Make sure `npm start` is running |
| Data not saving | Check MongoDB is running (`mongosh` should connect) |
| "npm: command not found" | Install Node.js from nodejs.org |

---

## 📝 File Structure

```
SecureBuzzWeb/
├── index.html          ← Frontend (served on port 5000)
├── api.js              ← API helper functions
├── style.css           ← Styling
├── script.js           ← Legacy script
├── server.js           ← Express + MongoDB backend
├── package.json        ← Dependencies
├── .env.example        ← Configuration template
├── start.bat           ← Windows launcher
├── README.md           ← Full documentation
└── varshu.py           ← Python script (optional)
```

---

## 🔌 API Endpoints

```
GET  /api/complaints         → Fetch all complaints
POST /api/complaints         → Add complaint
DELETE /api/complaints/:id   → Delete complaint

GET  /api/stories            → Fetch all stories
POST /api/stories            → Add story
DELETE /api/stories/:id      → Delete story

GET  /api/sos-alerts         → Fetch all SOS alerts
POST /api/sos-alerts         → Create SOS alert

GET  /api/status             → Server health check
```

---

## 📦 What Gets Saved to MongoDB?

### Complaints Collection
```json
{
  "_id": ObjectId("..."),
  "message": "Your complaint text",
  "time": ISODate("2026-03-11T10:30:00.000Z"),
  "createdAt": ISODate("2026-03-11T10:30:00.000Z"),
  "updatedAt": ISODate("2026-03-11T10:30:00.000Z")
}
```

### Stories Collection
```json
{
  "_id": ObjectId("..."),
  "name": "filename.pdf",
  "time": ISODate("2026-03-11T10:30:00.000Z")
}
```

### SOS Alerts Collection
```json
{
  "_id": ObjectId("..."),
  "phoneNumber": "1234567890",
  "email": "user@example.com",
  "location": "Current Location",
  "time": ISODate("2026-03-11T10:30:00.000Z")
}
```

---

## ✨ Next Steps

- [ ] Add user authentication
- [ ] Deploy to cloud (MongoDB Atlas + Heroku/AWS)
- [ ] Add real file upload functionality
- [ ] Implement geolocation for SOS
- [ ] Create admin dashboard
- [ ] Add email notifications

---

**Happy coding! 🚀**
