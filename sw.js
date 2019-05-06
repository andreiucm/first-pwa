
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open("files-for-offline")
            .then(cache => {
                return cache.addAll([
                    'index.html',
                    'style.css'
                ])
            })
    )
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request);
                }
            })
    )
})

self.addEventListener('push', event => {
    var title = 'Hei, you have a message';
    var body = 'There is a new product for you';
    var icon = 'assets/icons/mstile-150x105.png';
    var tag = 'new-product-push-notification-tag';

    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,
            tab: tag
        })
    );
});

self.addEventListener("notificationclick", event => {
    event.notification.close();
    event.waitUntil(
        clients
            .matchAll({
                title: 'window'
            })
            .then(clientList => {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    )
});


