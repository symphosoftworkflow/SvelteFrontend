<!-- f46d7395-605e-43a7-af90-91f4afd63161 687ce244-c995-4ca6-bab7-95626c6cf0ed b6d4398b-7e1d-4cde-814c-b9b9977d30a3 -->
# Docker Setup for Svelte Frontend with Auto-Build

## Overview

Create a Docker-based development environment for a Svelte frontend that automatically rebuilds on code changes and serves pages via HTTP.

## Implementation Plan

### 1. Initialize SvelteKit Project Structure

- Create `package.json` with SvelteKit dependencies and dev scripts
- Create `svelte.config.js` with basic SvelteKit configuration
- Create `vite.config.js` for Vite dev server configuration
- Set up basic project structure (`src/routes/`, `static/`, etc.)

### 2. Create Docker Configuration

- **Dockerfile**: Multi-stage build for development
- Base Node.js image
- Install dependencies
- Expose port (default 5173 for Vite dev server)
- Run dev server with hot-reload enabled

- **docker-compose.yml**: 
- Service definition for the Svelte frontend
- Volume mount for source code (enables auto-rebuild on save)
- Port mapping (host:container)
- Environment variables for dev mode

### 3. Create Supporting Files

- `.dockerignore` to exclude unnecessary files from Docker context
- `.gitignore` for Node.js and build artifacts
- Basic `src/routes/+page.svelte` as a starter page

### 4. Configuration Details

- **Port**: 5173 (Vite default) mapped to host port 5173
- **Hot Reload**: Enabled via Vite HMR and volume mounting
- **Auto-rebuild**: File watching enabled through volume mounts
- **Development Mode**: Uses `npm run dev` in container

## Files to Create

- `package.json`
- `svelte.config.js`
- `vite.config.js`
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `.gitignore`
- `src/routes/+page.svelte` (basic starter page)
- `src/app.html` (SvelteKit app template)

## Usage

After setup, run `docker-compose up` to start the dev server. Code changes will automatically trigger rebuilds.

## Mobile (iOS & Android) Packaging via Capacitor

### Overview
- Wrap the existing static Svelte build using Capacitor, so the same codebase powers iOS/Android WebViews.
- Use Capacitor plugins (e.g., Geolocation) to access native APIs when needed.

### Steps
1. **Install Capacitor tooling**
   ```bash
   npm install --save @capacitor/core @capacitor/cli
   npx cap init           # set webDir to \"build\"
   ```
2. **Add platforms**
   ```bash
   npx cap add ios
   npx cap add android
   ```
3. **Build workflow**
   - Run `BASE_PATH=/svelte npm run build` (or standard build if base is root).
   - `npx cap sync` copies the latest `build/` output into the native projects.
   - Open `ios/` in Xcode and `android/` in Android Studio to run/sign/publish.
4. **Using native features (example: Geolocation)**
   ```ts
   import { Geolocation } from '@capacitor/geolocation';

   async function getDeviceLocation() {
     const permissions = await Geolocation.checkPermissions();
     if (permissions.location !== 'granted') {
       await Geolocation.requestPermissions();
     }
     const pos = await Geolocation.getCurrentPosition();
     return pos.coords;
   }
   ```
   - Update `Info.plist` (iOS) with `NSLocationWhenInUseUsageDescription`.
   - Update `AndroidManifest.xml` with `ACCESS_FINE_LOCATION` / `ACCESS_COARSE_LOCATION`.

5. **Preview / Deployment**
   - `npx cap open ios` / `npx cap open android` for local testing.
   - Submit via standard App Store / Play Store processes once signed.

## Push Notifications (iOS & Android via Capacitor)

### Overview
Use Capacitor’s Push Notifications plugin to register the WebView app with APNs (iOS) and FCM (Android), then use those tokens in your backend or a third-party service to send messages.
> **Cost note:** Firebase Cloud Messaging is free for unlimited push delivery (no monthly fees) on both Android and iOS. You only pay if you add other Firebase paid services or exceed the free tier of ancillary products.

### Steps
1. **Install Capacitor Push plugin & notification library**
   ```bash
   npm install @capacitor/push-notifications
   npm install @capacitor/local-notifications   # optional: schedule on-device alerts
   npx cap sync
   ```
2. **Configure platforms**
   - **iOS**
     - In Xcode, enable Push Notifications & Background Modes (Remote notifications) for the target.
     - Upload your APNs key/cert to your backend provider (or Firebase if using FCM for iOS).
   - **Android**
     - Create a Firebase project; download `google-services.json` and place it under `android/app/`.
     - Update `android/build.gradle` & `android/app/build.gradle` with the Google Services plugin.
