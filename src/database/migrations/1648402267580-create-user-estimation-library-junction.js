module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_estimation_library", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      estimationId: {
        type: Sequelize.INTEGER,
      },
      equipmentId: {
        type: Sequelize.INTEGER,
      },
      materialId: {
        type: Sequelize.INTEGER,
      },
      labourId: {
        type: Sequelize.INTEGER,
      },
      subContractorId: {
        type: Sequelize.INTEGER,
      },
      equipmentPerformance: {
        type: Sequelize.DECIMAL(100, 2),
      },
      equipmentTotalAmount: {
        type: Sequelize.DECIMAL(100, 2),
      },
      materialFactorQuantity: {
        type: Sequelize.DECIMAL(100, 2),
      },
      materialTotalAmount: {
        type: Sequelize.DECIMAL(100, 2),
      },
      labourFactorQuantity: {
        type: Sequelize.DECIMAL(100, 2),
      },
      labourTotalAmount: {
        type: Sequelize.DECIMAL(100, 2),
      },
      subContractorTotalAmount: {
        type: Sequelize.DECIMAL(100, 2),
      },
      projectId: { type: Sequelize.INTEGER },
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
    await queryInterface.dropTable("user_estimation_library");
  },
};
