const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ==================== FILE UPLOAD SETUP ====================
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadsDir));  // Serve uploaded files

// ==================== DATABASE CONNECTION ====================
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/securebuzz';
const PORT = process.env.PORT || 5000;

console.log('🗄️  Attempting to connect to MongoDB...');
console.log(`📍 MongoDB URL: ${MONGO_URL}`);

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database: securebuzz');
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Make sure MongoDB is running on your system!');
    process.exit(1);
});

// ==================== EMAIL CONFIGURATION ====================
// Gmail configuration for sending emergency emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_PASSWORD || 'your-app-password'
    }
});

// Verify email configuration
let emailServiceReady = false;
transporter.verify((error, success) => {
    if (error) {
        console.error('ERROR: Email service verification failed:', error.message);
        console.warn('Email service not configured. SOS emails will NOT work.');
        console.warn('To enable email:');
        console.warn('   1. Go to myaccount.google.com');
        console.warn('   2. Enable 2-Factor Authentication');
        console.warn('   3. Go to myaccount.google.com/apppasswords');
        console.warn('   4. Generate App Password for Mail');
        console.warn('   5. Copy 16-char password to GMAIL_PASSWORD in .env');
        emailServiceReady = false;
    } else {
        console.log('OK: Email service configured and ready');
        console.log('Sending emails from: ' + process.env.GMAIL_USER);
        console.log('Admin email: ' + process.env.ADMIN_EMAIL);
        emailServiceReady = true;
    }
});

// ==================== DATABASE SCHEMAS ====================
const complaintSchema = new mongoose.Schema({
    message: { type: String, required: true },
    time: { type: Date, default: Date.now }
}, { timestamps: true });

const storySchema = new mongoose.Schema({
    name: { type: String, required: true },
    filepath: { type: String, required: true },
    originalname: { type: String, required: true },
    time: { type: Date, default: Date.now }
}, { timestamps: true });

const sosAlertSchema = new mongoose.Schema({
    phoneNumber: String,
    email: String,
    time: { type: Date, default: Date.now },
    location: String
}, { timestamps: true });

// ==================== DATABASE MODELS ====================
const Complaint = mongoose.model('Complaint', complaintSchema);
const Story = mongoose.model('Story', storySchema);
const SOSAlert = mongoose.model('SOSAlert', sosAlertSchema);

app.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complaint.find().sort({ time: -1 });
        res.json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/complaints
 * Creates a new complaint
 * Body: { message: string }
 */