3. **Request permissions, register, and bind token**
   ```ts
   import { PushNotifications } from '@capacitor/push-notifications';

   async function sendTokenToBackend(token) {
     await fetch('https://api.example.com/push/register', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       credentials: 'include', // assumes auth cookie/session
       body: JSON.stringify({
         userId: currentUserId, // from your auth/session store
         platform: Capacitor.getPlatform(), // 'ios' or 'android'
         token
       })
     });
   }

   export async function initPush() {
     let permStatus = await PushNotifications.checkPermissions();
     if (permStatus.receive !== 'granted') {
       permStatus = await PushNotifications.requestPermissions();
     }
     if (permStatus.receive !== 'granted') {
       console.warn('Push permission not granted');
       return;
     }

     await PushNotifications.register();

     PushNotifications.addListener('registration', async (token) => {
       console.log('Device push token:', token.value);
       try {
         await sendTokenToBackend(token.value);
       } catch (err) {
         console.error('Failed to bind token', err);
       }
     });

     PushNotifications.addListener('pushNotificationReceived', (notification) => {
       console.log('Foreground push:', notification);
       // optionally show custom UI or local notification
     });

     PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
       console.log('Notification tapped', notification.actionId, notification.notification);
     });
   }
   ```
4. **Backend delivery**
   - Store tokens per user and use a push service (Firebase Cloud Messaging, OneSignal, or your own APNs server) to send notifications.
   - Example: store tokens in a relational table
     ```sql
     CREATE TABLE user_push_tokens (
       id SERIAL PRIMARY KEY,
       user_id UUID NOT NULL REFERENCES users(id),
       platform TEXT NOT NULL CHECK (platform IN ('ios','android')),
       token TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT now(),
       UNIQUE(user_id, token)
     );
     ```
   - Send to specific user:
     ```ts
     import { getMessaging } from 'firebase-admin/messaging';
     const messaging = getMessaging();

     async function sendPushToUser(userId, payload) {
       const tokens = await db('user_push_tokens')
         .select('token')
         .where({ user_id: userId });
       if (!tokens.length) return;

       await messaging.sendEachForMulticast({
         tokens: tokens.map((t) => t.token),
         notification: {
           title: payload.title,
           body: payload.body
         },
         data: payload.data ?? {}
       });
     }
     ```
   - For iOS via FCM, enable APNs key inside Firebase and use FCM’s HTTP v1 API.
5. **Testing**
   - Run on physical devices (simulators can’t receive APNs/FCM push).
   - Use Firebase console or your backend to send test messages; confirm `pushNotificationReceived` fires when app is foregrounded and `pushNotificationActionPerformed` fires when tapped from tray.

## Web Push Notifications (Browsers)

### Overview
- Use the Web Push API + service workers so the existing Svelte app can notify browsers even when inactive.
- Requires a VAPID key pair and HTTPS hosting.

### Steps
1. **Generate VAPID keys**
   ```bash
   npx web-push generate-vapid-keys
   ```
   Store the public key in your frontend bundle (e.g., env variable) and the private key on the server.

2. **Register service worker & subscribe**
   ```ts
   // In a Svelte component/layout on load
   if ('serviceWorker' in navigator && 'PushManager' in window) {
     const registration = await navigator.serviceWorker.register('/service-worker.js');

     const permission = await Notification.requestPermission();
     if (permission === 'granted') {
       const subscription = await registration.pushManager.subscribe({
         userVisibleOnly: true,
         applicationServerKey: VAPID_PUBLIC_KEY
       });

       await fetch('/api/push/web/subscribe', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         credentials: 'include',
         body: JSON.stringify({
           userId: currentUserId,
           subscription
         })
       });
     }
   }
   ```

3. **Service worker handlers (`src/service-worker.ts`)**
   ```js
   self.addEventListener('push', (event) => {
     const payload = event.data?.json() ?? {};
     event.waitUntil(
       self.registration.showNotification(payload.title || 'New update', {
         body: payload.body,
         icon: '/favicon.svg',
         data: payload
       })
     );
   });

   self.addEventListener('notificationclick', (event) => {
     event.notification.close();
     const url = event.notification.data?.url || '/svelte';
     event.waitUntil(clients.openWindow(url));
   });
   ```

4. **Backend delivery**
   ```ts
   import webpush from 'web-push';

   webpush.setVapidDetails(
     'mailto:admin@example.com',
     VAPID_PUBLIC_KEY,
     VAPID_PRIVATE_KEY
   );

   async function sendWebNotification(subscription, payload) {
     await webpush.sendNotification(subscription, JSON.stringify(payload));
   }
   ```
   - Store each subscription JSON alongside the user (similar to native tokens).
   - When targeting a user, load their active subscriptions and call `sendWebNotification` for each.

