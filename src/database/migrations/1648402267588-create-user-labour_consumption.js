module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("labour_consumption", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      unit: {
        type: Sequelize.STRING,
      },
      estimationId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      consumedQuantity: {
        type: Sequelize.DECIMAL,
      },
      consumedPrice: {
        type: Sequelize.DECIMAL,
      },
      consumedDate: {
        type: Sequelize.DATE,
      },
      consumedTotal: {
        type: Sequelize.DECIMAL,
      },
      labourId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      percentage: {
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
    await queryInterface.dropTable("labour_consumption");
  },
};
