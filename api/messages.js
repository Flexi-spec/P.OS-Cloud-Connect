// --- MESSAGING LOGIC ---
const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('messenger-form');
const messageInput = document.getElementById('m-input');

async function syncMessages() {
    try {
        const res = await fetch(`/api/messages?room=${APP_STATE.room}`);
        const data = await res.json();
        
        chatContainer.innerHTML = data.map(m => `
            <div class="flex flex-col ${m.user === APP_STATE.user ? 'items-end' : 'items-start'}">
                <span class="text-[10px] font-bold text-slate-500 uppercase px-2 mb-1">${m.user}</span>
                <div class="chat-bubble ${m.user === APP_STATE.user ? 'bubble-out' : 'bubble-in'}">
                    ${m.text}
                </div>
            </div>
        `).join('');
        
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (e) { console.error("Link offline"); }
}

messageForm.onsubmit = async (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if(!text) return;

    messageInput.value = ''; // Instant UI clear
    await fetch(`/api/messages?room=${APP_STATE.room}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: APP_STATE.user, text })
    });
    syncMessages();
};

// Start Polling
setInterval(syncMessages, 3000);
syncMessages();

// --- NAVIGATION ---
function navTo(tab) {
    if (APP_STATE.isGuest) return; // Prevent guest from switching tabs
    document.querySelectorAll('.tab-view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-' + tab).classList.add('active');
}
