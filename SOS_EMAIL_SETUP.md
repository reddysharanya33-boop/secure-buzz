# 🚨 SOS Email Setup Guide - Emergency Alerts Configuration

## Overview
SecureBuzz now sends **real emergency emails** when a user triggers the SOS alarm. This guide walks you through setting up Gmail to send these emails.

---

## ⚙️ Step-by-Step Setup (5 minutes)

### Step 1: Update npm Packages
First, install the new email dependencies:

```powershell
cd d:\SecureBuzzWeb
npm install
```

This will install `nodemailer` (for sending emails) and `dotenv` (for storing credentials securely).

### Step 2: Get Gmail App Password

Gmail requires an **App Password** for 3rd-party applications to send emails. Here's how to get one:

#### A. Sign in to Google Account
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Sign in with your Gmail email and password

#### B. Enable 2-Factor Authentication (if not already enabled)
1. Click **Security** in the left menu
2. Under "Your Google Account", click **Security**
3. Scroll down to "2-Step Verification"
4. If not enabled, click it and follow the steps
   - You'll need a phone to receive verification codes

#### C. Generate App Password
1. Go back to **Security** settings
2. Scroll down to **"App passwords"** (only visible if 2FA is enabled)
3. Select:
   - **App**: Mail
   - **Device**: Windows Computer (or your device)
4. Click **Generate**
5. Google will show a **16-character password** - **COPY THIS** (don't include spaces)

Example: `abcd efgh ijkl mnop` → Copy as → `abcdefghijklmnop`

---

### Step 3: Create .env File
The `.env` file stores your Gmail credentials securely.

**Open `d:\SecureBuzzWeb\.env` and update:**

```env
# Gmail Configuration for SOS Emergency Emails
GMAIL_USER=your-actual-gmail@gmail.com
GMAIL_PASSWORD=your-16-char-app-password

# Admin email to receive SOS alerts
ADMIN_EMAIL=Reddysharanya33@gmail.com
```

**Example:**
```env
GMAIL_USER=myemail@gmail.com
GMAIL_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=admin@example.com
```

⚠️ **IMPORTANT**: 
- Never commit `.env` file to GitHub (it's in .gitignore)
- Keep your App Password secret!
- Use `your-actual-gmail@gmail.com` - the email must match the Gmail account you created the password from

---

### Step 4: Restart the Server

```powershell
npm start
```

You should see in the terminal:
```
✅ Email service configured successfully
```

If you see a warning instead, the .env file isn't set up correctly.

---

## 🧪 Test the SOS Email Feature

### Manual Test:
1. Open `http://localhost:5000`
2. Click **SOS** tab
3. Fill in:
   - Name: John Doe
   - Phone: 9876543210
   - Email: your-email@gmail.com
4. Click **🚨 SEND SOS ALERT & EMAIL**
5. You should receive an email at the ADMIN_EMAIL address

### Expected Email:
- **Subject**: `🚨 URGENT: SOS Emergency Alert - John Doe`
- **From**: Your configured Gmail
- **Content**: Emergency details in a formatted HTML email

---

## 📧 How the Email Works

When someone clicks SOS:

```
1. User fills form (Name, Phone, Email)
   ↓
2. Frontend calls /api/send-sos-email
   ↓
3. Backend creates formatted HTML email
   ↓
4. Nodemailer sends via Gmail SMTP
   ↓
5. Email arrives at ADMIN_EMAIL
   ↓
6. Admin can contact user immediately
```

---

## 🔍 Troubleshooting

### ❌ "Email service not configured"
**Problem**: Warning shows instead of success message on startup

**Solution**:
1. Check `.env` file exists in `d:\SecureBuzzWeb\`
2. Verify `GMAIL_USER` and `GMAIL_PASSWORD` are filled
3. Restart server: `npm start`

---

### ❌ "Invalid credentials" Error
**Problem**: Error when sending SOS email

**Solution**:
1. Verify App Password is correct (copy-paste exactly, no spaces)
2. Verify GMAIL_USER matches the account that created the App Password
3. 2FA must be enabled on the Gmail account
4. App Password only works with Gmail accounts (not corporate accounts)

**To get new App Password**:
1. Go back to [Gmail App Passwords](https://myaccount.google.com/apppasswords)
2. Delete old one and generate new one
3. Update `.env` with new password

---

### ❌ "SMTP Error: connect ECONNREFUSED"
**Problem**: Network/connection error

**Solution**:
1. Check internet connection
2. Gmail might be blocking from new device - check your Gmail notifications
3. Try generating new App Password
4. Restart server and try again

---

### ❌ Email sent but not received
**Problem**: No email in inbox (check Spam!)

**Solution**:
1. **Check Spam folder** - Gmail sometimes marks automated emails as spam
2. Verify ADMIN_EMAIL in `.env` is correct
3. Check browser console (F12 > Console) for detailed errors
4. Check server terminal for error messages

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep `.env` file secret
- Use App Password, NOT your actual Gmail password
- Enable 2FA on Gmail account
- Regenerate password if suspected compromise
- Use different admin email if needed

❌ **DON'T:**
- Commit `.env` to GitHub/Git
- Share App Password with others
- Use same password for multiple services
- Disable 2FA on Gmail account

---

## 📊 Email Configuration

### Default Admin Email
```
Reddysharanya33@gmail.com
```

To change, edit `.env`:
```env
ADMIN_EMAIL=your-email@gmail.com
```

### Email Content Includes:
- 🚨 RED ALERT styling
- User name
- User phone number
- User email
- Exact timestamp
- Clear "ACTION REQUIRED" message

---

## 🚀 Advanced: Using Different Email Services

### Outlook/Hotmail
```env
GMAIL_USER=your-email@outlook.com
GMAIL_PASSWORD=your-password
```
(Update `service: 'outlook'` in server.js)

### Custom SMTP Server
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.yourserver.com',
    port: 587,
    auth: {
        user: 'your-email@domain.com',
        pass: 'your-password'
    }
});
```

---

## 📞 Testing Commands

### Test email in terminal:
```powershell
npm start
# Wait for "Email service configured successfully"
```

### Verify Gmail connection:
```powershell
# In PowerShell
$gmail = "your-email@gmail.com"
$appPassword = "your-16-char-password"

# If successful, connection works
```

---

## 📋 Checklist

- [ ] Created App Password in Gmail
- [ ] Updated `.env` file with GMAIL_USER
- [ ] Updated `.env` file with GMAIL_PASSWORD
- [ ] Updated `.env` file with ADMIN_EMAIL
- [ ] Ran `npm install`
- [ ] Restarted server with `npm start`
- [ ] See "Email service configured successfully"
- [ ] Tested SOS form with real data
- [ ] Received test email at ADMIN_EMAIL
- [ ] Checked spam folder if not received

---

## 🎯 Next Steps

Once emails working:
1. ✅ Test with different contact info
2. ✅ Monitor spam folder settings
3. ✅ Consider sending to multiple emails (add CC/BCC)
4. ✅ Add SMS notifications (Twilio)
5. ✅ Log all SOS emails to database

---

## 📞 Support

**If emails aren't working:**
1. Check terminal for error messages
2. Check browser console (F12) for API errors
3. Verify `.env` file in correct location
4. Ensure 2FA is enabled in Gmail
5. Generate new App Password

---

**Version**: 1.0 with Email Support  
**Last Updated**: March 2026  
**Status**: Production Ready ✅
