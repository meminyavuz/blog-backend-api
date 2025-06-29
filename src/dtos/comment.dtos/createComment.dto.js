const Joi = require('joi');

const createCommentDTO = Joi.object({
    articleId: Joi.string().uuid().required(),
    content: Joi.string().min(1).max(500).required(),
});

module.exports =  createCommentDTO;