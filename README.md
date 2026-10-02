# TLS Config Enhancer

یک ابزار ساده و متن‌باز برای بهینه‌سازی کانفیگ‌های **VLESS** و **Trojan** با اعمال تنظیمات TLS مشخص.

🌐 **Live Demo:**
https://teabag777.github.io/tls-config-enhancer/

📦 **Source Code:**
https://github.com/TeaBag777/tls-config-enhancer

---

## ✨ Features

* پشتیبانی از کانفیگ‌های `VLESS`
* پشتیبانی از کانفیگ‌های `Trojan`
* پردازش چند کانفیگ به‌صورت هم‌زمان
* اعمال خودکار TLS Fingerprint
* اعمال Cipher Suites مشخص
* اعمال Finalmask / Fragment
* تنظیم خودکار ALPN
* امکان Copy کردن خروجی
* امکان Download کردن کانفیگ‌های اصلاح‌شده
* پردازش کامل در مرورگر کاربر
* بدون نیاز به ارسال کانفیگ‌ها به سرور

---

## ⚙️ TLS Settings

برای کانفیگ‌هایی که دارای:

```text
security=tls
```

هستند، ابزار تنظیمات زیر را اعمال می‌کند.

### Fingerprint

```text
unsafe
```

معادل:

```text
fp=unsafe
```

---

### ALPN

```text
http/1.1
```

معادل:

```text
alpn=http/1.1
```

---

### Cipher Suites

مقدار مورد استفاده:

```text
TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
```

این مقدار به‌صورت:

```text
cs=<cipher-suites>
```

به URL اضافه می‌شود.

---

## 🧩 Finalmask

ابزار از Finalmask جدید استفاده می‌کند:

```json
{
  "tcp": [
    {
      "type": "fragment",
      "settings": {
        "packets": "tlshello",
        "lengths": ["0", "104", "1"],
        "delays": ["0"],
        "maxSplit": "0"
      }
    },
    {
      "type": "fragment",
      "settings": {
        "packets": "1-1",
        "lengths": ["114", "1"],
        "delays": ["1"],
        "maxSplit": "11"
      }
    }
  ]
}
```

این مقدار به‌صورت:

```text
fm=<finalmask>
```

به کانفیگ اضافه می‌شود.

---

## 🔧 How It Works

1. یک یا چند کانفیگ `VLESS` یا `Trojan` را وارد کنید.
2. ابزار URL را بررسی می‌کند.
3. اگر کانفیگ دارای:

```text
security=tls
```

باشد، تنظیمات TLS روی آن اعمال می‌شود.
4. پارامترهای زیر به URL اضافه یا جایگزین می‌شوند:

```text
fp=unsafe
alpn=http/1.1
cs=<cipher suites>
fm=<finalmask>
```

5. کانفیگ نهایی برای Copy یا Download آماده می‌شود.

---

## 📥 Example

### Input

```text
vless://UUID@example.com:443?type=tcp&security=tls#Example
```

### Enhanced Output

خروجی شامل پارامترهای زیر خواهد بود:

```text
fp=unsafe
alpn=http/1.1
cs=...
fm=...
```

پارامترهای قبلی `fp`، `cs`، `fm` و `alpn` در صورت وجود با مقادیر تنظیم‌شده توسط ابزار جایگزین می‌شوند.

---

## 📋 Multiple Configs

می‌توانید چند کانفیگ را هم‌زمان وارد کنید:

```text
vless://...
vless://...
trojan://...
vless://...
```

هر کانفیگ در یک خط قرار می‌گیرد.

کانفیگ‌های معتبر TLS پردازش می‌شوند و کانفیگ‌هایی که شرایط لازم را نداشته باشند در بخش **Skipped** نمایش داده می‌شوند.

---

## 🚫 Supported Conditions

در حال حاضر ابزار فقط این موارد را پردازش می‌کند:

### Protocol

```text
VLESS
Trojan
```

### Security

```text
TLS
```

کانفیگ‌هایی که:

```text
security != tls
```

داشته باشند پردازش نمی‌شوند.

برای مثال کانفیگ‌های بدون TLS یا کانفیگ‌هایی با Reality در نسخه فعلی این ابزار پردازش نمی‌شوند.

---

## 🔐 Privacy

تمام پردازش‌ها در مرورگر انجام می‌شود.

کانفیگ واردشده برای پردازش به سرور خارجی ارسال نمی‌شود.

---

## 📥 Download

خروجی را می‌توان مستقیماً به‌صورت فایل متنی دانلود کرد.

نام فایل به شکل زیر خواهد بود:

```text
enhanced-configs-<timestamp>.txt
```

---


## ⚠️ Disclaimer

این ابزار صرفاً پارامترهای مشخص‌شده را به کانفیگ‌های سازگار اضافه یا جایگزین می‌کند.

موفقیت اتصال، پایداری، تأخیر، کیفیت مسیر شبکه و سازگاری نهایی کانفیگ به سرویس‌دهنده، سرور، کلاینت مورد استفاده و شرایط شبکه بستگی دارد.

این ابزار به‌تنهایی اتصال یا پینگ سرور را تست نمی‌کند.

## پیش‌نیاز کلاینت

- **Windows** — v2rayN نسخه **7.24.7** یا بالاتر
- **Android** — [PattNG](https://github.com/patterniha/PattNG) یا v2rayNG نسخه **2.3.4** یا بالاتر

## تشکر و حق کپیرایت

تمامی منطق اصلی مربوط به پروژه‌های زیر است:

- [Proxy Builder](https://github.com/Hidden-Node/proxy-builder) — [Hidden-Node](https://github.com/Hidden-Node)
- [PattNG](https://github.com/patterniha/PattNG) (منطق cs / fm / fp) — [patterniha](https://github.com/patterniha)
- [BPB Worker Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel) — [bia-pain-bache](https://github.com/bia-pain-bache)

تمامی حقوق مربوط به پروژه‌های اصلی و سازندگانشان محفوظ است. این پروژه یک ابزار جانبی برای راحت‌تر کردن فرآیند استفاده از آن‌هاست.


