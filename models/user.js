'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaksi, {
        foreignKey: "id_user",
        as: "transaksi"
      })

    }
  }
  user.init({
    id_user: {
      type: DataTypes.INTEGER(11),
      autoIncrement: true,
      primaryKey: true
    },
    nama_user: DataTypes.STRING(11),
    role: DataTypes.ENUM('admin', 'kasir', 'manajer'),
    username: DataTypes.STRING(100),
    password: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'user',
    tableName: "user"
  });
  return user;
};