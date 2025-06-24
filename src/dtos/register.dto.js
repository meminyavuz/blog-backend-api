const Joi = require('joi');

const registerDTO = Joi.object({
  fullName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

module.exports = registerDTO;