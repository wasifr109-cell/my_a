# 🚀 Codemagic.io Setup Guide - Telegram Downloader

## 📋 Overview
This guide will help you build your Telegram Downloader app using Codemagic.io's CI/CD platform.

---

## 🎯 Step 1: Prepare Your Project

### 1.1 Create a Git Repository

First, push your project to GitHub, GitLab, or Bitbucket:

```bash
# Initialize git if not already done
cd TelegramDownloader
git init

# Create .gitignore file
cat > .gitignore << EOF
# Node
node_modules/
npm-debug.log
yarn-error.log

# Android
android/.gradle
android/app/build/
android/build/
*.apk
*.aab

# iOS
ios/Pods/
ios/build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
EOF

# Add all files
git add .
git commit -m "Initial commit - Telegram Downloader"

# Create a repository on GitHub/GitLab/Bitbucket first, then:
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 1.2 Protect Your API Credentials

**IMPORTANT:** Never commit your API credentials!

Create a file `.env` in your project root:
```bash
TELEGRAM_API_ID=YOUR_API_ID
TELEGRAM_API_HASH=YOUR_API_HASH
```

Update your `App.js` to use environment variables:
```javascript
import Config from 'react-native-config';

// Replace these lines:
// const apiId = YOUR_API_ID;
// const apiHash = 'YOUR_API_HASH';

// With:
const apiId = Config.TELEGRAM_API_ID;
const apiHash = Config.TELEGRAM_API_HASH;
```

Install react-native-config:
```bash
npm install react-native-config
```

---

## 🔧 Step 2: Create Codemagic Configuration

### 2.1 Create `codemagic.yaml` in your project root:

```yaml
workflows:
  android-workflow:
    name: Android Workflow
    max_build_duration: 120
    instance_type: mac_mini_m1
    environment:
      android_signing:
        - telegram_downloader_keystore
      groups:
        - telegram_credentials
      vars:
        PACKAGE_NAME: "com.telegramdownloader"
      node: 16.20.0
    scripts:
      - name: Install npm dependencies
        script: |
          npm install
      
      - name: Set Android SDK location
        script: |
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      
      - name: Build Android APK
        script: |
          cd android
          ./gradlew assembleRelease
    
    artifacts:
      - android/app/build/outputs/**/*.apk
      - android/app/build/outputs/**/*.aab
    
    publishing:
      email:
        recipients:
          - your-email@example.com
        notify:
          success: true
          failure: true
```

---

## 🌐 Step 3: Sign Up and Configure Codemagic

### 3.1 Create Codemagic Account

1. Go to https://codemagic.io/
2. Click "Sign up for free"
3. Connect with GitHub/GitLab/Bitbucket
4. Authorize Codemagic to access your repositories

### 3.2 Add Your Application

1. Click "Add application"
2. Select your repository (TelegramDownloader)
3. Choose "React Native App"
4. Select the branch (usually `main` or `master`)

---

## 🔐 Step 4: Configure Environment Variables

### 4.1 Add Telegram API Credentials

1. In Codemagic dashboard, go to your app
2. Click "Environment variables"
3. Click "Add variable group"
4. Name it: `telegram_credentials`
5. Add these variables:
   - Variable name: `TELEGRAM_API_ID`
     - Value: Your API ID (e.g., 12345678)
     - Secure: ✅ (checked)
   - Variable name: `TELEGRAM_API_HASH`
     - Value: Your API Hash
     - Secure: ✅ (checked)

---

## 📱 Step 5: Android Code Signing (Optional but Recommended)

### 5.1 Generate Keystore (if you don't have one)

```bash
keytool -genkey -v -keystore telegram_downloader.keystore -alias telegram_key -keyalg RSA -keysize 2048 -validity 10000
```

Enter these details when prompted:
- Keystore password: (create a strong password)
- Key password: (same or different password)
- Your name, organization, etc.

### 5.2 Upload Keystore to Codemagic

1. In Codemagic dashboard, go to "Code signing identities"
2. Click "Android keystores"
3. Click "Upload keystore"
4. Upload your `telegram_downloader.keystore` file
5. Enter:
   - Keystore password
   - Key alias: `telegram_key`
   - Key password
6. Reference name: `telegram_downloader_keystore`

### 5.3 Configure build.gradle for Signing

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    
    signingConfigs {
        release {
            if (System.getenv()["CM_KEYSTORE_PATH"]) {
                storeFile file(System.getenv()["CM_KEYSTORE_PATH"])
                storePassword System.getenv()["CM_KEYSTORE_PASSWORD"]
                keyAlias System.getenv()["CM_KEY_ALIAS"]
                keyPassword System.getenv()["CM_KEY_PASSWORD"]
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## 🚀 Step 6: Start Your First Build

### 6.1 Trigger Build Manually

1. Go to your app in Codemagic
2. Click "Start new build"
3. Select branch: `main`
4. Select workflow: `android-workflow`
5. Click "Start new build"

### 6.2 Monitor Build Progress

- Watch the build logs in real-time
- Each step will show green ✅ when successful
- Build takes approximately 10-15 minutes

### 6.3 Download Your APK

Once build completes:
1. Go to "Builds" tab
2. Click on your completed build
3. Download the APK from "Artifacts" section
4. Install it on your Android device!

---

## 🔄 Step 7: Automatic Builds (Optional)

### 7.1 Configure Automatic Triggers

Add to your `codemagic.yaml`:

```yaml
workflows:
  android-workflow:
    name: Android Workflow
    triggering:
      events:
        - push
        - pull_request
      branch_patterns:
        - pattern: 'main'
          include: true
          source: true
      cancel_previous_builds: true
