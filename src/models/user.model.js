const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { sequelize } = require('../config/database');

// Kullanıcı Modeli
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true, // Email formatını doğrular
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'author', 'reader'),
    defaultValue: 'reader',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  photoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  hooks: {
    // Şifreyi kaydetmeden önce hashle
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
});

// Şifre Doğrulama Metodu
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Kullanıcıdan şifreyi kaldırarak JSON döndürme
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password; // Şifreyi JSON'dan kaldır
  return values;
};



module.exports = User;