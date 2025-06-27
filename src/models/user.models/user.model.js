const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Role = require('./role.model');
const bcrypt = require('bcrypt'); // Şifre hashleme için bcrypt modülü

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
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Role, // Role tablosuna referans
      key: 'id',
    },
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  photoUrl: {
    type: DataTypes.STRING, // Fotoğraf URL'si
    allowNull: true,
  },
}, {
  tableName: 'Users', // Veritabanında kullanılacak tablo adı
  timestamps: true,
  hooks: {
    // Şifre hashleme işlemi
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
});

// Benzersiz email kontrolü
User.addHook('beforeValidate', async (user, options) => {
  const existingUser = await User.findOne({ where: { email: user.email } });
  if (existingUser && existingUser.id !== user.id) {
    throw new Error('Email already in use');
  }
});

//Şifre doğrulama
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};


module.exports = User;