# Telegram Downloader App - Complete Setup Guide

## 🎯 Features
- ✅ Shows all your Telegram chats and channels
- ✅ Browse messages, photos, and videos in each chat
- ✅ Download media with one tap
- ✅ Automatic numbering (1_VideoName.mp4, 2_PhotoName.jpg, etc.)
- ✅ Files saved in order with message text as filename
- ✅ Organized downloads by chat/channel name
- ✅ Works completely on your phone

## 📋 Prerequisites

Before starting, you need:

1. **Node.js** (v16 or higher)
2. **React Native development environment** set up
3. **Android Studio** (for Android development)
4. **Telegram API Credentials**

## 🔑 Step 1: Get Telegram API Credentials

1. Go to https://my.telegram.org
2. Log in with your phone number
3. Click on "API development tools"
4. Create a new application
5. You'll get:
   - `api_id` (a number like 12345678)
   - `api_hash` (a string like 'abcdef1234567890')
6. **Save these credentials!**

## 🛠️ Step 2: Install Development Tools

### For Windows:

1. **Install Node.js:**
   - Download from https://nodejs.org/
   - Install the LTS version
   - Verify: Open Command Prompt and type `node --version`

2. **Install Android Studio:**
   - Download from https://developer.android.com/studio
   - During installation, make sure to install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device
   - Set up ANDROID_HOME environment variable

3. **Install React Native CLI:**
   ```bash
   npm install -g react-native-cli
   ```

### For Mac:

1. **Install Homebrew:**
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js:**
   ```bash
   brew install node
   brew install watchman
   ```

3. **Install React Native CLI:**
   ```bash
   npm install -g react-native-cli
   ```

4. **Install Android Studio** (same as Windows)

## 📱 Step 3: Set Up the Project

1. **Create a new React Native project:**
   ```bash
   npx react-native init TelegramDownloader
   cd TelegramDownloader
   ```

2. **Install dependencies:**
   ```bash
   npm install telegram@2.22.2
   npm install react-native-fs@2.20.0
   npm install big-integer buffer stream-browserify crypto-browserify
   ```

3. **Configure Metro bundler** - Create/edit `metro.config.js`:
   ```javascript
   const {getDefaultConfig} = require('metro-config');

   module.exports = (async () => {
     const {
       resolver: {sourceExts, assetExts},
     } = await getDefaultConfig();
     return {
       transformer: {
         getTransformOptions: async () => ({
           transform: {
             experimentalImportSupport: false,
             inlineRequires: true,
           },
         }),
       },
       resolver: {
         extraNodeModules: {
           crypto: require.resolve('crypto-browserify'),
           stream: require.resolve('stream-browserify'),
           buffer: require.resolve('buffer'),
         },
       },
     };
   })();
   ```

4. **Link react-native-fs:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

## 🔧 Step 4: Configure the App

1. **Replace App.js** with the provided code

2. **Update your API credentials in App.js:**
   ```javascript
   const apiId = YOUR_API_ID; // Replace with your actual API ID (number)
   const apiHash = 'YOUR_API_HASH'; // Replace with your actual API Hash (string)
   ```

3. **Copy the AndroidManifest.xml** to:
   ```
   android/app/src/main/AndroidManifest.xml
   ```

## 🚀 Step 5: Run the App

### On Physical Android Device:

1. **Enable Developer Mode on your phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect your phone to computer via USB**

3. **Verify device connection:**
   ```bash
   adb devices
   ```
   You should see your device listed

4. **Run the app:**
   ```bash
   npx react-native run-android
   ```

### On Android Emulator:

1. **Open Android Studio**
2. **Open AVD Manager** (Android Virtual Device)
3. **Create a new virtual device** or start an existing one
4. **Run the app:**
   ```bash
   npx react-native run-android
   ```

## 📖 How to Use the App

### First Time Setup:

1. **Enter your phone number** (with country code, e.g., +1234567890)
2. **Click "Send Code"**
3. **Check your Telegram app** for the verification code
4. **Enter the code** in the app
5. **Click "Verify"**

### Downloading Media:

