const Joi = require('joi');

const ListArticlesDTO = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  authorId: Joi.string().uuid().optional(),
  title: Joi.string().optional(),
  status: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = ListArticlesDTO;