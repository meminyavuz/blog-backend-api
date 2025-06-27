const Joi = require('joi');

// Yorum oluşturma DTO'su
const createCommentDto = Joi.object({
    articleId: Joi.string().uuid().required(),
    content: Joi.string().min(1).required()
});

module.exports = { createCommentDto };