# 🔨 Build APK - Soroban Math App

## Phương pháp 1: EAS Build (Khuyến nghị)

### Bước 1: Tạo tài khoản Expo
1. Đi tới https://expo.dev/
2. Tạo tài khoản miễn phí
3. Verify email

### Bước 2: Build APK
```bash
cd mobile

# Login vào Expo
npx eas login

# Build APK preview
npx eas build --platform android --profile preview
```

### Bước 3: Download APK
- Sau khi build xong (~10-15 phút), bạn sẽ nhận được link download APK
- Tải APK về và cài đặt trên Android

## Phương pháp 2: Local Build (Cần Android Studio)

### Prerequisites:
1. Cài đặt Android Studio
2. Cài đặt JDK 17
3. Setup ANDROID_HOME environment variable

### Bước build:
```bash
cd mobile

# Create development build
npx expo run:android --variant release
```

## Phương pháp 3: PWA Build (Web-based APK)

### Tạo PWA version:
```bash
cd mobile

# Build web version
npx expo export:web

# Sử dụng PWABuilder.com để convert thành APK
# 1. Upload build folder lên hosting (Netlify/Vercel)
# 2. Đi tới https://www.pwabuilder.com/
# 3. Nhập URL và download APK
```

## File APK sẽ có:

### Tính năng đầy đủ:
- ✅ Home screen với 3 cấp độ
- ✅ Settings (số câu, thời gian, âm thanh)
- ✅ Game screen với Soroban display
- ✅ Timer countdown
- ✅ Results với thống kê chi tiết
- ✅ Native Android UI

### Thông tin APK:
- **Package name**: com.sorobanmath.app
- **App name**: Soroban Math
- **Version**: 1.0.0
- **Target SDK**: Android 10+
- **Size**: ~50-80MB

## Troubleshooting:

### EAS Build errors:
```bash
# Clear cache
npx expo start --clear

# Update dependencies
npx expo install --fix

# Retry build
npx eas build --platform android --profile preview --clear-cache
```

### Local build errors:
```bash
# Clean project
cd android && ./gradlew clean

# Rebuild
npx expo run:android --variant release
```

## Quick Commands:

```bash
# 🚀 Cách nhanh nhất - EAS Build
cd mobile
npx eas login
npx eas build --platform android --profile preview

# 📱 Development test
npx expo start
# Scan QR với Expo Go app

# 🔧 Local build (nếu có Android Studio)
npx expo run:android --variant release
```

## APK Distribution:

Sau khi có APK file:
1. **Direct install**: Copy APK vào điện thoại và cài đặt
2. **Share via link**: Upload lên Google Drive/Dropbox và share
3. **Google Play Store**: Upload lên Play Console (cần account $25)
4. **Internal testing**: Chia sẻ với nhóm test users

Chọn phương pháp nào phù hợp với bạn nhất!