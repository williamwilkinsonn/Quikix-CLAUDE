# Quikix — Expo React Native App with Firebase

A cross-platform mobile app built with [Expo](https://expo.dev) and [Firebase](https://firebase.google.com).

## Features

- 🔐 Firebase Authentication (Email/Password)
- 🗄️ Firestore database integration (real-time listeners)
- 🧭 React Navigation (bottom tabs + auth stack)
- 📁 Projects management (create, list, delete)
- 💬 Conversations module
- 👤 User profile screen
- 📱 Works on iOS, Android, and Web

---

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- A [Firebase](https://firebase.google.com) project (free Spark plan works)
- [Expo Go](https://expo.dev/client) app on your phone (for quick testing)

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/williamwilkinsonn/Quikix-CLAUDE.git
cd Quikix-CLAUDE
npm install
```

### 2. Run the app

```bash
npx expo start
```

- Press **i** for iOS Simulator
- Press **a** for Android Emulator
- Scan the QR code with **Expo Go** on your phone

> **Firebase is pre-configured** — the app connects to the `quikix-app` Firebase project out of the box.
> No `.env` file is required to get started.

#### Using a different Firebase project

If you want to connect to your own Firebase project:

1. Copy the example env file: `cp .env.example .env`
2. Replace the values in `.env` with credentials from your Firebase Console
3. Restart the Metro bundler: `npx expo start --clear`

---

## Project Structure

```
Quikix-CLAUDE/
├── App.tsx                     # Entry point — wraps app in AuthProvider
├── app.json                    # Expo configuration
├── package.json
├── tsconfig.json
├── babel.config.js
├── .env.example                # Environment variable template
└── src/
    ├── config/
    │   └── firebase.ts         # Firebase initialization
    ├── context/
    │   └── AuthContext.tsx     # Auth state provider & useAuth() hook
    ├── navigation/
    │   ├── index.tsx           # Root navigator (auth vs app)
    │   ├── AuthNavigator.tsx   # Login / Sign Up stack
    │   └── AppNavigator.tsx    # Bottom tab navigator
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   └── SignUpScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── ProjectsScreen.tsx
    │   ├── ConversationsScreen.tsx
    │   └── ProfileScreen.tsx
    ├── services/
    │   ├── auth.ts             # Firebase Auth helpers
    │   └── firestore.ts        # Firestore CRUD + real-time listeners
    ├── components/
    │   └── LoadingScreen.tsx
    └── types/
        └── index.ts            # Shared TypeScript types
```

---

## Firestore Data Model

| Collection      | Document fields |
|-----------------|-----------------|
| `users`         | `uid`, `email`, `displayName`, `photoURL`, `createdAt` |
| `projects`      | `ownerUid`, `title`, `description`, `status`, `createdAt` |
| `conversations` | `participants[]`, `title`, `lastMessage`, `createdAt`, `updatedAt` |

---

## Firestore Security Rules (recommended)

Paste these into **Firebase Console → Firestore → Rules** before going to production:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Projects are scoped to their owner
    match /projects/{projectId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.ownerUid;
      allow create: if request.auth != null;
    }

    // Conversations: only participants can access
    match /conversations/{convId} {
      allow read, write: if request.auth != null
        && request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
    }
  }
}
```

---

## Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Configure EAS build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FIREBASE_API_KEY` | Web API key from Firebase Console |
| `FIREBASE_AUTH_DOMAIN` | `<project-id>.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_STORAGE_BUCKET` | `<project-id>.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Cloud Messaging sender ID |
| `FIREBASE_APP_ID` | Web app ID |
| `FIREBASE_MEASUREMENT_ID` | Google Analytics measurement ID (optional) |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Firebase: Error (auth/invalid-api-key)` | Check `.env` values match Firebase Console exactly |
| Metro bundler crash | Run `npx expo start --clear` to clear cache |
| Firestore `permission-denied` | Enable Firestore and set rules in Firebase Console |
| `Cannot find module '@/...'` | Ensure `tsconfig.json` paths are configured (already done) |

---

## License

MIT
