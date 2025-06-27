const Joi = require('joi');

const CreateArticleDTO = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  content: Joi.string().min(10).required(),
  statusId: Joi.string().uuid().optional(),
});

module.exports = CreateArticleDTO;