# 🍽️ Flavor Fusion – Restaurant Website
## Patiala, Punjab | Mobile App Style | GitHub Pages Ready

---

## 📁 Files – Upload ALL to GitHub Repo Root

| File | Page |
|------|------|
| `index.html` | Homepage with hero, featured items, categories |
| `menu.html` | Full menu with cart drawer |
| `order.html` | Cart, customer form, WhatsApp/Email order, A4 invoice |
| `admin.html` | Admin panel |
| `style.css` | All styles |
| `datastore.js` | Data layer (GitHub fetch) + Cart |
| `common.js` | Shared utilities |
| `data.json` | **Published data – update this on GitHub** |

---

## 🔐 Admin Login
- **URL:** `your-site.github.io/admin.html`
- **Username:** `admin`
- **Password:** `fusion@admin`
- ⚠️ Change in Admin → Account after first login

---

## 🚀 How Data Works (Cross-Device)

```
Admin adds/edits data
       ↓
Clicks "Publish Data" → Downloads data.json
       ↓
Uploads data.json to GitHub repo
       ↓
All customers fetch data.json → See updated menu ✅
```

---

## 📤 How to Publish After Changes

1. Admin Panel → **Publish Data** → **Download data.json**
2. Go to GitHub repo → click `data.json` → ✏️ Edit
3. Select all → Delete → Paste new content → Commit
4. Wait 1–2 min → menu updates for everyone

---

## 📊 Excel/Menu Upload

No Excel needed. Use Admin Panel → Menu Items → Add each item with:
- Name, Category, Price, Description, Image (auto-compressed)
- Veg/Non-Veg flag, Featured, Bestseller, Available toggles

---

## 💬 WhatsApp Orders

1. Customer browses menu → adds items to cart
2. Goes to Order page → fills name, phone, order type
3. Clicks **Order via WhatsApp**
4. Opens WhatsApp with pre-filled order message

Setup: Admin → Restaurant Info → WhatsApp Number (e.g. `919876543210`)

---

## 📧 Email Orders

Same flow, but clicks **Order via Email** → opens mail app with order details.

Setup: Admin → Restaurant Info → Email Address

---

## 🖨️ A4 Invoice

Order page → **Print Invoice** → browser print dialog → Save as PDF → A4

---

## 🏪 Change Restaurant Name/Logo

Admin → Restaurant Info → update Name, upload Logo → Save → Publish

---

## ⚙️ GitHub Pages Setup

1. Create GitHub repo (e.g. `flavor-fusion-patiala`)
2. Upload all files
3. Settings → Pages → Source: main → /root
4. Live at: `https://yourusername.github.io/flavor-fusion-patiala/`

*© 2024 Flavor Fusion, Patiala, Punjab*
