/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Kullanıcı işlemleri
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı oluştur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Kullanıcının tam adı
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Kullanıcının e-posta adresi
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Kullanıcının şifresi
 *                 example: "password123"
 *             required:
 *               - fullName
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Kullanıcı başarıyla kaydedildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "User registered. Please verify email."
 *       400:
 *         description: Geçersiz giriş veya doğrulama hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Email already used"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Kullanıcı girişi yap
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Kullanıcının e-posta adresi
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 description: Kullanıcının şifresi
 *                 example: "password123"
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Giriş başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Kullanıcı için oluşturulan JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Geçersiz giriş bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Invalid credentials"
 *       403:
 *         description: E-posta doğrulanmamış
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Email not verified"
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "User not found"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: Şifre sıfırlama talebi gönder
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Kullanıcının e-posta adresi
 *                 example: "johndoe@example.com"
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Şifre sıfırlama e-postası başarıyla gönderildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Password reset email sent."
 *       400:
 *         description: Geçersiz giriş bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Invalid email format"
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "User not found"
 *       429:
 *         description: Çok fazla istek gönderildi (Rate Limiting)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Too many requests. Please try again later."
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/reset-password/{token}:
 *   post:
 *     summary: Şifre sıfırla
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Şifre sıfırlama token'ı
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Kullanıcının yeni şifresi
 *                 example: "newpassword123"
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Şifre başarıyla sıfırlandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Password updated successfully."
 *       400:
 *         description: Geçersiz veya süresi dolmuş token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Invalid or expired token."
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "User not found"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Kullanıcı profilini güncelle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Kullanıcının tam adı
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 description: Kullanıcının yeni e-posta adresi
 *                 example: "johndoe@example.com"
 *               photoUrl:
 *                 type: string
 *                 description: Kullanıcının profil fotoğrafı URL'si
 *                 example: "https://example.com/profile.jpg"
 *             required:
 *               - fullName
 *     responses:
 *       200:
 *         description: Profil başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Profile updated successfully."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Kullanıcı ID'si
 *                     fullName:
 *                       type: string
 *                       description: Kullanıcının tam adı
 *                     email:
 *                       type: string
 *                       description: Kullanıcının e-posta adresi
 *                     photoUrl:
 *                       type: string
 *                       description: Kullanıcının profil fotoğrafı URL'si
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Kullanıcının oluşturulma tarihi
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Kullanıcının güncellenme tarihi
 *       400:
 *         description: Geçersiz giriş veya doğrulama hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Email already in use"
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "User not found"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/verify/{token}:
 *   get:
 *     summary: Kullanıcı e-posta doğrulama
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: E-posta doğrulama token'ı
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E-posta başarıyla doğrulandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Email verified successfully."
 *       400:
 *         description: Geçersiz veya süresi dolmuş token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Verification token has expired. Please request a new verification email."
 *       404:
 *         description: Kullanıcı bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "User not found"
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */

/**
 * @swagger
 * /api/users/assign-role:
 *   put:
 *     summary: Kullanıcıya yeni bir rol atama (Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: Rol atanacak kullanıcının ID'si
 *                 example: "123"
 *               roleId:
 *                 type: string
 *                 description: Atanacak yeni rolün ID'si
 *                 example: "2"
 *             required:
 *               - userId
 *               - roleId
 *     responses:
 *       200:
 *         description: Rol başarıyla atandı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Role assigned successfully."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Kullanıcı ID'si
 *                     fullName:
 *                       type: string
 *                       description: Kullanıcının tam adı
 *                     email:
 *                       type: string
 *                       description: Kullanıcının e-posta adresi
 *                     roleId:
 *                       type: string
 *                       description: Kullanıcının yeni rol ID'si
 *       400:
 *         description: Geçersiz giriş veya doğrulama hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Invalid input data"
 *       403:
 *         description: Yetkisiz erişim (Admin değil)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Access denied. Only admins can assign roles."
 *       404:
 *         description: Kullanıcı veya rol bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: User not found veya Role not found
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Internal server error"
 */