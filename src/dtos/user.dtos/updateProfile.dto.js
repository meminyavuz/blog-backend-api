const Joi = require('joi');

const updateProfileDTO = Joi.object({
  fullName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  photoUrl: Joi.string().uri().optional(),
});

module.exports = updateProfileDTO;