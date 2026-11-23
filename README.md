# 阿Yan蛋糕店 - HTML 3頁版

呢個係傳統 HTML 網站，唔係 React 單頁 App。每頁獨立檔案，方便你日後逐頁更新。

## 檔案結構
```
cake_site/
├── index.html          → 首頁
├── products.html       → 產品
├── about.html          → 自我介紹
├── css/
│   └── style.css       → 全部頁共用嘅 CSS
├── js/
│   └── main.js         → 全部頁共用嘅 JS (篩選 + Email + 追蹤)
├── images/
│   ├── hero.webp
│   ├── strawberry.webp
│   ├── chocolate.webp
│   ├── matcha.webp
│   ├── mango.webp
│   └── baker.webp
└── google-apps-script/
    └── Code.gs         → 寫入 Google Sheets 嘅程式
```

## 點樣上載到你自己網址
1. 將成個 `cake_site` 入面嘅檔案，上載到你 hosting 嘅 public_html / www  folder，keep 返原有結構。
2. 唔好只上載一個 HTML，要成個 folder 一齊上，否則 CSS / JS / 相會 load 唔到。
3. 測試: 開 `https://你嘅網址/index.html`，再㩒產品同自我介紹。

## 要改嘅 3 樣嘢 (必改)

### 1) 換返你真實網址 (SEO canonical)
而家 3 頁嘅 canonical 同 OG URL 都係示範:
`https://www.yancake.hk/`
請用 Find & Replace，將 `www.yancake.hk` 換成你真實網址，例如 `www.yourdomain.com`。
每頁都有獨立 title / description / canonical / OG / Twitter / JSON-LD，已經分開寫好。

### 2) Google Tag Manager (GTM)
- 3 頁嘅 `<head>` 同 `<body>` 已經有 GTM code，ID 而家係 `GTM-XXXXXXX`。
- 去 https://tagmanager.google.com 開一個 Container，copy 返你嘅 GTM ID (例如 GTM-ABC1234)，Find & Replace 晒成個 folder 嘅 `GTM-XXXXXXX`。
- 之後喺 GTM 入面加:
  - GA4: Tag 類型 GA4 Configuration, Measurement ID 例如 G-XXXXXXXX
  - Google Ads: Conversion Linker + Conversion Tag
  - FB Pixel: 用 Custom HTML Tag 貼 Meta Pixel code，或者用 GTM 內置 Facebook Pixel template
- 呢個網站已經推咗 dataLayer events，喺 GTM 可以直接用嚟做 Trigger:
  - `view_product` (product_name)
  - `whatsapp_click` (product_name, whatsapp_number)
  - `email_signup_start` / `email_signup_success` / `email_signup_error`
  - `filter_products` (filter_value)
  - `page_view_custom` (page_path)

### 3) Email → Google Sheets _demo > contact
- 我喺你 Drive 搵過，暫時未見有一個叫 `_demo` 入面有 `contact` 分頁嘅試算表，所以我起咗成套接駁方法俾你，唔係假裝已經寫入。
- 做法:
  1. 開一個 Google Sheets 叫 `_demo` (如果已有就用嗰個)
  2. 入面開分頁 `contact`，第一行寫: `timestamp | email | source | page_title`
  3. 喺 `_demo`: 擴充功能 > Apps Script，貼入 `google-apps-script/Code.gs`
  4. 部署 > 新增部署 > 網頁應用程式 > 執行身分: 我 > 存取權: 所有人 > 部署，copy URL
  5. 將 URL 貼入 `js/main.js` 頂部嘅 `SHEET_ENDPOINT`，取代 `YOUR_SCRIPT_ID`
- 之後網站上嘅「想第一時間知新產品」表格，一 submit 就會即刻寫入 `_demo > contact`。
- 未填 URL 之前，表格會顯示「示範模式」，唔會假裝成功。

## WhatsApp
- 已經接駁到 `852-65424488`，全站連結都係 `https://wa.me/85265424488`
- 唔同產品會帶唔同預設文字，例如 `?text=你好，我想訂士多啤梨忌廉蛋糕`
- 喺 `js/main.js` 頂部 `WHATSAPP_NUMBER` 可以改。

## SEO / Analytics 已經做好嘅嘢
- 每頁獨立 `<title>`、`<meta description>`、`<link rel="canonical">`
- OG + Twitter Card + JSON-LD (Bakery / Product / Person)
- 每張 `<img>` 都有 `alt`、`width`、`height`、`loading="lazy"` (首頁 hero 用 `fetchpriority="high"`)
- 語言 `lang="zh-Hant-HK"`，方便香港 SEO
- GTM + dataLayer，方便之後接 GA4 / Google Ads / FB Pixel

## 價錢 / 內容
- 價錢、營業時間、時間線都係示範內容，請喺 3 個 HTML 直接改文字就得，唔使掂 CSS/JS。
