# 🔧 Focus Lock macOS App - Troubleshooting Guide

## 🎯 **Quick Fixes for Common Issues:**

### **1. White Screen Issue (FIXED!)**
**Problem**: App launches but shows a white screen
**Solution**: ✅ **FIXED** - Updated main.js to load the correct HTML file

### **2. App Won't Launch**
**Problem**: Double-clicking doesn't open the app
**Solutions**:
```bash
# Remove quarantine attribute
xattr -d com.apple.quarantine "/Applications/Focus Lock.app"

# Or try launching from terminal
open "/Applications/Focus Lock.app"
```

### **3. Permission Errors**
**Problem**: App blocking doesn't work
**Solution**: Grant required permissions in System Preferences:
1. **System Preferences** → **Security & Privacy** → **Privacy**
2. **Accessibility**: Add Focus Lock
3. **Full Disk Access**: Add Focus Lock
4. Restart the app

### **4. Website Blocking Not Working**
**Problem**: Websites still accessible during focus sessions
**Solutions**:
```bash
# Check hosts file
sudo nano /etc/hosts

# Look for lines like:
# 127.0.0.1 facebook.com
# 127.0.0.1 instagram.com

# Flush DNS cache
sudo dscacheutil -flushcache
```

### **5. App Keeps Crashing**
**Problem**: App crashes on launch
**Solutions**:
```bash
# Check for error logs
tail -f ~/Library/Logs/Focus\ Lock/main.log

# Reset app data
rm -rf ~/Library/Application\ Support/Focus\ Lock

# Reinstall the app
```

## 🚀 **Testing Your App:**

### **Quick Test Commands:**
```bash
# Test app bundle directly
open "/Users/moha/Desktop/Desktop - macheight PRO/Cursor/student-productivity-tools/electron-app/dist/mac/Focus Lock.app"

# Test development version
cd "/Users/moha/Desktop/Desktop - macheight PRO/Cursor/student-productivity-tools/electron-app"
npm start

# Rebuild if needed
npm run build-mac
```

### **Expected Behavior:**
1. ✅ **App launches** with Focus Lock interface
2. ✅ **Task input field** is visible and functional
3. ✅ **Focus mode buttons** are clickable
4. ✅ **App blocking list** shows with toggle buttons
5. ✅ **Start button** becomes enabled when task is entered
6. ✅ **Lock screen** appears when session starts

## 🛠️ **Development Commands:**

### **Rebuild the App:**
```bash
cd "/Users/moha/Desktop/Desktop - macheight PRO/Cursor/student-productivity-tools/electron-app"
npm run build-mac
```

### **Run in Development Mode:**
```bash
npm start
```

### **Clean Build:**
```bash
npm run clean
npm install
npm run build-mac
```

## 📱 **App Features Test Checklist:**

### **Basic Functionality:**
- [ ] App launches successfully
- [ ] Task input field works
- [ ] Focus mode selection works
- [ ] App blocking configuration works
- [ ] Start button becomes enabled with task input

### **Focus Session:**
- [ ] Lock screen appears when session starts
- [ ] Timer counts down correctly
- [ ] Pause/Resume button works
- [ ] Stop button works
- [ ] Progress circle updates

### **App Blocking (Desktop Only):**
- [ ] Apps are killed when session starts
- [ ] Websites are blocked in hosts file
- [ ] Blocked apps stay blocked during session
- [ ] Apps are restored when session ends

## 🔍 **Debug Information:**

### **Check App Status:**
```bash
# Check if app is running
ps aux | grep "Focus Lock"

# Check app bundle contents
ls -la "/Applications/Focus Lock.app/Contents/"

# Check app logs
tail -f ~/Library/Logs/Focus\ Lock/main.log
```

### **System Information:**
```bash
# macOS version
sw_vers

# Architecture
uname -m

# Available disk space
df -h
```

## 🆘 **If Nothing Works:**

### **Complete Reset:**
```bash
# Remove app completely
rm -rf "/Applications/Focus Lock.app"

# Clean all data
rm -rf ~/Library/Application\ Support/Focus\ Lock
rm -rf ~/Library/Logs/Focus\ Lock
rm -rf ~/Library/Preferences/com.mohammad.focus-lock.plist

# Rebuild from source
cd "/Users/moha/Desktop/Desktop - macheight PRO/Cursor/student-productivity-tools/electron-app"
npm run clean
npm install
npm run build-mac

# Reinstall
./install-mac-app.sh
```

## 📞 **Getting Help:**

### **Check These First:**
1. **macOS Version**: App requires macOS 10.12+
2. **Architecture**: Supports both Intel and Apple Silicon
3. **Permissions**: All required permissions granted
4. **Disk Space**: At least 100MB free space

### **Error Messages to Look For:**
- `ERR_FILE_NOT_FOUND`: App can't find required files
- `Permission denied`: Need to grant system permissions
- `Code signing error`: App not properly signed (normal for development)

## ✅ **Success Indicators:**

Your app is working correctly when:
- ✅ App launches without errors
- ✅ Interface loads completely (not white screen)
- ✅ All buttons and inputs are functional
- ✅ Focus sessions start and run properly
- ✅ App blocking works (if permissions granted)
- ✅ Sessions can be paused, resumed, and stopped

---

**🎉 If all tests pass, your Focus Lock macOS app is working perfectly!**
