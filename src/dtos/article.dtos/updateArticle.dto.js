const Joi = require('joi');

const updateArticleDTO = Joi.object({
  title: Joi.string().min(3).max(255).optional(),
  content: Joi.string().min(10).optional(),
  status: Joi.string().uuid().optional(),
});

module.exports = updateArticleDTO;