5. **Testing**
   - Serve the site over HTTPS (required for push).
   - Use Chrome/Firefox dev tools (Application → Service Workers) to simulate push payloads and verify notifications appear.

## Realtime Staff Tracking with Longdo Map (Mobile + Web)

### Overview
- Collect staff GPS coordinates from the Capacitor app, push them to your backend in real time, and render them on Longdo Map in the web console.
- References: [Longdo Map overview](https://map.longdo.com/docs/) and routing examples.

### Steps
1. **Obtain Longdo API key**
   - Register at [https://map.longdo.com/docs/javascript/getapi](https://map.longdo.com/docs/javascript/getapi) and whitelist your domains/hosts.

2. **Mobile: capture positions continuously**
   ```ts
   import { Geolocation } from '@capacitor/geolocation';

   async function startRealtimeTracking(staffId) {
     const perm = await Geolocation.requestPermissions();
     if (perm.location !== 'granted') return;

     const watchId = await Geolocation.watchPosition(
       { enableHighAccuracy: true, timeout: 10_000, maximumAge: 5_000 },
       (position, err) => {
         if (err || !position) return;
         fetch('https://api.example.com/tracking/update', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             staffId,
             lat: position.coords.latitude,
             lon: position.coords.longitude,
             timestamp: position.timestamp
           })
         });
       }
     );
     return () => Geolocation.clearWatch({ id: watchId });
   }
   ```
   - Consider batching updates or using WebSocket if you need sub-second accuracy.

3. **Backend streaming**
   - Store current coordinates in Redis / database.
   - Broadcast updates via WebSocket/SSE to the dispatcher dashboard:
     ```ts
     wss.on('connection', (socket) => {
       // send initial positions
       socket.send(JSON.stringify({ type: 'seed', staff: currentStaffPositions }));
     });

     async function handleStaffUpdate(payload) {
       await redis.hset('staff_locations', payload.staffId, JSON.stringify(payload));
       wss.clients.forEach((client) => {
         if (client.readyState === WebSocket.OPEN) {
           client.send(JSON.stringify({ type: 'update', data: payload }));
         }
       });
     }
     ```

4. **Web frontend: Longdo Map integration**
   ```html
   <script src="https://api.longdo.com/map/?key=YOUR_LONGDO_KEY"></script>
   <div id="map"></div>
   <script>
     const map = new longdo.Map({
       placeholder: document.getElementById('map'),
       layer: [longdo.Layers.GRAY, longdo.Layers.TRAFFIC]
     });

     const staffMarkers = new Map();

     function upsertMarker({ staffId, lat, lon }) {
       if (staffMarkers.has(staffId)) {
         staffMarkers.get(staffId).location({ lat, lon });
         return;
       }
       const marker = new longdo.Marker({ lat, lon }, {
         title: `Staff ${staffId}`,
         detail: 'Realtime location'
       });
       map.Overlays.add(marker);
       staffMarkers.set(staffId, marker);
     }

     const ws = new WebSocket('wss://api.example.com/tracking/socket');
     ws.onmessage = (event) => {
       const msg = JSON.parse(event.data);
       if (msg.type === 'seed') {
         msg.staff.forEach(upsertMarker);
       } else if (msg.type === 'update') {
         upsertMarker(msg.data);
       }
     };
   </script>
   ```

5. **Optional routing/driving directions**
   - Use Longdo RouteService to compute ETA between staff and customer:
     ```js
     async function fetchRoute(fLon, fLat, tLon, tLat) {
       const res = await fetch(`https://api.longdo.com/RouteService/json/route/guide?key=${LONGDO_KEY}&flon=${fLon}&flat=${fLat}&tlon=${tLon}&tlat=${tLat}`);
       return res.json();
     }
     ```
   - Display returned steps or polyline on the map using `map.Route`.

6. **Testing**
   - Simulate positions via device emulators or custom tooling.
   - Verify the dashboard updates instantly and check traffic overlays on Longdo Map (`longdo.Layers.TRAFFIC`).

### To-dos

- [x] Create package.json with SvelteKit dependencies and dev scripts
- [x] Create svelte.config.js and vite.config.js with development settings
- [x] Create Dockerfile for Node.js dev environment with hot-reload support
- [x] Create docker-compose.yml with volume mounts for auto-rebuild
- [x] Create .dockerignore, .gitignore, and basic SvelteKit project structure
- [x] Create basic src/routes/+page.svelte and src/app.html files