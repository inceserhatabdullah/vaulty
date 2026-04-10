# Vault Project Technical Documentation
Vault, hassas verileri (şifreler, notlar vb.) AES-256 şifreleme ve gelişmiş JWT oturum yönetimi stratejileriyle koruyan, Node.js tabanlı güvenli bir backend servisidir.

# Kimlik Doğrulama ve Yetkilendirme

1. Güvenli Kayıt ve Giriş (Signup & Signin)
- Argon2 Hashing: Kullanıcı şifreleri ve Vault PIN'leri, endüstri standardı olan Argon2id algoritması ile hash'lenerek saklanır.
- Dual Token Response: İşlem başarılı olduğunda kullanıcıya kısa ömürlü bir accessToken ve uzun ömürlü bir refreshToken üretilir.

2. Gelişmiş Oturum Yönetimi
- HttpOnly & Secure Cookies: refreshToken, tarayıcı tarafındaki JavaScript erişimine kapalı (XSS korumalı) cookie'lerde saklanır.
- Path Scoping: Cookie'ler sadece `/auth/refresh` dizinine özel kısıtlanarak veri sızıntısı minimize edilir.
- Token Rotation: Her refresh işleminde eski refreshToken imha edilir ve yeni bir tane üretilir. Bu sayede çalınan token'ların ömrü kısalır.
- Device Awareness: Oturumlar cihaz bazlı (User-Agent ve IP) takip edilir. Cihaz uyuşmazlığı durumunda güvenlik alarmı tetiklenir.

3. Oturum Kapatma (Logout)
- Tekli & Global Logout: Kullanıcı dilerse sadece mevcut cihazdaki oturumunu, dilerse tüm cihazlardaki aktif oturumlarını tek tıkla sonlandırabilir.
- Automatic Revoking: Veritabanında karşılığı bulunmayan bir refresh isteği geldiğinde (Reuse Detection), kullanıcıya ait tüm oturumlar güvenlik gerekçesiyle otomatik olarak silinir.

4. Şifre Üretici (Password Generator)
- Cryptographically Secure: Tahmin edilmesi imkansız, yüksek entropiye sahip rastgele şifre üretim mekanizması sunar.

# Sır Saklama ve Şifreleme
1. Veri Şifreleme (Create Secret)
- AES-256-GCM: Veriler veritabanına kaydedilmeden önce AES-256 algoritması ile şifrelenir.
- Master Key & PIN Logic: Veriler sadece kullanıcının Vault PIN'i ile türetilen anahtarlarla çözülebilir. Sunucu sahibi bile anahtar olmadan veriye erişemez.

2. Veri Çözme (Decrypt Secret)
- Header-Based Verification: Hassas veriyi çözmek için gerekli olan vault-pin, request body yerine özel bir request header üzerinden güvenli bir şekilde taşınır.
- Ownership Check: Her sır (secret), onu oluşturan userId ile sıkı sıkıya bağlıdır. Yetkisiz erişim denemeleri veritabanı seviyesinde engellenir.