app.post('/api/complaints', async (req, res) => {
    try {
        if (!req.body.message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const complaint = new Complaint({
            message: req.body.message,
            time: new Date()
        });
        
        await complaint.save();
        console.log('✏️  New complaint added');
        res.json({ success: true, complaint });
    } catch (error) {
        console.error('Error adding complaint:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/complaints/:id
 * Deletes a complaint by ID
 */
app.delete('/api/complaints/:id', async (req, res) => {
    try {
        const result = await Complaint.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Complaint not found' });
        }
        console.log('🗑️  Complaint deleted');
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting complaint:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== STORY ROUTES ====================

/**
 * GET /api/stories
 * Retrieves all stories sorted by newest first
 */
app.get('/api/stories', async (req, res) => {
    try {
        const stories = await Story.find().sort({ time: -1 });
        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/stories
 * Uploads a story file
 * Body: FormData with 'file' field
 */
app.post('/api/stories', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const story = new Story({
            name: req.file.filename,
            filepath: req.file.path,
            originalname: req.file.originalname,
            time: new Date()
        });
        
        await story.save();
        console.log('📖 Story file uploaded:', req.file.originalname);
        res.json({ 
            success: true, 
            story,
            downloadUrl: `/api/download-story/${story._id}`
        });
    } catch (error) {
        console.error('Error uploading story:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * DELETE /api/stories/:id
 * Deletes a story by ID
 */
app.delete('/api/stories/:id', async (req, res) => {
    try {
        const result = await Story.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Story not found' });
        }
        // Delete file from disk
        if (result.filepath && fs.existsSync(result.filepath)) {
            fs.unlinkSync(result.filepath);
        }
        console.log('🗑️  Story deleted');
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/download-story/:id
 * Downloads a story file
 */
app.get('/api/download-story/:id', async (req, res) => {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }
        
        if (!story.filepath || !fs.existsSync(story.filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        res.download(story.filepath, story.originalname, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
            } else {
                console.log('Downloaded:', story.originalname);
            }
        });
    } catch (error) {
        console.error('Error downloading story:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==================== SOS ROUTES ====================

/**
 * GET /api/sos-alerts
 * Retrieves all SOS alerts sorted by newest first
 */
app.get('/api/sos-alerts', async (req, res) => {
    try {
        const alerts = await SOSAlert.find().sort({ time: -1 });
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching SOS alerts:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/sos-alerts
 * Creates a new SOS alert
 * Body: { phoneNumber: string, email: string, location: string }
 */
app.post('/api/sos-alerts', async (req, res) => {
    try {
        const alert = new SOSAlert({
            phoneNumber: req.body.phoneNumber || 'Not provided',
            email: req.body.email || 'Not provided',
            location: req.body.location || 'Not provided',
            time: new Date()
        });
        
        await alert.save();
        console.log('🚨 SOS ALERT CREATED - Emergency triggered!');
        res.json({ success: true, alert });
    } catch (error) {
        console.error('Error creating SOS alert:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/send-sos-email
 * Sends an emergency email alert to admin and saves to database
 * Body: { }
 */
app.post('/api/send-sos-email', async (req, res) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const gmailUser = process.env.GMAIL_USER;
        const gmailPass = process.env.GMAIL_PASSWORD;

        console.log('SOS Email Request - Checking configuration...');

        // Validate configuration
        if (!adminEmail) {
            console.error('ERROR: ADMIN_EMAIL not set in .env');
            return res.status(500).json({ 
                error: 'Admin email not configured',
                debug: 'Set ADMIN_EMAIL in .env file'
            });
        }

        if (!gmailUser || !gmailPass) {
            console.error('ERROR: Gmail credentials not in .env');
            return res.status(500).json({ 
                error: 'Email service not configured',
                debug: 'Set GMAIL_USER and GMAIL_PASSWORD in .env file'
            });
        }

        // Create email content
        const alertTime = new Date().toLocaleString();
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f0f0f0; }
        .emergency-alert { 
            background-color: #ff0000; 
            color: white; 
            padding: 20px; 
            border-radius: 10px;
            max-width: 600px;
            margin: 20px auto;
        }
        .alert-title { font-size: 28px; font-weight: bold; margin-bottom: 15px; }
        .alert-content { font-size: 16px; line-height: 1.6; }
        .timestamp { font-size: 12px; margin-top: 15px; opacity: 0.9; }
    </style>
</head>
<body>
    <div class="emergency-alert">
        <div class="alert-title">EMERGENCY SOS ALERT</div>
        
        <div class="alert-content">
            <p><strong>CRITICAL EMERGENCY - IMMEDIATE ACTION REQUIRED!</strong></p>
            
            <p style="font-size: 20px; margin-top: 15px;">A user has triggered an emergency SOS alert.</p>
            
            <p style="margin-top: 15px;"><strong>Please respond to this emergency immediately!</strong></p>
        </div>
        
        <div class="timestamp">Alert Time: ${alertTime}</div>
    </div>
</body>
</html>
        `;

        // Try to save to database first
        try {
            const sosAlert = new SOSAlert({
                phoneNumber: 'Emergency SOS',
                email: adminEmail,
                location: 'User triggered emergency alert',
                time: new Date()
            });
            await sosAlert.save();
            console.log('SOS alert saved to database');
        } catch (dbError) {
            console.error('Warning: Could not save to database:', dbError.message);
        }

        // Send email to admin
        const mailOptions = {
            from: gmailUser,
            to: adminEmail,
            subject: 'CRITICAL: EMERGENCY SOS ALERT - IMMEDIATE RESPONSE REQUIRED',
            html: emailContent
        };

        console.log('Attempting to send email...');
        console.log('From: ' + gmailUser);
        console.log('To: ' + adminEmail);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Email send failed:', error.message);
                console.error('Error code:', error.code);
                
                return res.status(500).json({ 
                    success: false,
                    error: 'Failed to send email',
                    details: error.message,
                    debugTips: [
                        'Check if Gmail credentials in .env are correct',
                        'Make sure GMAIL_PASSWORD is an App Password, not regular password',
                        'Verify 2-Factor Authentication is enabled on Gmail account',
                        'Try regenerating a new App Password'
                    ]
                });
            }
            
            console.log('SOS Email sent successfully!');
            console.log('Message ID: ' + info.messageId);
            
            res.json({ 
                success: true, 
                message: 'Emergency SOS alert sent successfully',
                sentTo: adminEmail,
                time: alertTime
            });
        });

    } catch (error) {
        console.error('Error in SOS email endpoint:', error);
        res.status(500).json({ 
            error: 'Server error',
            details: error.message
        });
    }
});

// ==================== TEST ROUTE ====================

/**
 * GET /api/email-status
 * Check email service configuration
 */
app.get('/api/email-status', (req, res) => {
    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;

    res.json({
        emailConfigured: emailServiceReady,
        gmailUserSet: !!gmailUser,
        gmailPasswordSet: !!gmailPass,
        adminEmailSet: !!adminEmail,
        gmailUser: gmailUser || 'NOT SET',
        adminEmail: adminEmail || 'NOT SET',
        status: emailServiceReady ? 'READY' : 'NOT CONFIGURED'
    });
});

/**
 * GET /api/status
 * Health check endpoint
 */
app.get('/api/status', (req, res) => {
    res.json({
        status: 'OK',
        server: 'Running',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date()
    });
});

// ==================== STATIC FILES ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== ERROR HANDLING ====================
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════╗');
    console.log('║         🔐 SecureBuzz Running         ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║ 🚀 Server: http://localhost:${PORT}            ║`);
    console.log(`║ 🗄️  Database: Connected                 ║`);
    console.log(`║ 📊 Collections: 3 (complaints,         ║`);
    console.log(`║    stories, sosalerts)                 ║`);
    console.log('╚════════════════════════════════════════╝');
    console.log('');
    console.log('📝 Test the API: http://localhost:' + PORT + '/api/status');
    console.log('');
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGINT', async () => {
    console.log('\n❌ Shutting down gracefully...');
    await mongoose.connection.close();
    process.exit(0);
});
