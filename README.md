# 🧠 Çok Oyunculu Memory Game

Unpkg ve Socket.IO kullanarak yapılmış gerçek zamanlı çok oyunculu memory game!

## 🎮 Özellikler

### 🎯 Oyun Özellikleri
- **2-4 oyuncu** aynı anda oynayabilir
- **Gerçek zamanlı** kart çevirme ve eşleştirme
- **Sırayla oynama** sistemi
- **Canlı skor takibi**
- **Zaman ve hamle sayacı**

### 🏆 Multiplayer Özellikler
- **Oyun lobisi** - Oyuncular hazır olana kadar bekler
- **Gerçek zamanlı sohbet** - Oyuncular arası mesajlaşma
- **Canlı oyuncu listesi** - Kim hazır, kim beklemede
- **Bağlantı durumu** - Sunucu bağlantısı göstergesi
- **Otomatik oyun başlatma** - Tüm oyuncular hazır olunca başlar

### 🎨 Tasarım Özellikleri
- **Responsive tasarım** - Mobil ve desktop uyumlu
- **Güzel animasyonlar** - Animate.css ile
- **Modern UI** - Gradient arka planlar ve cam efektleri
- **Font Awesome ikonları** - Görsel öğeler için

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Kurulum
```bash
# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm start

# Geliştirme modu (otomatik yeniden başlatma)
npm run dev
```

### Kullanım
1. Sunucuyu başlatın (`npm start`)
2. Tarayıcıda `http://localhost:3000` adresine gidin
3. Oyuncu adınızı girin
4. Diğer oyuncuların katılmasını bekleyin
5. "Hazırım" butonuna basın
6. Oyun otomatik olarak başlayacak!

## 🛠️ Teknolojiler

### Frontend
- **HTML5** - Oyun yapısı
- **CSS3** - Styling ve animasyonlar
- **Vanilla JavaScript** - Oyun mantığı
- **Socket.IO Client** - Gerçek zamanlı iletişim

### Backend
- **Node.js** - Sunucu
- **Express.js** - Web framework
- **Socket.IO** - WebSocket iletişimi

### CDN Kütüphaneleri (Unpkg)
- **Animate.css** - CSS animasyonları
- **Font Awesome** - İkonlar
- **Socket.IO Client** - Gerçek zamanlı bağlantı

## 🎯 Oyun Kuralları

1. **Lobi:** En az 2 oyuncu gerekli
2. **Hazırlık:** Tüm oyuncular "Hazırım" demeli
3. **Sıra:** Oyuncular sırayla kart çevirir
4. **Eşleştirme:** Aynı kartları bulana kadar devam eder
5. **Skor:** Her eşleştirme 10 puan
6. **Kazanma:** Tüm kartlar eşleştiğinde en yüksek skorlu oyuncu kazanır

## 🌐 Deployment

### Heroku
```bash
# Heroku CLI ile
heroku create your-app-name
git push heroku main
```

### Vercel
```bash
# Vercel CLI ile
vercel --prod
```

### Railway
```bash
# Railway CLI ile
railway deploy
```

## 📱 Mobil Uyumluluk

Oyun tamamen responsive tasarım ile mobil cihazlarda da mükemmel çalışır:
- **Touch controls** - Dokunmatik kart çevirme
- **Adaptive layout** - Ekran boyutuna göre ayarlama
- **Mobile chat** - Mobil dostu sohbet arayüzü

## 🔧 Geliştirme

### Yeni Özellik Ekleme
1. Frontend değişiklikleri: `multiplayer-memory-game.html`
2. Backend değişiklikleri: `server.js`
3. Yeni bağımlılıklar: `package.json`

### Test Etme
```bash
# Yerel test
npm start
# Tarayıcıda localhost:3000

# Çoklu oyuncu testi
# Farklı tarayıcı sekmelerinde aynı adrese gidin
```

## 🎉 Özellikler

- ✅ Gerçek zamanlı multiplayer
- ✅ Oyun lobisi sistemi
- ✅ Canlı sohbet
- ✅ Responsive tasarım
- ✅ Güzel animasyonlar
- ✅ Skor takibi
- ✅ Zaman sınırı (5 dakika)
- ✅ Otomatik oyun başlatma
- ✅ Bağlantı durumu göstergesi

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit yapın (`git commit -m 'Add some AmazingFeature'`)
4. Push yapın (`git push origin feature/AmazingFeature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🙏 Teşekkürler

- [Socket.IO](https://socket.io/) - Gerçek zamanlı iletişim
- [Animate.css](https://animate.style/) - CSS animasyonları
- [Font Awesome](https://fontawesome.com/) - İkonlar
- [Unpkg](https://unpkg.com/) - CDN servisi
