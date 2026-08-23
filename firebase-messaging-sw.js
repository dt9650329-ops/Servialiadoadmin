// ══════════════════════════════════════════════════════════════════
// firebase-messaging-sw.js — Service Worker de notificaciones push
// para el PANEL ADMINISTRADOR de Servi Aliados.
//
// ⚠️ IMPORTANTE: este archivo debe quedar en la RAÍZ del proyecto
// (al mismo nivel que index.html del panel admin), sea cual sea la
// carpeta/repo donde termine publicado — así el navegador lo registra
// con scope relativo a esa carpeta y recibe notificaciones aunque la
// pestaña esté cerrada del todo. Las rutas de este archivo son
// relativas a propósito (sin "/" al inicio) para que funcionen igual
// si el sitio se publica en la raíz del dominio o en una subcarpeta
// (ej. dt9650329-ops.github.io/Servialiadoadmin/).
//
// No necesita edición manual aparte de la config de Firebase (que es
// la misma que ya usa index.html — no es secreta, es pública por
// diseño en apps web de Firebase).
// ══════════════════════════════════════════════════════════════════

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAZX7Q5B29Xti4YtV9wXuiREVdkgcclv9U",
  authDomain: "domicilios-1cd74.firebaseapp.com",
  databaseURL: "https://domicilios-1cd74-default-rtdb.firebaseio.com",
  projectId: "domicilios-1cd74",
  storageBucket: "domicilios-1cd74.firebasestorage.app",
  messagingSenderId: "771819437001",
  appId: "1:771819437001:web:b9c8f5e4d3a2c1b0a1b2c3"
});

const messaging = firebase.messaging();

// Se dispara cuando llega una notificación y el panel NO está en primer
// plano (pestaña cerrada, minimizada, o el navegador en segundo plano).
messaging.onBackgroundMessage(function (payload) {
  const titulo = (payload.notification && payload.notification.title) || 'Servi Aliados Admin';
  const cuerpo = (payload.notification && payload.notification.body) || '';

  self.registration.showNotification(titulo, {
    body: cuerpo,
    icon: 'icon-192.png',   // opcional: si no existe este archivo, el navegador usa un ícono por defecto
    badge: 'icon-192.png',  // opcional
    data: payload.data || {},
    tag: 'servi-aliados-admin-alerta', // agrupa notificaciones seguidas en vez de amontonarlas
  });
});

// Al tocar la notificación, abre (o enfoca) el panel admin.
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (listaClientes) {
      for (const c of listaClientes) {
        if ('focus' in c) return c.focus();
      }
      if (clients.openWindow) return clients.openWindow(self.registration.scope);
    })
  );
});
