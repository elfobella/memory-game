# 🚀 Railway ile Deploy Etme

## Adımlar:

### 1. GitHub Repository Oluştur
```bash
git init
git add .
git commit -m "Multiplayer Memory Game"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADI/multiplayer-memory-game.git
git push -u origin main
```

### 2. Railway'a Bağla
1. [Railway.app](https://railway.app) adresine git
2. "Login with GitHub" ile giriş yap
3. "New Project" → "Deploy from GitHub repo"
4. Repository'ni seç
5. "Deploy Now" butonuna bas

### 3. Otomatik Deploy
- Railway otomatik olarak `package.json`'ı okuyacak
- `npm install` çalıştıracak
- `node server.js` ile sunucuyu başlatacak
- URL verecek (örn: https://your-app.railway.app)

### 4. Environment Variables (Gerekirse)
Railway dashboard'da:
- PORT: Railway otomatik set eder
- NODE_ENV: production

## ✅ Deploy Tamamlandı!
Oyununuz artık online ve herkes erişebilir!
