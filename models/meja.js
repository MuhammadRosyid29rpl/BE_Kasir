'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class meja extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.transaksi, {
        foreignKey: "id_meja",
        as: "transaksi"
      })
    }
  }
  meja.init({
    id_meja: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    nomor_meja: DataTypes.STRING(100),
    status: DataTypes.ENUM("tersedia", "non_tersedia"),

  }, {
    sequelize,
    modelName: 'meja',
    tableName: 'meja'
  });
  return meja;
};