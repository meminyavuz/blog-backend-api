/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Makale işlemleri
 */

/**
 * @swagger
 * /api/articles/published:
 *   get:
 *     summary: Yayınlanmış makaleleri listele
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına gösterilecek makale sayısı
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Başlıkta arama yapmak için bir kelime
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Belirli bir yazarın makalelerini filtrelemek için yazar ID'si
 *     responses:
 *       200:
 *         description: Yayınlanmış makaleler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Toplam makale sayısı
 *                 pages:
 *                   type: integer
 *                   description: Toplam sayfa sayısı
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Makale ID'si
 *                       title:
 *                         type: string
 *                         description: Makale başlığı
 *                       content:
 *                         type: string
 *                         description: Makale içeriği
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Makalenin oluşturulma tarihi
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Makalenin güncellenme tarihi
 *       400:
 *         description: Geçersiz sorgu parametreleri
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/articles/my-articles:
 *   get:
 *     summary: Kullanıcının kendi makalelerini listele
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına gösterilecek makale sayısı
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Başlıkta arama yapmak için bir kelime
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Kullanıcının makaleleri başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Toplam makale sayısı
 *                 pages:
 *                   type: integer
 *                   description: Toplam sayfa sayısı
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Makale ID'si
 *                       title:
 *                         type: string
 *                         description: Makale başlığı
 *                       content:
 *                         type: string
 *                         description: Makale içeriği
 *                       status:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Makalenin oluşturulma tarihi
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Makalenin güncellenme tarihi
 *       400:
 *         description: Geçersiz sorgu parametreleri
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/articles/create:
 *   post:
 *     summary: Yeni makale oluştur
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Makalenin başlığı
 *                 example: "Yeni Makale Başlığı"
 *               content:
 *                 type: string
 *                 description: Makalenin içeriği
 *                 example: "Bu makalenin içeriğidir."
 *               statusId:
 *                 type: string
 *                 description: Makalenin durumu örneğin published, draft
 *                 example: "1"
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: Makale başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Article created successfully!"
 *                 article:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Makale ID'si
 *                     title:
 *                       type: string
 *                       description: Makale başlığı
 *                     content:
 *                       type: string
 *                       description: Makale içeriği
 *                     statusId:
 *                       type: string
 *                       description: Makalenin durumu
 *                     authorId:
 *                       type: string
 *                       description: Makalenin yazarı
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Makalenin oluşturulma tarihi
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Makalenin güncellenme tarihi
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
 *                   example: "Validation error"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Hata detayı
 *       401:
 *         description: Yetkisiz erişim
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/articles/all:
 *   get:
 *     summary: Tüm makaleleri listele (Admin)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Sayfa başına gösterilecek makale sayısı
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: string
 *         description: Belirli bir yazarın makalelerini filtrelemek için yazar ID'si
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Başlıkta arama yapmak için bir kelime
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Makale durumu (örneğin published, draft)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Tarihe göre sıralama asc artan, desc azalan
 *     responses:
 *       200:
 *         description: Tüm makaleler başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Toplam makale sayısı
 *                 pages:
 *                   type: integer
 *                   description: Toplam sayfa sayısı
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Makale ID'si
 *                       title:
 *                         type: string
 *                         description: Makale başlığı
 *                       content:
 *                         type: string
 *                         description: Makale içeriği
 *                       statusId:
 *                         type: string
 *                         description: Makalenin durumu
 *                       authorId:
 *                         type: string
 *                         description: Makalenin yazarı
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Makalenin oluşturulma tarihi
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Makalenin güncellenme tarihi
 *       400:
 *         description: Geçersiz sorgu parametreleri
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Admin yetkisi gereklidir
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/articles/{slug}:
 *   get:
 *     summary: Slug ile makale getir
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         description: Makalenin slug değeri
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Makale başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Makale ID'si
 *                     title:
 *                       type: string
 *                       description: Makale başlığı
 *                     content:
 *                       type: string
 *                       description: Makale içeriği
 *                     slug:
 *                       type: string
 *                       description: Makalenin slug değeri
 *                     statusId:
 *                       type: string
 *                       description: Makalenin durumu
 *                     authorId:
 *                       type: string
 *                       description: Makalenin yazarı
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Makalenin oluşturulma tarihi
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Makalenin güncellenme tarihi
 *       401:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Makale bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Belirli bir makaleyi güncelle
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Güncellenecek makalenin ID'si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Makalenin yeni başlığı
 *                 example: "Güncellenmiş Makale Başlığı"
 *               content:
 *                 type: string
 *                 description: Makalenin yeni içeriği
 *                 example: "Bu makalenin güncellenmiş içeriğidir."
 *               status:
 *                 type: string
 *                 description: Makalenin yeni durumu (örneğin published, draft)
 *                 example: "published"
 *             required:
 *               - title
 *               - content
 *     responses:
 *       200:
 *         description: Makale başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Article updated successfully!"
 *                 article:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Makale ID'si
 *                     title:
 *                       type: string
 *                       description: Makale başlığı
 *                     content:
 *                       type: string
 *                       description: Makale içeriği
 *                     status:
 *                       type: string
 *                       description: Makalenin durumu
 *                     authorId:
 *                       type: string
 *                       description: Makalenin yazarı
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Makalenin oluşturulma tarihi
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Makalenin güncellenme tarihi
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
 *                   example: "Validation error"
 *                 error:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: Hata detayı
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Kullanıcı makalenin yazarı değil
 *       404:
 *         description: Makale bulunamadı
 *       500:
 *         description: Sunucu hatası
 */

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Belirli bir makaleyi sil
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek makalenin ID'si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Makale başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Article deleted successfully!"
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Kullanıcı makalenin yazarı değil
 *       404:
 *         description: Makale bulunamadı
 *       500:
 *         description: Sunucu hatası
 */