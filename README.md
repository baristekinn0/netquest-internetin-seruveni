# 🌐 NetQuest — İnternetin Serüveni

Ortaokul öğrencileri (11-14 yaş) için geliştirilmiş, **internetin nasıl çalıştığını** öğreten pedagojik bir mobil eğitim uygulaması.

> Yıldız Teknik Üniversitesi — İşletim Sistemleri ve Bilgisayar Ağları Dersi Proje Ödevi

---

## 📱 Uygulama Hakkında

NetQuest, öğrencilerin internet teknolojilerini eğlenceli ve interaktif bir şekilde öğrenmesini sağlar. Her modül önce konuyu animasyonlu slaytlarla anlatır, ardından quiz ile pekiştirir.

### Modüller

| # | Modül | Konu |
|---|---|---|
| 1 | 🌐 İnternet Nedir? | Ağ yapısı, sunucu-istemci modeli |
| 2 | 📮 IP Adresi Nedir? | IPv4, özel/genel IP |
| 3 | 📦 Paketler Yolda | Veri paketleri, router |
| 4 | 📜 Protokoller | HTTP/HTTPS, DNS |

### Özellikler

- Kullanıcı girişi (kullanıcı adı + şifre)
- Her modülde 3 slaytlık konu anlatımı
- 3 soruluk çoktan seçmeli quiz
- Yanlış cevapta açıklama gösterimi
- Yıldız bazlı puanlama sistemi (modül başına 0-3 yıldız)
- Tamamlanan modül takibi

---

## 🛠️ Teknolojiler

- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/) (SDK 54, Managed Workflow)
- TypeScript
- [Zustand](https://zustand-demo.pmnd.rs/) — state yönetimi
- [React Navigation](https://reactnavigation.org/) — stack navigasyon
- [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) — gradyan arka planlar

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18+
- [Expo Go](https://expo.dev/go) uygulaması (iOS veya Android)

### Adımlar

```bash
# Repoyu klonla
git clone https://github.com/baristekinn0/netquest-internetin-seruveni.git
cd netquest-internetin-seruveni

# Bağımlılıkları kur
npm install

# Uygulamayı başlat
npx expo start
```

Terminalde çıkan QR kodu **Expo Go** ile tara — uygulama telefonunda açılır.

> Mac ve telefon aynı Wi-Fi ağında olmalıdır.

### Demo Giriş Bilgileri

```
Kullanıcı Adı : ogrenci
Şifre         : 1234
```

---

## 📁 Proje Yapısı

```
src/
├── data/
│   └── modules.ts        # Modül içerikleri ve quiz soruları
├── navigation/
│   └── AppNavigator.tsx  # Stack navigator
├── screens/
│   ├── LoginScreen.tsx   # Giriş ekranı
│   ├── HomeScreen.tsx    # Modül listesi
│   ├── ModuleScreen.tsx  # Slayt bazlı konu anlatımı
│   ├── QuizScreen.tsx    # Quiz ekranı
│   └── ResultScreen.tsx  # Sonuç ve puan ekranı
├── store/
│   └── useStore.ts       # Zustand global state
└── types/
    └── index.ts          # TypeScript tipleri
```

---

## 🎮 Ekran Akışı

```
Login → Home → Module (slaytlar) → Quiz → Result → Home
```

---

## 👥 Geliştirici

- Barış Tekin
- Alperen Baştuğ
- Sadık Ahmet Fırat
- Muammer Atçeken 21091031 
- Berkay Pamuk
