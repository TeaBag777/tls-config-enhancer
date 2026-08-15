# TLS Config Enhancer

بهینه‌سازی دسته‌ای کانفیگ‌های VLESS و Trojan با TLS — افزودن cipher suites, fragment mask و fingerprint

## این ابزار چی کار میکنه؟

فقط کانفیگ‌های **VLESS** و **Trojan** که **security=tls** دارن رو پیدا میکنه و سه پارامتر بهشون اضافه میکنه:

- **fp** = `unsafe` (TLS Fingerprint)
- **cs** = 14 تا Cipher Suite برای TLS Handshake
- **fm** = Final Mask / Fragment برای TLS Hello Fragmentation

کانفیگ‌های reality، vmess، ss و غیره رد میشن.

## پیش‌نیاز کلاینت

- **Windows** — v2rayN نسخه **7.24.7** یا بالاتر
- **Android** — [PattNG](https://github.com/patterniha/PattNG) یا v2rayNG نسخه **2.3.4** یا بالاتر

## تشکر و حق کپیرایت

تمامی منطق اصلی مربوط به پروژه‌های زیر است:

- [Proxy Builder](https://github.com/Hidden-Node/proxy-builder) — [Hidden-Node](https://github.com/Hidden-Node)
- [PattNG](https://github.com/patterniha/PattNG) (منطق cs / fm / fp) — [patterniha](https://github.com/patterniha)
- [BPB Worker Panel](https://github.com/bia-pain-bache/BPB-Worker-Panel) — [bia-pain-bache](https://github.com/bia-pain-bache)

تمامی حقوق مربوط به پروژه‌های اصلی و سازندگانشان محفوظ است. این پروژه یک ابزار جانبی برای راحت‌تر کردن فرآیند استفاده از آن‌هاست.

## لایسنس

MIT
