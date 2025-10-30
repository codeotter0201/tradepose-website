# 圓形 Logo 使用指南

專為社群平台圓形裁切優化的 Logo 版本，提供**透明版**和**漸層背景版**。

## 🎯 為什麼需要圓形版本？

大多數社群平台會自動將正方形大頭貼裁切成圓形顯示：
- **Google 帳戶**：圓形大頭貼
- **Twitter/X**：圓形頭像
- **LinkedIn**：圓形個人照
- **Facebook**：圓形大頭貼
- **Instagram**：圓形個人資料照片

如果使用標準正方形 logo，**四個角落的內容會被切掉**。本目錄提供的圓形版本已經：
1. ✅ 預先縮小到安全區域（圓形直徑的 75%）
2. ✅ 套用圓形遮罩，確保完整顯示
3. ✅ 提供漸層背景版，解決深色背景對比度問題

## 📁 檔案列表

```
circular/
├── 透明背景版本（適合淺色背景）
│   ├── logo_circular_2048.png / .webp
│   ├── logo_circular_512.png / .webp
│   ├── logo_circular_400.png / .webp
│   └── logo_circular_180.png / .webp
│
├── 漸層背景版本（通用，推薦）✨
│   ├── logo_circular_2048_gradient_a.png / .webp
│   ├── logo_circular_512_gradient_a.png / .webp
│   ├── logo_circular_400_gradient_a.png / .webp
│   └── logo_circular_180_gradient_a.png / .webp
│
├── preview_final.png          # 效果對比圖
└── README.md                  # 本文件
```

## 🌈 漸層背景版本

