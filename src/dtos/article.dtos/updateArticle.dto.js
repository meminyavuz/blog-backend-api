const Joi = require('joi');

const UpdateArticleDTO = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  content: Joi.string().min(10).optional(),
  status: Joi.string().optional(),
});

module.exports = UpdateArticleDTO;