const Joi = require('joi');

// Yorum güncelleme DTO'su
const updateCommentDto = Joi.object({
    content: Joi.string().min(1).required().messages({
        'string.base': 'Content must be a string.',
        'string.empty': 'Content cannot be empty.',
        'any.required': 'Content is required.',
    }),
});

module.exports = { updateCommentDto };