1. **Select a chat or channel** from the list
2. **Browse the messages** - you'll see photos, videos, and files
3. **Tap the download button** on any media
4. **Files are saved to:**
   ```
   /storage/emulated/0/Download/TelegramDownloads/[ChatName]/
   ```

### File Naming:

Files are automatically named as:
- `1_Message Text.mp4` - First video
- `2_Another Message.jpg` - Second photo
- `3_File Name.pdf` - Third document
- And so on...

## 🔍 Troubleshooting

### Common Issues:

1. **"Metro bundler error"**
   ```bash
   npx react-native start --reset-cache
   ```

2. **"ANDROID_HOME not set"**
   - Windows: Set environment variable to Android SDK location
   - Mac: Add to `~/.bash_profile` or `~/.zshrc`:
     ```bash
     export ANDROID_HOME=$HOME/Library/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/emulator
     export PATH=$PATH:$ANDROID_HOME/tools
     export PATH=$PATH:$ANDROID_HOME/tools/bin
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     ```

3. **"Unable to load script"**
   ```bash
   adb reverse tcp:8081 tcp:8081
   npx react-native start
   ```

4. **Storage permission denied**
   - Manually grant storage permissions in phone Settings → Apps → TelegramDownloader → Permissions

5. **"Invalid API credentials"**
   - Double-check your api_id and api_hash from https://my.telegram.org
   - Make sure api_id is a number (no quotes)
   - Make sure api_hash is a string (with quotes)

## 📂 Project Structure

```
TelegramDownloader/
├── App.js                 # Main application code
├── package.json          # Dependencies
├── metro.config.js       # Metro bundler configuration
├── android/
│   └── app/
│       └── src/
│           └── main/
│               └── AndroidManifest.xml
└── ios/                  # iOS files (optional)
```

## 🔒 Security Notes

1. **Never share your API credentials**
2. **Never commit API credentials to Git**
3. **Store session data securely**
4. **Enable 2FA on your Telegram account**

## 📝 Features Explained

### Download Counter
- Automatically increments for each download in a chat
- Resets when you switch to a different chat
- Ensures files are numbered in the order you download them

### File Organization
- Creates a folder for each chat/channel
- All files from that chat are stored together
- Easy to find and manage downloaded content

### Filename Generation
- Uses the message text as the filename
- Removes invalid characters
- Limits filename length to 100 characters
- Adds appropriate file extensions

## 🎨 Customization

You can modify these in `App.js`:

1. **Download location:**
   ```javascript
   const downloadPath = `${RNFS.DownloadDirectoryPath}/TelegramDownloads/${selectedChat.name}`;
   ```

2. **Number of messages loaded:**
   ```javascript
   const result = await client.getMessages(chat.entity, {
     limit: 100,  // Change this number
   });
   ```

3. **Number of chats loaded:**
   ```javascript
   const result = await client.getDialogs({
     limit: 100,  // Change this number
   });
   ```

## 📱 Build Release APK

To create an installable APK:

1. **Generate a signing key:**
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Place the keystore file in `android/app/`**

3. **Edit `android/app/build.gradle`:**
   ```gradle
   signingConfigs {
       release {
           storeFile file('my-release-key.keystore')
           storePassword 'your-password'
           keyAlias 'my-key-alias'
           keyPassword 'your-password'
       }
   }
   ```

4. **Build the APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. **Find your APK at:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

6. **Install on your phone** by copying the APK and opening it

## 🆘 Support

If you encounter issues:

1. Check the React Native troubleshooting guide
2. Verify all dependencies are installed correctly
3. Make sure your API credentials are correct
4. Check Android Studio logs for errors
5. Try cleaning and rebuilding:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

## 📚 Additional Resources

- React Native Documentation: https://reactnative.dev/
- Telegram API Documentation: https://core.telegram.org/
- GramJS (Telegram library): https://github.com/gram-js/gramjs

## ⚖️ Legal Notice

This app is for personal use only. Make sure you comply with:
- Telegram's Terms of Service
- Copyright laws in your jurisdiction
- Privacy regulations when downloading content

---

**Enjoy your Telegram Downloader App! 📲**
