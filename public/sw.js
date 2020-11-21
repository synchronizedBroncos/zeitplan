const cacheName = 'zeitplan';

const staticAssets = [
  './favicon.ico',
  './firebase-messaging-sw.js',
  './logs.html',
  './manifest.webmanifest',
  './pomodoro.html',
  './schedule.html',
  './ttr.html',
  './javascripts/controllers/home-control.js',
  './javascripts/controllers/log-control.js',
  './javascripts/controllers/schedule-control.js',
  './javascripts/controllers/ttr-control.js',
  './javascripts/features/clock.js',
  './javascripts/libraries/angular.min.js',
  './javascripts/libraries/bootstrap.js',
  './javascripts/libraries/loading-bar.js',
  './javascripts/services/restService.js',
  './resources/cropped_logo_192x192.png',
  './resources/cropped_logo.png',
  './resources/logo2.png',
  './stylesheets/bootstrap.css',
  './stylesheets/clockstyle.css',
  './stylesheets/homepageStyle.css',
  './stylesheets/loading-bar.css',
  './stylesheets/logsStyle.css',
  './stylesheets/style.css'
];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(function() {
      return caches.match(e.request);
    })
  );
});

