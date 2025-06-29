const Joi = require('joi');

// Yorum güncelleme DTO'su
const updateCommentDTO = Joi.object({
    content: Joi.string().min(1).max(500).required(),
});

module.exports = updateCommentDTO;