# 🚀 Vercel 部署指南

## 📋 前置準備

你已經完成：
- ✅ Firebase 配置已加到 GitHub Secrets
- ✅ Next.js 專案準備好

---

## 🎯 步驟 1: 註冊 Vercel

1. 前往 https://vercel.com/signup
2. 點擊 **"Continue with GitHub"**
3. 授權 Vercel 訪問你的 GitHub 帳號

---

## 📦 步驟 2: 導入專案

1. 登入後，點擊 **"Add New..."** → **"Project"**
2. 在列表中找到 `cliff357/gocart`
3. 點擊 **"Import"**

---

## ⚙️ 步驟 3: 配置專案

### 3.1 Framework Preset
- 自動檢測為 **Next.js** ✅

### 3.2 Root Directory
- 保持預設（專案根目錄）✅

### 3.3 Build & Development Settings
- **Build Command**: `npm run build` ✅
- **Output Directory**: `.next` ✅
- **Install Command**: `npm install` ✅

### 3.4 Environment Variables（重要！）

點擊 **"Environment Variables"**，添加以下變數：

```bash
# Firebase 配置
NEXT_PUBLIC_FIREBASE_API_KEY=你的值（從 GitHub Secrets 複製）
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myloyau.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myloyau
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myloyau.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的值
NEXT_PUBLIC_FIREBASE_APP_ID=你的值
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=你的值

# 應用配置
NEXT_PUBLIC_CURRENCY_SYMBOL=$
NEXT_PUBLIC_APP_NAME=MyLoYau
```

**快速方法：** 使用 GitHub CLI 導出再複製

```bash
# 查看你的 secrets
gh secret list -R cliff357/gocart

# 如果需要查看值（需要手動記錄，因為 secrets 無法直接讀取）
# 你需要從當初設定時的記錄中找到這些值
```

---

## 🚀 步驟 4: 部署

1. 環境變數設定完成後，點擊 **"Deploy"**
2. 等待 2-3 分鐘建置
3. 完成後會顯示：**"Congratulations! Your project has been deployed."**
4. 你會得到一個網址：`https://gocart-xxx.vercel.app`

---

## ✅ 步驟 5: 驗證部署

1. **訪問網站**: 點擊 Vercel 提供的網址
2. **檢查功能**:
   - ✅ 首頁載入正常
   - ✅ 動態路由工作（`/shop/[username]`）
   - ✅ Firebase 連接正常（按 F12 查看 Console）

3. **測試 Firebase 連接**:
   - 打開瀏覽器開發者工具（F12）
   - 查看 Console 應該顯示：
     ```
     ✅ Using environment variables config
     ✅ Firebase initialized successfully
     📦 Project: myloyau
     ```

---

## 🔄 自動部署

**從現在開始**：
- 每次你 `git push` 到 GitHub
- Vercel 會自動建置並部署
- 約 2-3 分鐘完成
- 可以在 Vercel Dashboard 查看部署狀態

---

## 🌐 自訂域名（可選）

如果你有自己的域名（例如 `gocart.com`）：

1. 在 Vercel Dashboard，進入專案
2. 點擊 **"Settings"** → **"Domains"**
3. 添加你的域名
4. 按照指示在域名服務商設定 DNS
5. 等待幾分鐘，自動配置 HTTPS

---

## 🔧 常見問題

### 問題 1: 環境變數未生效

**解決方法**：
1. 前往 Vercel Dashboard → Settings → Environment Variables
2. 確認所有變數已添加
3. 重新部署：Deployments → 最新部署 → **"Redeploy"**

### 問題 2: Firebase 初始化失敗

**檢查**：
1. 按 F12 查看 Console 錯誤
2. 確認環境變數名稱正確（必須以 `NEXT_PUBLIC_` 開頭）
3. 確認 Firebase 配置值正確

### 問題 3: 建置失敗

**查看 Build Logs**：
1. Vercel Dashboard → Deployments
2. 點擊失敗的部署
3. 查看 **"Build Logs"** 找出錯誤

---

## 📊 監控和分析

### Vercel Analytics（可選）

1. 在專案 Dashboard 點擊 **"Analytics"**
2. 查看：
   - 訪客數量
   - 頁面載入速度
   - 地理分佈

### Firebase Console

繼續使用 Firebase Console 監控：
- https://console.firebase.google.com/project/myloyau/overview
- 查看資料庫使用量
- 監控 Authentication
- 追蹤 Storage 用量

---

## 🎯 下一步

部署成功後：

1. ✅ **部署 Firestore Security Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

2. ✅ **部署 Storage Security Rules**
   ```bash
   firebase deploy --only storage
   ```

3. ✅ **啟用 Firebase Authentication**
   - 前往 Firebase Console
   - 啟用 Email/Password 或其他登入方式

4. ✅ **測試完整流程**
   - 用戶註冊/登入
   - 商品瀏覽
   - 購物車功能
   - 訂單建立

---

## 🆘 需要幫助？

- Vercel 文檔: https://vercel.com/docs
- Next.js 部署: https://nextjs.org/docs/deployment
- Firebase 整合: https://firebase.google.com/docs/web/setup

---

## 💡 提示

- Vercel 會為每個 branch 創建預覽部署
- `main` branch 會自動部署到生產環境
- 可以在 Pull Request 中預覽變更

**恭喜！你的電商網站即將上線！** 🎉
