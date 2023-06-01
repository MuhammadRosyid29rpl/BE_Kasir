'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_transaksis', {
      id_detail_transaksi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_transaksi: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "transaksi",
          key: "id_transaksi"
        }
      },
      id_menu: {
        type: Sequelize.INTEGER(11),
        references: {
          model: "menu",
          key: "id_menu"
        }
      },
      quantity: {
        type: Sequelize.INTEGER(11)
      },
      harga: {
        type: Sequelize.INTEGER(11)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_transaksi');
  }
};