**設計特色：**
- 📐 **漸層類型**：徑向漸層（中心淺，邊緣深）
- 🎨 **配色方案**：淺藍 (#E3F2FD) → 天藍 (#90CAF9)
- ✅ **適用場景**：深色/淺色背景都清晰
- ✅ **專業感強**：類似 LinkedIn、Slack 等專業平台風格

**何時使用漸層版？**
- ✅ Google 帳戶（支援深色模式）
- ✅ 社群媒體（Twitter、LinkedIn、Facebook）
- ✅ 不確定背景色的場合
- ✅ 需要最大化可見度

**何時使用透明版？**
- 確定只會在淺色背景使用
- 需要最小化視覺干擾
- 與其他元素組合使用

## 🚀 快速開始

### 推薦用法（最簡單）

**Google 帳戶大頭貼：**
```
使用檔案: logo_circular_512_gradient_a.png
```

**社群媒體頭像：**
```
使用檔案: logo_circular_400_gradient_a.png 或 logo_circular_512_gradient_a.png
```

**iOS Apple Touch Icon：**
```html
<link rel="apple-touch-icon" sizes="180x180" href="/logo/circular/logo_circular_180_gradient_a.png">
```

## 📐 技術規格

| 檔案 | 尺寸 | 用途 | 檔案大小 (約) |
|------|------|------|---------------|
| `logo_circular_2048*` | 2048×2048 px | 高解析度主檔 | PNG: ~450KB / WebP: ~280KB |
| `logo_circular_512*` | 512×512 px | Google、Facebook | PNG: ~35KB / WebP: ~22KB |
| `logo_circular_400*` | 400×400 px | Twitter、LinkedIn | PNG: ~23KB / WebP: ~15KB |
| `logo_circular_180*` | 180×180 px | iOS Touch Icon | PNG: ~6KB / WebP: ~4KB |

**設計參數：**
- 圓形遮罩：完整圓形（360°）
- 安全區域：Logo 縮放至圓形直徑的 75%
- 邊緣處理：反鋸齒平滑
- 漸層背景：徑向漸層，中心淺 (#E3F2FD) → 邊緣深 (#90CAF9)
- 重採樣算法：Lanczos（高品質）

## 🎨 版本對比

查看 `preview_final.png` 了解兩個版本的差異：

| 背景 | 透明版 | 漸層版 |
|------|--------|--------|
| **白色** | ✅ 清晰 | ✅ 清晰 |
| **深灰** | ❌ 幾乎看不見 | ✅ 非常清晰 |

**結論：建議社群平台使用漸層版（`*_gradient_a.*`）**

## 📱 各平台使用指南

### Google 帳戶

**推薦檔案：** `logo_circular_512_gradient_a.png`

**為什麼選漸層版？**
- Google 支援深色模式，透明版在深色背景對比度不足
- 漸層版在淺色/深色主題都清晰可見

**上傳步驟：**
1. 前往 [Google 帳戶設定](https://myaccount.google.com/personal-info)
2. 點選「個人資料相片」
3. 上傳 `logo_circular_512_gradient_a.png`

---

### Twitter / X

**推薦檔案：** `logo_circular_400_gradient_a.png`

**上傳步驟：**
1. 前往 Twitter 個人資料設定
2. 點選「編輯個人資料」
3. 點選頭像，上傳檔案

**規格：** 400×400 px，最大 2 MB

---

### LinkedIn

**推薦檔案：** `logo_circular_512_gradient_a.png`

**為什麼選漸層版？**
- LinkedIn 專業形象，淺藍漸層符合商務風格
- 在各種背景下都專業清晰

**規格：** 400×400 至 7680×4320 px，最大 8 MB

---

### Facebook

**推薦檔案：** `logo_circular_512_gradient_a.png`

**規格：** 最小 180×180 px，建議 512×512 px

---

### Instagram

**推薦檔案：** `logo_circular_512_gradient_a.png`

**規格：** 320×320 至 1080×1080 px

---

## ✅ 最佳實踐

### 1. 優先選擇漸層版

除非您確定只會在淺色背景使用，否則**強烈建議使用漸層版**：
```
✅ logo_circular_512_gradient_a.png  (推薦)
⚠️  logo_circular_512.png           (僅限淺色背景)
```

### 2. 格式選擇

- **社群平台上傳**：使用 **PNG**（通用性高，所有平台支援）
- **網頁整合**：使用 **WebP**（檔案小 30-40%）
- **避免 JPG**：會失去透明度/圓形效果

### 3. 檔案命名

某些平台有命名要求，可重新命名：
```bash
logo_circular_512_gradient_a.png  →  profile.png
logo_circular_400_gradient_a.png  →  avatar.png
```

### 4. 測試不同背景

上傳前建議測試：
- ⚪ 白色背景
- ⚫ 深色背景（深色模式）
- 🎨 品牌色背景

漸層版在所有背景下都應該清晰可見。

## 🆚 透明版 vs 漸層版選擇指南

| 使用場景 | 推薦版本 | 檔案 |
|---------|---------|------|
| Google 帳戶 | 漸層版 ✨ | `*_gradient_a.png` |
| Twitter/X | 漸層版 ✨ | `*_gradient_a.png` |
| LinkedIn | 漸層版 ✨ | `*_gradient_a.png` |
| Facebook | 漸層版 ✨ | `*_gradient_a.png` |
| Instagram | 漸層版 ✨ | `*_gradient_a.png` |
| 淺色背景專用 | 透明版 | `logo_circular_*.png` |
| 不確定背景 | 漸層版 ✨ | `*_gradient_a.png` |

**經驗法則：不確定時，選漸層版！**

## 🔍 預覽效果

### 對比圖說明

查看 `preview_final.png`：

**上排（淺色背景）：**
- 左：透明版 - 清晰可見 ✅
- 右：漸層版 - 清晰可見，稍有底色 ✅

**下排（深色背景）：**
- 左：透明版 - **幾乎看不見** ❌
- 右：漸層版 - **非常清晰** ✅✅✅

### 在瀏覽器中測試

```html
<!-- 深色背景測試 -->
<div style="width: 200px; height: 200px; background: #2d2d2d; border-radius: 50%; overflow: hidden;">
  <img src="logo_circular_512_gradient_a.png" width="200" height="200">
</div>
```

## 🛠️ 進階使用

### 網頁整合（響應式）

```html
<picture class="profile-avatar">
  <!-- 現代瀏覽器使用 WebP -->
  <source srcset="/logo/circular/logo_circular_512_gradient_a.webp" type="image/webp">
  <!-- Fallback 使用 PNG -->
  <img src="/logo/circular/logo_circular_512_gradient_a.png"
       alt="Tradepose Logo"
       width="512"
       height="512"
       style="border-radius: 50%;">
</picture>
```

### CSS 圓形裁切（可選）

雖然圖片已經是圓形，但可以加上 CSS 確保跨平台一致：

```css
.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #E3F2FD; /* 可選邊框，與漸層呼應 */
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

## 📝 常見問題

### Q1: 為什麼不直接使用正方形版本？
**A:** 社群平台會自動裁切成圓形，您的 logo 曲線延伸到邊緣會被切掉。圓形版本預先縮小並套用遮罩，確保完整顯示。

### Q2: 漸層背景會不會太花俏？
**A:** 不會。我們使用的是**淺藍色徑向漸層**，非常柔和專業，類似 LinkedIn、Slack 等大型平台的風格。查看 `preview_final.png` 確認視覺效果。

### Q3: 透明版什麼時候用？
**A:** 僅在**確定只會在淺色背景使用**時選擇透明版。如果不確定，選漸層版更安全。

### Q4: WebP 格式是否所有平台都支援？
**A:** 大多數現代平台支援 WebP。如果遇到問題，改用 PNG 版本（100% 相容）。

### Q5: 漸層顏色可以自訂嗎？
**A:** 可以。如果需要不同的漸層配色，請參考生成腳本並調整 `color1` 和 `color2` 參數。目前配色經過優化，建議先測試再決定是否修改。

### Q6: 檔案太大怎麼辦？
**A:**
- 使用 WebP 格式（比 PNG 小 30-40%）
- 選擇較小尺寸（512px 對大多數平台已經足夠）
- 512px PNG 檔案僅 ~35KB，非常小

### Q7: 為什麼只有一個漸層版本？
**A:** 經過多方案測試，淺亮徑向漸層（方案 A）在專業感、可見度、通用性上表現最佳，因此僅保留此版本。如需其他配色，請聯繫開發團隊。

## 🔧 重新生成

如果需要調整漸層或重新生成：

```bash
uv run --python 3.13 --with pillow python -c "
from PIL import Image
import math

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_radial_gradient_circle(size, color1, color2):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    center = size // 2
    for y in range(size):
        for x in range(size):
            dist = math.sqrt((x - center)**2 + (y - center)**2)
            if dist <= center:
                ratio = dist / center
                r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
                g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
                b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
                img.putpixel((x, y), (r, g, b, 255))
    return img

# 自訂配色（範例）
gradient = create_radial_gradient_circle(512, hex_to_rgb('#E3F2FD'), hex_to_rgb('#90CAF9'))
logo = Image.open('logo/square/logo_2048.png').resize((384, 384), Image.Resampling.LANCZOS)
gradient.paste(logo, (64, 64), logo)
gradient.save('custom_gradient.png')
"
```

## 📄 授權

這些圓形 logo 檔案僅供 Tradepose 專案及相關品牌使用。

## 🛠️ 生成資訊

- **生成日期**：2025-10-28
- **來源檔案**：`logo/square/logo_2048.png`
- **安全區域**：75% of circle diameter
- **漸層配色**：淺藍 (#E3F2FD) → 天藍 (#90CAF9)
- **生成工具**：Python 3.13 + Pillow
- **遮罩算法**：Circular anti-aliased mask

---

**相關文件：**
- 完整 Logo 套件說明：[../README.md](../README.md)
- 正方形版本：[../square/](../square/)
- 橫向版本：[../horizontal/](../horizontal/)

**推薦配置：**
- ✨ **首選**：`logo_circular_512_gradient_a.png` （Google、社群媒體）
- 📱 **行動裝置**：`logo_circular_400_gradient_a.png` （Twitter、Instagram）
- 🍎 **iOS Icon**：`logo_circular_180_gradient_a.png` （Apple Touch Icon）

如有任何問題，請聯繫開發團隊。
