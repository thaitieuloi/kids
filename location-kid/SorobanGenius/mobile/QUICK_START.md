# 🚀 Quick Start - Soroban Math React Native

## Lỗi đã fix:
✅ Đã thêm `react-native-web` dependency  
✅ Đã tạo favicon.png và các icon cần thiết  
✅ Đã cấu hình assets cho Expo  

## Chạy app ngay:

### Bước 1: Cài Expo Go trên điện thoại
- **Android**: Tải từ Google Play Store
- **iOS**: Tải từ App Store

### Bước 2: Chạy lệnh này
```bash
cd mobile
npm install
npm start
```

### Bước 3: Kết nối điện thoại
1. Mở Expo Go app
2. Scan QR code từ terminal
3. App sẽ tự động tải và chạy

## Nếu vẫn lỗi:

### Clear cache và reinstall:
```bash
cd mobile
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### Fix common errors:
```bash
# Update Expo CLI
npm install -g @expo/cli@latest

# Install web dependencies
npm install react-native-web@~0.19.10

# Clear Metro cache
npx expo start --clear
```

## Build APK:
```bash
# Cài EAS CLI
npm install -g eas-cli

# Login (tạo account miễn phí tại expo.dev)
eas login

# Build APK
eas build --platform android --profile preview
```

## Tính năng app:
- 🏠 Home screen với 3 cấp độ
- ⚙️ Settings đầy đủ (số câu, thời gian, âm thanh)
- 🎮 Game với timer và Soroban display
- 📊 Results với thống kê chi tiết
- 📱 UI tối ưu cho mobile

## Cấu trúc files:
```
mobile/
├── App.tsx              # Main app + navigation
├── src/screens/         # Các màn hình
│   ├── HomeScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── GameScreen.tsx
│   └── ResultsScreen.tsx
├── src/components/      # Components
│   ├── SorobanDisplay.tsx
│   └── Timer.tsx
└── assets/              # Icons và images
    ├── icon.png
    ├── splash.png
    └── favicon.png
```

Hãy thử chạy lại và cho tôi biết kết quả!