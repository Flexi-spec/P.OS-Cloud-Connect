// 1. Handle the Push Event
self.addEventListener('push', (event) => {
    // Attempt to parse JSON data; fall back to default if data is missing or malformed
    let data = { 
        title: "P.OS Message", 
        body: "You have a new executive command.",
        icon: '/icon.png' // Default icon
    };

    if (event.data) {
        try {
            const pushData = event.data.json();
            data = { ...data, ...pushData };
        } catch (e) {
            console.warn('Push event received non-JSON data:', event.data.text());
        }
    }

    // Show the notification and ensure the service worker stays active until finished
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon || 'https://cdn-icons-png.flaticon.com',
            badge: 'https://cdn-icons-png.flaticon.com',
            vibrate: [200, 100, 200],
            // Pass data to the click event if needed (e.g., a specific URL)
            data: { url: data.url || '/' }
        })
    );
});

// 2. Handle the Notification Click Event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Retrieve the URL passed in the notification data, or default to root
    const targetUrl = event.notification.data.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // If a window is already open, focus it; otherwise, open a new one
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
}); 
                      self.addEventListener('install', (event) => {
  console.log('P.OS Service Worker Installed');
});

self.addEventListener('fetch', (event) => {
  // Pass-through for network requests
  event.respondWith(fetch(event.request));
});
