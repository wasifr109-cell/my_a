# ⚡ QUICK START CHECKLIST - Codemagic Setup

## ✅ Complete These Steps in Order

### 1️⃣ PREPARE YOUR PROJECT (5 minutes)
```bash
cd TelegramDownloader

# Copy the .gitignore file
cp /path/to/.gitignore .

# Copy the codemagic.yaml file  
cp /path/to/codemagic.yaml .

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"
```

### 2️⃣ CREATE GITHUB REPOSITORY (2 minutes)
- Go to https://github.com/new
- Create new repository named "TelegramDownloader"
- DO NOT initialize with README (you already have files)
- Copy the repository URL

```bash
# Push your code
git remote add origin YOUR_GITHUB_URL
git branch -M main
git push -u origin main
```

### 3️⃣ SIGN UP FOR CODEMAGIC (3 minutes)
1. Visit: https://codemagic.io/signup
2. Click "Sign up with GitHub"
3. Authorize Codemagic
4. You'll be redirected to dashboard

### 4️⃣ ADD YOUR APP (2 minutes)
1. Click "Add application"
2. Select "GitHub"
3. Find "TelegramDownloader" repository
4. Click "Select" → "Finish: Add application"

### 5️⃣ CONFIGURE ENVIRONMENT VARIABLES (5 minutes)

**CRITICAL STEP - Your API Credentials:**

1. In Codemagic, click your app
2. Go to "Environment variables" (left sidebar)
3. Click "Add variable group"
4. Name: `telegram_credentials`
5. Click "Add variable" and add these TWO variables:

   **Variable 1:**
   - Variable name: `TELEGRAM_API_ID`
   - Value: YOUR_API_ID (e.g., 12345678)
   - ✅ Check "Secure"
   - Click "Add"

   **Variable 2:**
   - Variable name: `TELEGRAM_API_HASH`
   - Value: YOUR_API_HASH (e.g., abcdef123456)
   - ✅ Check "Secure"
   - Click "Add"

6. Click "Save changes"

### 6️⃣ UPDATE YOUR EMAIL (1 minute)
Edit `codemagic.yaml` in your repository:

```yaml
publishing:
  email:
    recipients:
      - your-actual-email@gmail.com  # ← Change this!
```

Commit and push:
```bash
git add codemagic.yaml
git commit -m "Update email"
git push
```

### 7️⃣ START YOUR FIRST BUILD (2 minutes)
1. In Codemagic, go to "Builds" tab
2. Click "Start new build"
3. Select branch: `main`
4. Select workflow: `android-workflow`
5. Click "Start new build"
6. ☕ Wait 10-15 minutes for build to complete

### 8️⃣ DOWNLOAD YOUR APK (1 minute)
1. When build shows green ✅
2. Click on the build
3. Scroll to "Artifacts" section
4. Click download icon next to `.apk` file
5. Transfer to your Android phone and install!

---

## 🎯 That's It!

From now on, every time you push code to GitHub, Codemagic will automatically build a new APK!

---

## ⚠️ IMPORTANT NOTES

**BEFORE First Build:**
- [ ] GitHub repository is public OR Codemagic has access to private repos
- [ ] Both API credentials are added to Codemagic (not in code!)
- [ ] Email address is updated in codemagic.yaml
- [ ] codemagic.yaml is in the ROOT of your repository

**Common Issues:**
- **Build fails immediately:** Check environment variables are set
- **"SDK not found":** This is normal, Codemagic provides it automatically
- **Build takes >20 min:** Normal for first build, faster afterwards
- **No email received:** Check spam folder or update email in yaml

---

## 🚀 NEXT STEPS

After successful build:
1. Install APK on your phone
2. Test the app thoroughly
3. Make changes to your code
4. Push to GitHub → Automatic new build!

**Optional - Code Signing:**
If you want to publish to Play Store later, follow the "Android Code Signing" section in the full guide.

---

## 📞 Need Help?

Check the full guide: `CODEMAGIC_SETUP.md`

Or search: "Codemagic React Native" on Google

Good luck! 🎉
