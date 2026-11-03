self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || 'Nova marcação', {
    body: d.body || 'Abra a agenda para ver os detalhes.',
    icon: '/app/icon-192.png', badge: '/app/icon-192.png', tag: d.tag || 'ns-booking', data: { url: '/app/' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUninstalled: false }).then(list => {
    for (const c of list) if ('focus' in c) return c.focus();
    return self.clients.openWindow('/app/');
  }));
});
