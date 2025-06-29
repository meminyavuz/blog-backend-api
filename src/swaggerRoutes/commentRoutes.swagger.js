/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Yorum işlemleri
 */

/**
 * @swagger
 * /api/comments/add:
 *   post:
 *     summary: Bir makaleye yorum ekle
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articleId:
 *                 type: string
 *                 description: Yorum yapılacak makalenin ID'si
 *                 example: "123"
 *               content:
 *                 type: string
 *                 description: Yorumun içeriği
 *                 example: "Bu makale gerçekten çok bilgilendirici!"
 *             required:
 *               - articleId
 *               - content
 *     responses:
 *       201:
 *         description: Yorum başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Comment created successfully!"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Yorum ID'si
 *                     content:
 *                       type: string
 *                       description: Yorumun içeriği
 *                     articleId:
 *                       type: string
 *                       description: Yorumun yapıldığı makalenin ID'si
 *                     userId:
 *                       type: string
 *                       description: Yorumu yapan kullanıcının ID'si
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Yorumun oluşturulma tarihi
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
 *                   example: "Validation error: Content is required."
 *       404:
 *         description: Makale bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Article not found."
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
 *                   example: "An error occurred while creating the comment."
 */

/**
 * @swagger
 * /api/comments/delete/{id}:
 *   delete:
 *     summary: Belirli bir yorumu sil
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Silinecek yorumun ID'si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Yorum başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Comment deleted successfully."
 *       403:
 *         description: Yetkisiz erişim veya yorum silme izni yok
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Access denied. You do not have permission to delete this comment."
 *       404:
 *         description: Yorum bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Comment not found."
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
 *                   example: "An error occurred while deleting the comment."
 */
router.delete('/delete/:id', authenticate, isAdmin, deleteComment);

// Yorum güncelleme
/**
 * @swagger
 * /api/comments/update/{id}:
 *   put:
 *     summary: Belirli bir yorumu güncelle
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Güncellenecek yorumun ID'si
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Yorumun yeni içeriği
 *                 example: "Bu yorum güncellenmiştir."
 *             required:
 *               - content
 *     responses:
 *       200:
 *         description: Yorum başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Başarı mesajı
 *                   example: "Comment updated successfully!"
 *                 comment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Yorum ID'si
 *                     content:
 *                       type: string
 *                       description: Güncellenmiş yorum içeriği
 *                     articleId:
 *                       type: string
 *                       description: Yorumun ait olduğu makale ID'si
 *                     userId:
 *                       type: string
 *                       description: Yorumu yapan kullanıcının ID'si
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Yorumun oluşturulma tarihi
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Yorumun güncellenme tarihi
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
 *                   example: "Content is required."
 *       404:
 *         description: Yorum bulunamadı veya kullanıcı sahibi değil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Comment not found or you are not the owner."
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
 *                   example: "An error occurred while updating the comment."
 */

/**
 * @swagger
 * /api/comments/articles/{articleId}/comments:
 *   get:
 *     summary: Belirli bir makaleye ait yorumları listele
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: [] # JWT doğrulaması
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         description: Yorumları listelenecek makalenin ID'si
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Makaleye ait yorumlar başarıyla listelendi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Yorum ID'si
 *                       content:
 *                         type: string
 *                         description: Yorum içeriği
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: Yorumu yapan kullanıcının ID'si
 *                           fullName:
 *                             type: string
 *                             description: Yorumu yapan kullanıcının tam adı
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Yorumun oluşturulma tarihi
 *       404:
 *         description: Makale bulunamadı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Hata mesajı
 *                   example: "Article not found."
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
 *                   example: "An error occurred while fetching comments."
 */