const Comment = require('../models/comment.models/comment.model'); 
const Article = require('../models/article.models/article.model'); 
const User = require('../models/user.models/user.model');
const createCommentDTO = require('../dtos/comment.dtos/createComment.dto');
const updateCommentDTO = require('../dtos/comment.dtos/updateComment.dto');

const createComment = async (req, res) => {
    try {
        console.log(createCommentDTO);
        // DTO doğrulaması
        const { error, value } = createCommentDTO.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { articleId, content } = value;

        // Makale kontrolü
        const article = await Article.findByPk(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        // Yorum oluşturma
        const comment = await Comment.create({
            content,
            articleId,
            userId: req.user.id, // Giriş yapan kullanıcının ID'si
        });

        res.status(201).json({ message: 'Comment created successfully!', comment });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while creating the comment.', error: err.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Kullanıcının rolünü kontrol et
        const userRole = await Role.findByPk(req.user.roleId);
        if (!userRole) {
            return res.status(403).json({ message: 'Access denied. Role not found.' });
        }

        // Eğer kullanıcı admin ise yorumu doğrudan sil
        if (userRole.name === 'admin') {
            const comment = await Comment.findByPk(id);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found.' });
            }
            await comment.destroy();
            return res.status(200).json({ message: 'Comment deleted successfully by admin.' });
        }

        // Kullanıcı ise sadece kendi yorumunu silebilir
        const comment = await Comment.findOne({ where: { id, userId: req.user.id } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you do not have permission to delete it.' });
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while deleting the comment.', error: err.message });
    }
};

const updateComment = async (req, res) => {
    try {
        
        const { id } = req.params; // Yorum ID'si

        // DTO doğrulaması
        const { error, value } = updateCommentDTO.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const { content } = value; // Yeni içerik

        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }

        // Yorumun varlığını ve sahibini kontrol et
        const comment = await Comment.findOne({ where: { id, userId: req.user.id } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you are not the owner.' });
        }

        // Yorum güncelleme
        comment.content = content;
        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully!', comment });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while updating the comment.', error: err.message });
    }
};

const listCommentsByArticle = async (req, res) => {
    try {
        const { articleId } = req.params; // Makale ID'sini al
        console.log(articleId);

        // Makaleyi getir
        const article = await Article.findByPk(articleId, {
            attributes: ['id', 'title', 'content'], // Makale bilgileri
        });

        if (!article) {
            return res.status(404).json({ message: 'Article not found.' });
        }

        // Makaleye ait yorumları getir
        const comments = await Comment.findAll({
            where: { articleId }, // Yorumları makale ID'sine göre filtrele
            attributes: ['id', 'content', 'createdAt'], // Yorum bilgileri
        });

        if (!comments || comments.length === 0) {
            return res.status(404).json({ message: 'No comments found for this article.' });
        }

        // Yorumlara ait kullanıcıları getir
        const userIds = comments.map((comment) => comment.userId); // Yorumlardaki kullanıcı ID'lerini al
        const users = await User.findAll({
            where: { id: userIds }, // Kullanıcıları ID'lerine göre filtrele
            attributes: ['id', 'fullName', 'email'], // Kullanıcı bilgileri
        });

        // Yorumları ve kullanıcıları birleştir
        const commentsWithUsers = comments.map((comment) => {
            const user = users.find((u) => u.id === comment.userId); // Yorumun kullanıcısını bul
            return {
                ...comment.toJSON(),
                user, // Kullanıcı bilgilerini ekle
            };
        });

        // Sonuçları döndür
        res.status(200).json({
            article,
            comments: commentsWithUsers,
        });
    } catch (err) {
        console.error(err); // Hata detaylarını logla
        res.status(500).json({ message: 'An error occurred while fetching comments.', error: err.message });
    }
};
module.exports = { createComment, deleteComment, updateComment, listCommentsByArticle };