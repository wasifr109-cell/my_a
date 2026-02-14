# 🚀 Quick Start Guide - Telegram Downloader

## ⚡ Fast Track Setup (30 minutes)

### Step 1: Get API Credentials (5 minutes)
1. Visit: https://my.telegram.org
2. Login with your phone number
3. Go to "API development tools"
4. Create new application
5. **COPY THESE:**
   - API ID: (a number)
   - API Hash: (a long string)

### Step 2: Install Prerequisites (10 minutes)

**Windows:**
```bash
# Install Node.js from https://nodejs.org/
# Install Android Studio from https://developer.android.com/studio

# Then run:
npm install -g react-native-cli
```

**Mac:**
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node
brew install node watchman

# Install React Native CLI
npm install -g react-native-cli

# Install Android Studio from https://developer.android.com/studio
```

### Step 3: Create Project (10 minutes)

```bash
# Create new project
npx react-native init TelegramDownloader
cd TelegramDownloader

# Install all dependencies
npm install telegram@2.22.2 react-native-fs@2.20.0 big-integer buffer stream-browserify crypto-browserify

# Copy the provided files:
# - App.js (main app code)
# - metro.config.js (configuration)
# - AndroidManifest.xml (to android/app/src/main/)
```

### Step 4: Configure API Credentials (2 minutes)

Open `App.js` and replace:
```javascript
const apiId = YOUR_API_ID;  // Replace with your number (no quotes!)
const apiHash = 'YOUR_API_HASH';  // Replace with your string (with quotes!)
```

Example:
```javascript
const apiId = 12345678;  // Your actual API ID
const apiHash = 'abcdef1234567890abcdef';  // Your actual API Hash
```

### Step 5: Run on Phone (5 minutes)

**Connect your Android phone:**
1. Enable Developer Mode (Settings → About → Tap Build Number 7 times)
2. Enable USB Debugging (Settings → Developer Options)
3. Connect via USB cable

**Run the app:**
```bash
# Check phone is connected
adb devices

# Run the app
npx react-native run-android
```

### Step 6: First Login (2 minutes)

1. App opens → Enter your phone number (with country code)
2. Click "Send Code"
3. Open Telegram app → Get the code
4. Enter code in the app
5. Done! You're in!

---

## 🎯 Using the App

### Download Media:
1. **See all chats** → Tap a chat/channel
2. **Browse messages** → Tap download button on any photo/video
3. **Find downloads** → `/Download/TelegramDownloads/[ChatName]/`

### Files are named as:
- `1_MessageText.mp4`
- `2_AnotherMessage.jpg`
- `3_DocumentName.pdf`

---

## 🆘 Quick Troubleshooting

### "Can't connect to development server"
```bash
adb reverse tcp:8081 tcp:8081
npx react-native start --reset-cache
```

### "Permission denied" for downloads
- Phone Settings → Apps → TelegramDownloader → Permissions → Enable Storage

### "Invalid API credentials"
- Double-check your API ID (number, no quotes)
- Double-check your API Hash (string, with quotes)
- Make sure you copied them correctly from my.telegram.org

### Metro bundler not starting
```bash
npx react-native start --reset-cache
# In another terminal:
npx react-native run-android
```

---

## 📱 Important Notes

✅ **Works on:** Android 5.0+
✅ **Storage:** Uses phone's Download folder
✅ **Security:** Your data stays on your phone
✅ **No limits:** Download as much as you want

⚠️ **Remember:**
- Get your own API credentials (don't share them!)
- Grant storage permissions
- Keep USB debugging enabled while developing
- Use for personal content only

---

## 🎉 You're Ready!

Once you see the login screen, you're all set! The app works completely on your phone - no servers, no cloud, everything local.

**Next steps:**
1. Read the full README.md for advanced features
2. Customize download location if needed
3. Build a release APK to install on other phones

**Have fun downloading! 📲**
