# Hướng dẫn Setup và Build APK - Soroban Math App

## Bước 1: Cài đặt môi trường phát triển

### Cài đặt Node.js và Expo CLI
```bash
# Cài đặt Node.js (version 16+)
# Tải từ https://nodejs.org/

# Cài đặt Expo CLI
npm install -g @expo/cli
```

### Cài đặt Expo Go trên điện thoại
- Android: Tải từ Google Play Store
- iOS: Tải từ App Store

## Bước 2: Setup dự án

### Di chuyển vào thư mục mobile
```bash
cd mobile
```

### Cài đặt dependencies
```bash
npm install
```

### Chạy ứng dụng để test
```bash
# Khởi động Expo development server
npm start

# Hoặc chỉ định platform
npm run android  # Chỉ Android
npm run ios      # Chỉ iOS
```

### Test trên điện thoại
1. Mở Expo Go app
2. Scan QR code từ terminal/browser
3. App sẽ tự động tải và chạy

## Bước 3: Build APK cho production

### Phương pháp 1: Sử dụng Expo Application Services (EAS)

#### Cài đặt EAS CLI
```bash
npm install -g eas-cli
```

#### Đăng ký/đăng nhập Expo
```bash
# Tạo account tại https://expo.dev/
eas login
```

#### Cấu hình build
```bash
# Tạo eas.json config
eas build:configure
```

#### Build APK
```bash
eas build --platform android --profile preview# Build cho Android


# Build cho cả Android và iOS
eas build --platform all
```

### Phương pháp 2: Local build (cần Android Studio)

#### Cài đặt Android Studio
1. Tải Android Studio từ https://developer.android.com/studio
2. Cài đặt Android SDK
3. Thiết lập ANDROID_HOME environment variable

#### Build local APK
```bash
# Tạo native Android project
expo run:android --variant release
```

## Bước 4: Tùy chỉnh ứng dụng

### Cập nhật app.json
```json
{
  "expo": {
    "name": "Tên App Của Bạn",
    "slug": "ten-app-cua-ban",
    "version": "1.0.0",
    "android": {
      "package": "com.yourcompany.sorobanmath",
      "versionCode": 1
    }
  }
}
```

### Tạo icons
1. Tạo icon.png (1024x1024)
2. Tạo splash.png (1242x2436) 
3. Đặt vào thư mục assets/

### Cập nhật màu sắc và styling
- Chỉnh sửa trong các file StyleSheet
- Thay đổi theme colors trong styles objects

## Bước 5: Test và Debug

### Test trên thiết bị thật
```bash
# Development build
expo start --dev-client

# Production build test
expo start --no-dev --minify
```

### Debug common issues
- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo SDK: `npx expo install --fix`

## Bước 6: Distribution

### Google Play Store
1. Tạo Google Play Developer account ($25)
2. Upload APK/AAB file từ EAS build
3. Hoàn thành store listing
4. Submit for review

### Side-loading APK
1. Download APK từ EAS build dashboard
2. Enable "Unknown sources" trên Android
3. Install APK file trực tiếp

## Cấu trúc code chính

### App.tsx - Main Navigator
- Định nghĩa navigation structure
- Type definitions cho routes
- Main app wrapper

### Screens:
- **HomeScreen**: Chọn độ khó
- **SettingsScreen**: Cài đặt game
- **GameScreen**: Chơi game với timer
- **ResultsScreen**: Hiển thị kết quả chi tiết

### Components:
- **SorobanDisplay**: Hiển thị bàn tính với beads màu
- **Timer**: Countdown timer với progress bar

## Troubleshooting

### Build errors:
```bash
# Clear Expo cache
expo start -c

# Reset Metro bundler
npx expo start --clear

# Reinstall node modules
rm -rf node_modules && npm install
```

### Runtime errors:
- Check console trong Expo Go app
- Đảm bảo tất cả imports đúng
- Kiểm tra async operations

### APK không install:
- Kiểm tra Android version compatibility
- Ensure proper package naming
- Verify signing configuration

## Performance Tips

### Optimize bundle size:
- Sử dụng động imports cho large components
- Remove unused dependencies
- Enable Hermes engine

### Improve user experience:
- Add loading states
- Implement error boundaries
- Use proper keyboard handling

## Liên hệ và Support

Nếu gặp vấn đề:
1. Check Expo documentation: https://docs.expo.dev/
2. React Native docs: https://reactnative.dev/
3. Stack Overflow với tag "react-native" và "expo"

## Next Steps

Sau khi có APK:
1. Test trên nhiều devices khác nhau
2. Thu thập feedback từ users
3. Iterate và improve app
4. Submit lên app stores
5. Marketing và user acquisition