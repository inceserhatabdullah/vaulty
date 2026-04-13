# Vaulty
- Vaulty, hassas verileri AES-256-GCM şifreleme ve Stateless-Stateful Hybrid oturum yönetimi stratejileriyle koruyan, yüksek güvenlikli bir backend servisidir.

# Mimari Yaklaşım
- Proje, Layered Architecture (Katmanlı Mimari) prensipleriyle geliştirilmiştir:
- Controller Layer: Request validation (Zod) ve veri ayrıştırma.
- Service Layer (Business Logic): İş mantığı ve güvenlik protokollerinin icrası.
- Repository Layer (Data Access): Soyutlanmış veritabanı işlemleri (MongoDB/Mongoose).

# Kimlik Doğrulama ve Yetkilendirme
1. Şifreleme ve Hashleme
- Argon2id Hashing: Kullanıcı şifreleri ve Vault PIN'leri, GPU saldırılarına dayanıklı Argon2id algoritması kullanılarak "salt" ile hash'lenir.

- Dual Token Yapısı: 1 saat Short-lived Access Token ve 7 günlük Long-lived Refresh Token.

2. Gelişmiş Oturum (Session) Yönetimi
- Stateful Refresh Tokens: Refresh token'lar veritabanında sessions koleksiyonu ile eşleştirilir. Bu, sunucunun dilediği an bir oturumu "iptal etme" (revoke) yeteneği kazanmasını sağlar.

- Reuse Detection: Eğer eski bir refreshToken ile sisteme erişilmeye çalışılırsa, sistem bunu bir saldırı (token çalınması) kabul eder ve kullanıcının tüm aktif oturumlarını anında temizler.

3. Oturum Denetimi (Sessions API)
- Remote Logout: Kullanıcı GET /auth/sessions ile tüm cihazlarını görebilir ve DELETE /auth/sessions/:id ile çalınan veya açık unutulan cihazın "fişini uzaktan çekebilir".

# Sır Saklama ve Kasa Güvenliği
1. End-to-End Encryption Mantığı
- AES-256-GCM: Veriler sadece şifrelenmez, aynı zamanda GCM (Galois/Counter Mode) sayesinde verinin bütünlüğü (integrity) de kontrol edilir. Veri üzerinde 1 bit bile oynansa şifre çözülemez.

- Master Key Türetme: Sunucu, kullanıcının ana PIN'ini asla saklamaz. Şifreleme anahtarı, istek anında gönderilen vault-pin header'ı üzerinden çalışma zamanında (runtime) oluşturulur.

2. Veri Güvenliği Protokolü
- Header-Based Security: Hassas anahtarlar (PIN) asla request body veya URL parametresi olarak gönderilmez; sadece güvenli başlıklar (Custom Headers) üzerinden taşınır.

- Ownership Validation: Her Secret dokümanı, veritabanı seviyesinde bir ownerId ile korunur. Service katmanı, işlem yapan userId ile verinin sahibini eşleştirmeden asla deşifre işlemi başlatmaz.