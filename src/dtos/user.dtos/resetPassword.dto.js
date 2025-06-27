const Joi = require('joi');

const resetPasswordDTO = Joi.object({
  newPassword: Joi.string().min(6).max(30).required(),
});

module.exports = resetPasswordDTO;