function showSection(id) {
  document.querySelectorAll('.box').forEach(box => {
    box.classList.add('hidden');
  });
  document.getElementById(id).classList.remove('hidden');
}

function sendSOS() {
  alert("🚨 SOS Sent to Emergency Contacts!");
}