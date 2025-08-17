# Soroban Math - React Native App

Ứng dụng học toán với bàn tính Soroban cho trẻ em, được chuyển đổi từ web app sang React Native.

## Tính năng chính

- 🧮 **Học toán với Soroban**: Hiển thị bàn tính Nhật Bản trực quan
- 🎯 **3 độ khó**: Anh bạn nhỏ, Anh bạn lớn, Ứng dụng lớn hơn mạnh mẽ hơn
- ⏱️ **Timer linh hoạt**: 15s, 30s, 60s, 90s cho mỗi câu
- 🔢 **Phạm vi số đa dạng**: Dưới 5, 10, 20, 50
- 🔊 **Âm thanh phản hồi**: Có thể bật/tắt
- 📊 **Thống kê chi tiết**: Điểm số, thời gian, độ chính xác
- 🇻🇳 **Giao diện tiếng Việt**: Phù hợp với trẻ em Việt Nam

## Cấu trúc dự án

```
mobile/
├── App.tsx                 # App chính với navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx      # Màn hình chính
│   │   ├── SettingsScreen.tsx  # Cài đặt trò chơi
│   │   ├── GameScreen.tsx      # Màn hình chơi game
│   │   └── ResultsScreen.tsx   # Kết quả
│   └── components/
│       ├── SorobanDisplay.tsx  # Component hiển thị bàn tính
│       └── Timer.tsx           # Component đếm giờ
├── package.json
├── app.json               # Cấu hình Expo
└── babel.config.js
```

## Cài đặt và chạy

### Yêu cầu
- Node.js 16+
- Expo CLI: `npm install -g @expo/cli`
- Điện thoại Android/iOS với ứng dụng Expo Go

### Cài đặt dependencies
```bash
cd mobile
npm install
```

### Chạy ứng dụng
```bash
# Chạy trên tất cả platform
npm start

# Chỉ Android
npm run android

# Chỉ iOS
npm run ios
```

### Build APK
1. Tạo tài khoản Expo: https://expo.dev/
2. Login: `expo login`
3. Build: `expo build:android`

## Chuyển đổi từ Web App

### Những thay đổi chính:
1. **Navigation**: Từ Wouter → React Navigation
2. **Styling**: Từ Tailwind CSS → StyleSheet React Native
3. **UI Components**: Từ Radix UI → React Native components
4. **Storage**: Từ server API → AsyncStorage (local)
5. **Audio**: Từ Web Audio API → Expo AV

### API tương đương:
- `TouchableOpacity` thay cho `Button`
- `Text` và `View` thay cho HTML elements
- `StyleSheet` thay cho CSS classes
- `Dimensions` thay cho CSS media queries

## Tính năng đã chuyển đổi

### ✅ Đã hoàn thành:
- [x] Màn hình chính với 3 cấp độ
- [x] Cài đặt trò chơi đầy đủ
- [x] Logic tạo câu hỏi toán
- [x] Hiển thị Soroban với màu sắc
- [x] Timer đếm ngược
- [x] Nhập đáp án và kiểm tra
- [x] Màn hình kết quả chi tiết
- [x] Navigation giữa các màn hình
- [x] Responsive design cho mobile

### 🔄 Cần cải thiện:
- [ ] Âm thanh phản hồi (cần Expo AV)
- [ ] Lưu trữ thống kê (AsyncStorage)
- [ ] Animation chuyển màn hình
- [ ] Haptic feedback
- [ ] Dark mode
- [ ] Multi-language support

## Cấu hình cho Production

### Android APK:
1. Cấu hình `app.json`:
   - `android.package`: Unique package name
   - `android.versionCode`: Tăng cho mỗi release
   - `version`: App version

2. Icons và splash screen:
   - `assets/icon.png` (1024x1024)
   - `assets/splash.png` (1242x2436)
   - `assets/adaptive-icon.png` (1024x1024)

### iOS App Store:
1. Cấu hình `app.json`:
   - `ios.bundleIdentifier`: Unique bundle ID
   - `ios.buildNumber`: Tăng cho mỗi build

## Hướng dẫn deploy

### Expo Application Services (EAS):
```bash
npm install -g eas-cli
eas login
eas build --platform android
```

### Local build (cần Android Studio):
```bash
expo run:android --variant release
```

## Troubleshooting

### Build errors:
- Đảm bảo tất cả dependencies compatible với React Native
- Kiểm tra `metro.config.js` nếu có import errors
- Clear cache: `expo start -c`

### Runtime errors:
- Check console logs trong Expo Go app
- Đảm bảo tất cả images có trong assets folder
- Kiểm tra async operations và error handling