'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.menu, {
        foreignKey: "id_menu",
        as: "menu"
      })
      this.belongsTo(models.transaksi, {
        foreignKey: "id_transaksi",
        as: "transaksi"
      })
    }
  }
  detail_transaksi.init({
    id_detail_transaksi: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      autoIncrement: true
    },
    id_transaksi: DataTypes.INTEGER(11),
    id_menu: DataTypes.INTEGER(11),
    quantity: DataTypes.INTEGER(11),
    harga: DataTypes.INTEGER(11)
  }, {
    sequelize,
    modelName: 'detail_transaksi',
    tableName: 'detail_transaksi'
  });
  return detail_transaksi;
};