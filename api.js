// API Helper Functions
const API_BASE_URL = 'http://localhost:5000/api';

// ==================== COMPLAINT API ====================
async function fetchComplaints() {
    try {
        const response = await fetch(`${API_BASE_URL}/complaints`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching complaints:', error);
        return [];
    }
}

async function addComplaint(message) {
    try {
        const response = await fetch(`${API_BASE_URL}/complaints`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding complaint:', error);
        return { error: error.message };
    }
}

async function deleteComplaint(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/complaints/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting complaint:', error);
        return { error: error.message };
    }
}

// ==================== STORY API ====================
async function fetchStories() {
    try {
        const response = await fetch(`${API_BASE_URL}/stories`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching stories:', error);
        return [];
    }
}

async function addStory(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/stories`, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('Error adding story:', error);
        return { error: error.message };
    }
}

async function deleteStory(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    } catch (error) {
        console.error('Error deleting story:', error);
        return { error: error.message };
    }
}

// ==================== SOS API ====================
async function createSOSAlert(phoneNumber, email, location) {
    try {
        const response = await fetch(`${API_BASE_URL}/sos-alerts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, email, location })
        });
        return await response.json();
    } catch (error) {
        console.error('Error creating SOS alert:', error);
        return { error: error.message };
    }
}

async function fetchSOSAlerts() {
    try {
        const response = await fetch(`${API_BASE_URL}/sos-alerts`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching SOS alerts:', error);
        return [];
    }
}

// ==================== SOS EMAIL API ====================
async function sendSOSEmail() {
    try {
        console.log('Initiating SOS emergency alert...');
        const response = await fetch(`${API_BASE_URL}/send-sos-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ })
        });
        
        const data = await response.json();
        console.log('Response from server:', data);
        
        if (!response.ok) {
            console.error('Server returned error:', data);
            return { error: data.error || 'Unknown error', details: data.details, debugTips: data.debugTips };
        }
        
        return data;
    } catch (error) {
        console.error('Network error sending SOS email:', error);
        return { error: 'Network error: ' + error.message };
    }
}

// ==================== EMAIL STATUS CHECK ====================
async function checkEmailStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/email-status`);
        return await response.json();
    } catch (error) {
        console.error('Error checking email status:', error);
        return { error: error.message };
    }
}
