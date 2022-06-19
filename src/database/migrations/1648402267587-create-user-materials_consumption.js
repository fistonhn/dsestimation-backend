module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("material_consumption", {
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
      materialId: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: Sequelize.DECIMAL,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("material_consumption");
  },
};
