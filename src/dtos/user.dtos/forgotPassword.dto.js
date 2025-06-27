const Joi = require('joi');

const forgotPasswordDTO = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = forgotPasswordDTO;