```

Now builds will trigger automatically when you push to `main`!

---

## 📊 Advanced Configuration

### Option 1: Build Both Debug and Release

```yaml
workflows:
  android-debug:
    name: Android Debug Build
    scripts:
      - name: Build Debug APK
        script: |
          cd android
          ./gradlew assembleDebug
    artifacts:
      - android/app/build/outputs/apk/debug/*.apk

  android-release:
    name: Android Release Build
    scripts:
      - name: Build Release APK
        script: |
          cd android
          ./gradlew assembleRelease
    artifacts:
      - android/app/build/outputs/apk/release/*.apk
```

### Option 2: Build AAB (Android App Bundle) for Play Store

```yaml
scripts:
  - name: Build AAB
    script: |
      cd android
      ./gradlew bundleRelease
artifacts:
  - android/app/build/outputs/bundle/**/*.aab
```

### Option 3: Run Tests Before Building

```yaml
scripts:
  - name: Run Tests
    script: |
      npm test
  - name: Build APK
    script: |
      cd android
      ./gradlew assembleRelease
```

---

## 🎯 Complete codemagic.yaml Example

Here's a production-ready configuration:

```yaml
workflows:
  android-production:
    name: Android Production Build
    max_build_duration: 120
    instance_type: mac_mini_m1
    
    environment:
      android_signing:
        - telegram_downloader_keystore
      groups:
        - telegram_credentials
      vars:
        PACKAGE_NAME: "com.telegramdownloader"
        VERSION_CODE: 1
        VERSION_NAME: "1.0.0"
      node: 16.20.0
    
    triggering:
      events:
        - push
      branch_patterns:
        - pattern: 'main'
          include: true
      cancel_previous_builds: true
    
    scripts:
      - name: Install dependencies
        script: |
          npm ci
      
      - name: Set up Android SDK
        script: |
          echo "sdk.dir=$ANDROID_SDK_ROOT" > "$CM_BUILD_DIR/android/local.properties"
      
      - name: Set version
        script: |
          cd android
          # Update version code and name in build.gradle if needed
      
      - name: Build Release APK
        script: |
          cd android
          ./gradlew assembleRelease
      
      - name: Build Release AAB
        script: |
          cd android
          ./gradlew bundleRelease
    
    artifacts:
      - android/app/build/outputs/**/*.apk
      - android/app/build/outputs/**/*.aab
    
    publishing:
      email:
        recipients:
          - your-email@example.com
        notify:
          success: true
          failure: true
      
      slack:
        channel: '#builds'
        notify_on_build_start: false
        notify:
          success: true
          failure: true
```

---

## 🐛 Troubleshooting

### Build Failed: "SDK not found"
**Solution:** Codemagic automatically provides Android SDK. Make sure your `codemagic.yaml` includes the SDK setup script.

### Build Failed: "Gradle error"
**Solution:**
```yaml
scripts:
  - name: Clean Gradle
    script: |
      cd android
      ./gradlew clean
      ./gradlew assembleRelease
```

### Build Failed: "Node modules not found"
**Solution:** Make sure `npm install` or `npm ci` is in your scripts.

### Environment Variables Not Working
**Solution:**
1. Check variable group name matches in `codemagic.yaml`
2. Ensure variables are marked as "Secure" if sensitive
3. Restart the build after adding variables

### Keystore Issues
**Solution:**
1. Verify keystore upload was successful
2. Check passwords are correct
3. Ensure key alias matches

---

## ✅ Checklist

Before starting your build, verify:

- [ ] Code is pushed to Git repository
- [ ] `.gitignore` excludes sensitive files
- [ ] `codemagic.yaml` is in project root
- [ ] Telegram API credentials added to Codemagic
- [ ] Keystore uploaded (for signed builds)
- [ ] Repository connected to Codemagic
- [ ] Workflow selected in Codemagic

---

## 📚 Resources

- **Codemagic Docs:** https://docs.codemagic.io/
- **React Native on Codemagic:** https://docs.codemagic.io/react-native/react-native-getting-started/
- **YAML Configuration:** https://docs.codemagic.io/yaml/yaml-getting-started/
- **Code Signing:** https://docs.codemagic.io/code-signing/android-code-signing/

---

## 🎉 Success!

Once your build completes:
1. Download the APK from Codemagic
2. Transfer to your Android device
3. Install and enjoy your app!

**Future builds will be automatic** - just push your code and Codemagic handles the rest! 🚀
