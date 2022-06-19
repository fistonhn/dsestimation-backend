module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_estimations_consumption", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      executedQuantity: {
        type: Sequelize.DECIMAL,
      },
      estimationId: {
        type: Sequelize.INTEGER,
      },
      remainingQuantity: {
        type: Sequelize.DECIMAL,
      },
      percentage: {
        type: Sequelize.DECIMAL,
      },
      executedDate: {
        type: Sequelize.DATE,
      },
      totalEquipmentConsumed: {
        type: Sequelize.DECIMAL,
      },
      totalLabourConsumed: {
        type: Sequelize.DECIMAL,
      },
      totalMaterialConsumed: {
        type: Sequelize.DECIMAL,
      },
      totalSubcontractorConsumed: {
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_estimations_consumption");
  },
};
