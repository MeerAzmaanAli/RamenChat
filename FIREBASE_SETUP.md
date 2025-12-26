# Firebase Setup Instructions

## Firestore Security Rules Setup

You're getting a "Missing or insufficient permissions" error because Firestore security rules need to be configured. Follow these steps:

### Step 1: Go to Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project: **ramenchat-28f43**

### Step 2: Navigate to Firestore Rules
1. Click on "Firestore Database" in the left sidebar
2. Click on the "Rules" tab

### Step 3: Add Security Rules
Copy and paste the following rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - authenticated users can read any user, but only update their own
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
    }
    
    // UserChats collection - users can read/write their own chats
    // Also allow users to add chats to other users' userChats (for starting new conversations)
    match /userChats/{userId} {
      allow read: if request.auth != null;
      // Users can write to their own userChats
      allow write: if request.auth != null && request.auth.uid == userId;
      // Users can also update other users' userChats to add new chat entries (using arrayUnion)
      allow update: if request.auth != null;
    }
    
    // Chats collection - authenticated users can read/write
    match /chats/{chatId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Step 4: Publish Rules
1. Click "Publish" button
2. Wait for the confirmation message

## Firebase Storage Rules Setup

You'll also need to configure Storage rules for image uploads:

### Step 1: Navigate to Storage Rules
1. Click on "Storage" in the left sidebar
2. Click on the "Rules" tab

### Step 2: Add Storage Rules
Use these rules:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /images/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

### Step 3: Publish Rules
Click "Publish"

## Environment Variables

Make sure you have a `.env` file in your project root with:

```
VITE_API_KEY=your_firebase_api_key_here
```

To get your API key:
1. Go to Firebase Console → Project Settings
2. Under "Your apps" section, find your web app
3. Copy the `apiKey` value
4. Add it to your `.env` file

## Testing

After setting up the rules:
1. Try signing in again
2. The error should be resolved

**Note**: For development, you can use more permissive rules, but for production, use stricter rules that verify user ownership.

